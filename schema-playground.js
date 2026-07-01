/* Schema Playground — build tables from scratch with FK references */

const PG_STORAGE_KEY = 'schemaPlayground_schemas';
const PG_COLUMN_TYPES = [
  'INT',
  'VARCHAR(50)',
  'VARCHAR(80)',
  'VARCHAR(255)',
  'TEXT',
  'DATE',
  'DECIMAL(10,2)',
  'BOOLEAN',
];

const SchemaPlayground = {
  schemas: {},
  selectedTable: null,
  isBuilding: false,
  activeMode: 'practice',

  init() {
    this.loadSchemas();
    this.bindEvents();
    this.renderTableList();
    this.updateTableCount();
  },

  loadSchemas() {
    try {
      const saved = JSON.parse(localStorage.getItem(PG_STORAGE_KEY) || '{}');
      this.schemas = saved && typeof saved === 'object' ? saved : {};
    } catch {
      this.schemas = {};
    }
  },

  saveSchemas() {
    localStorage.setItem(PG_STORAGE_KEY, JSON.stringify(this.schemas));
    this.updateTableCount();
  },

  updateTableCount() {
    const el = document.getElementById('tableCount');
    if (!el) return;
    if (this.activeMode === 'playground') {
      el.textContent = Object.keys(this.schemas).length;
    }
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  validIdentifier(name) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  },

  getPkColumns(tableName) {
    const schema = this.schemas[tableName];
    if (!schema) return [];
    return schema.columns.filter((c) => c.pk).map((c) => c.name);
  },

  getAllReferenceTargets() {
    const targets = [];
    for (const [table, schema] of Object.entries(this.schemas)) {
      for (const col of schema.columns) {
        if (col.pk) {
          targets.push({ table, column: col.name, label: `${table}.${col.name}` });
        }
      }
    }
    return targets;
  },

  buildCreateSql(tableName, columns) {
    const defs = columns.map((col) => {
      let line = `  ${col.name} ${col.type}`;
      if (col.pk) line += ' PRIMARY KEY';
      return line;
    });
    return `CREATE TABLE ${tableName} (\n${defs.join(',\n')}\n);`;
  },

  buildFkKeyLabel(fk) {
    if (!fk || !fk.table || !fk.column) return '';
    return `FK → ${fk.table}.${fk.column}`;
  },

  dropAllPlaygroundTables() {
    for (const name of Object.keys(this.schemas)) {
      try {
        alasql(`DROP TABLE IF EXISTS ${name}`);
      } catch {
        /* ignore */
      }
    }
  },

  syncDatabase() {
    this.dropAllPlaygroundTables();
    for (const [tableName, schema] of Object.entries(this.schemas)) {
      const sql = this.buildCreateSql(tableName, schema.columns);
      alasql(sql);
    }
  },

  activate() {
    this.activeMode = 'playground';
    this.syncDatabase();
    this.renderTableList();
    this.renderErDiagram();
    this.updateTableCount();
    this.showBuilderEmpty();
  },

  deactivate() {
    this.activeMode = 'practice';
    this.dropAllPlaygroundTables();
  },

  bindEvents() {
    document.getElementById('pgBtnNewTable')?.addEventListener('click', () => this.startNewTable());
    document.getElementById('pgBtnAddColumn')?.addEventListener('click', () => this.addColumnRow());
    document.getElementById('pgBtnCancelEdit')?.addEventListener('click', () => this.cancelBuild());
    document.getElementById('pgTableForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createTable();
    });
    document.getElementById('pgBtnDropTable')?.addEventListener('click', () => this.dropSelectedTable());
    document.getElementById('pgBtnClearAll')?.addEventListener('click', () => this.clearAll());
    document.getElementById('pgBtnRunQuery')?.addEventListener('click', () => this.runPlaygroundQuery());

    document.getElementById('pgQueryEditor')?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runPlaygroundQuery();
      }
    });

    document.getElementById('pgTableName')?.addEventListener('input', () => this.updateSqlPreview());
    document.getElementById('pgColumnRows')?.addEventListener('input', () => this.updateSqlPreview());
    document.getElementById('pgColumnRows')?.addEventListener('change', (e) => {
      if (e.target.matches('.pg-fk-toggle, .pg-fk-table, .pg-col-pk-input')) {
        this.refreshFkDropdowns();
        this.updateSqlPreview();
      }
    });
  },

  showBuilderEmpty() {
    document.getElementById('pgBuilderEmpty')?.classList.remove('hidden');
    document.getElementById('pgTableForm')?.classList.add('hidden');
    document.getElementById('pgTableDetail')?.classList.add('hidden');
    document.getElementById('pgBuilderTitle').textContent = 'Table Builder';
    this.isBuilding = false;
    this.selectedTable = null;
    document.querySelectorAll('#pgTableList button.table-list-btn').forEach((b) => b.classList.remove('active'));
  },

  startNewTable() {
    this.isBuilding = true;
    this.selectedTable = null;
    document.getElementById('pgBuilderEmpty')?.classList.add('hidden');
    document.getElementById('pgTableDetail')?.classList.add('hidden');
    document.getElementById('pgTableForm')?.classList.remove('hidden');
    document.getElementById('pgBuilderTitle').textContent = 'New Table';
    document.getElementById('pgTableName').value = '';
    document.getElementById('pgTableName').disabled = false;

    const tbody = document.getElementById('pgColumnRows');
    tbody.innerHTML = '';
    this.addColumnRow({ name: 'id', type: 'INT', pk: true, fk: null });
    this.addColumnRow();
    this.updateSqlPreview();
    document.querySelectorAll('#pgTableList button.table-list-btn').forEach((b) => b.classList.remove('active'));
  },

  cancelBuild() {
    if (this.selectedTable) {
      this.selectTable(this.selectedTable);
    } else {
      this.showBuilderEmpty();
      this.updateSqlPreview();
    }
  },

  addColumnRow(preset = {}) {
    const tbody = document.getElementById('pgColumnRows');
    const rowId = `pg-row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const tr = document.createElement('tr');
    tr.dataset.rowId = rowId;

    const typeOptions = PG_COLUMN_TYPES.map(
      (t) => `<option value="${t}"${preset.type === t ? ' selected' : ''}>${t}</option>`
    ).join('');

    const refTables = Object.keys(this.schemas);
    const tableOptions =
      '<option value="">— table —</option>' +
      refTables.map((t) => `<option value="${t}">${t}</option>`).join('');

    tr.innerHTML = `
      <td><input type="text" class="pg-col-name" placeholder="column_name" value="${this.escapeHtml(preset.name || '')}" required pattern="[a-zA-Z_][a-zA-Z0-9_]*"></td>
      <td><select class="pg-col-type">${typeOptions}</select></td>
      <td class="pg-col-pk"><input type="checkbox" class="pg-col-pk-input" ${preset.pk ? 'checked' : ''} title="Primary Key"></td>
      <td class="pg-fk-cell">
        <div class="pg-fk-wrap">
          <input type="checkbox" class="pg-fk-toggle" title="Foreign Key" ${preset.fk ? 'checked' : ''}>
          <select class="pg-fk-table" disabled>${tableOptions}</select>
          <select class="pg-fk-column" disabled><option value="">— column —</option></select>
        </div>
      </td>
      <td><button type="button" class="pg-btn-remove" title="Remove column">&times;</button></td>
    `;

    tbody.appendChild(tr);

    const fkToggle = tr.querySelector('.pg-fk-toggle');
    const fkTable = tr.querySelector('.pg-fk-table');
    const fkColumn = tr.querySelector('.pg-fk-column');
    const pkInput = tr.querySelector('.pg-col-pk-input');

    fkToggle.addEventListener('change', () => {
      const on = fkToggle.checked;
      fkTable.disabled = !on;
      fkColumn.disabled = !on;
      if (!on) {
        fkTable.value = '';
        fkColumn.innerHTML = '<option value="">— column —</option>';
      }
      this.updateSqlPreview();
    });

    fkTable.addEventListener('change', () => {
      this.populateFkColumnSelect(fkTable, fkColumn, preset.fk?.column);
      this.updateSqlPreview();
    });

    pkInput.addEventListener('change', () => this.updateSqlPreview());

    tr.querySelector('.pg-btn-remove').addEventListener('click', () => {
      if (tbody.children.length <= 1) return;
      tr.remove();
      this.refreshFkDropdowns();
      this.updateSqlPreview();
    });

    if (preset.fk?.table) {
      fkTable.value = preset.fk.table;
      this.populateFkColumnSelect(fkTable, fkColumn, preset.fk.column);
      fkTable.disabled = false;
      fkColumn.disabled = false;
    }

    this.updateSqlPreview();
  },

  populateFkColumnSelect(tableSelect, columnSelect, selectedColumn) {
    const table = tableSelect.value;
    const pks = table ? this.getPkColumns(table) : [];
    columnSelect.innerHTML =
      '<option value="">— column —</option>' +
      pks.map((c) => `<option value="${c}"${c === selectedColumn ? ' selected' : ''}>${c}</option>`).join('');
  },

  refreshFkDropdowns() {
    const currentTable = document.getElementById('pgTableName')?.value.trim();
    document.querySelectorAll('#pgColumnRows tr').forEach((tr) => {
      const fkTable = tr.querySelector('.pg-fk-table');
      const fkColumn = tr.querySelector('.pg-fk-column');
      const selectedTable = fkTable.value;
      const selectedCol = fkColumn.value;

      fkTable.innerHTML =
        '<option value="">— table —</option>' +
        Object.keys(this.schemas)
          .filter((t) => t !== currentTable)
          .map((t) => `<option value="${t}"${t === selectedTable ? ' selected' : ''}>${t}</option>`)
          .join('');

      this.populateFkColumnSelect(fkTable, fkColumn, selectedCol);
    });
  },

  readColumnsFromForm() {
    const columns = [];
    document.querySelectorAll('#pgColumnRows tr').forEach((tr) => {
      const name = tr.querySelector('.pg-col-name')?.value.trim();
      const type = tr.querySelector('.pg-col-type')?.value;
      const pk = tr.querySelector('.pg-col-pk-input')?.checked;
      const fkOn = tr.querySelector('.pg-fk-toggle')?.checked;
      const fkTable = tr.querySelector('.pg-fk-table')?.value;
      const fkColumn = tr.querySelector('.pg-fk-column')?.value;

      if (!name) return;

      let fk = null;
      if (fkOn && fkTable && fkColumn) {
        fk = { table: fkTable, column: fkColumn };
      }

      columns.push({ name, type, pk: !!pk, fk });
    });
    return columns;
  },

  updateSqlPreview() {
    const preview = document.getElementById('pgSqlPreview');
    if (!preview) return;

    if (!this.isBuilding) {
      if (this.selectedTable && this.schemas[this.selectedTable]) {
        preview.textContent = this.buildCreateSql(this.selectedTable, this.schemas[this.selectedTable].columns);
      } else {
        preview.textContent = '-- Build a table to see CREATE TABLE SQL';
      }
      return;
    }

    const tableName = document.getElementById('pgTableName')?.value.trim();
    const columns = this.readColumnsFromForm();
    if (!tableName || !columns.length) {
      preview.textContent = '-- Enter a table name and at least one column';
      return;
    }
    preview.textContent = this.buildCreateSql(tableName, columns);
  },

  createTable() {
    const tableName = document.getElementById('pgTableName').value.trim();
    const columns = this.readColumnsFromForm();

    if (!this.validIdentifier(tableName)) {
      alert('Table name must start with a letter or underscore and contain only letters, numbers, and underscores.');
      return;
    }

    if (!columns.length) {
      alert('Add at least one column.');
      return;
    }

    const names = columns.map((c) => c.name.toLowerCase());
    if (new Set(names).size !== names.length) {
      alert('Column names must be unique within the table.');
      return;
    }

    if (this.schemas[tableName]) {
      alert(`Table "${tableName}" already exists. Drop it first or choose another name.`);
      return;
    }

    for (const col of columns) {
      if (!this.validIdentifier(col.name)) {
        alert(`Invalid column name: "${col.name}"`);
        return;
      }
      if (col.fk) {
        if (!this.schemas[col.fk.table]) {
          alert(`Referenced table "${col.fk.table}" does not exist. Create it first.`);
          return;
        }
        const pkCols = this.getPkColumns(col.fk.table);
        if (!pkCols.includes(col.fk.column)) {
          alert(`"${col.fk.column}" is not a primary key on "${col.fk.table}".`);
          return;
        }
      }
    }

    this.schemas[tableName] = { columns };
    this.saveSchemas();

    try {
      alasql(this.buildCreateSql(tableName, columns));
    } catch (err) {
      delete this.schemas[tableName];
      this.saveSchemas();
      alert(`Failed to create table: ${err.message}`);
      return;
    }

    this.isBuilding = false;
    this.renderTableList();
    this.renderErDiagram();
    this.selectTable(tableName);
  },

  selectTable(tableName) {
    if (!this.schemas[tableName]) return;

    this.selectedTable = tableName;
    this.isBuilding = false;

    document.getElementById('pgBuilderEmpty')?.classList.add('hidden');
    document.getElementById('pgTableForm')?.classList.add('hidden');
    document.getElementById('pgTableDetail')?.classList.remove('hidden');
    document.getElementById('pgBuilderTitle').textContent = 'Table Details';

    document.querySelectorAll('#pgTableList button.table-list-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.table === tableName);
    });

    document.getElementById('pgDetailName').textContent = tableName;
    this.renderDetailSchema(tableName);
    this.renderDetailData(tableName);
    this.updateSqlPreview();
  },

  renderDetailSchema(tableName) {
    const schema = this.schemas[tableName];
    const container = document.getElementById('pgDetailSchema');
    if (!schema || !container) return;

    let html = `<table class="schema-table"><thead><tr><th>Column</th><th>Type</th><th>Key</th></tr></thead><tbody>`;
    for (const col of schema.columns) {
      let key = '—';
      let keyClass = '';
      if (col.pk) {
        key = 'PK';
        keyClass = 'pk';
      } else if (col.fk) {
        key = this.buildFkKeyLabel(col.fk);
        keyClass = 'fk';
      }
      html += `<tr><td>${this.escapeHtml(col.name)}</td><td>${this.escapeHtml(col.type)}</td><td class="${keyClass}">${this.escapeHtml(key)}</td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  },

  renderDetailData(tableName) {
    const container = document.getElementById('pgDetailData');
    if (!container) return;

    try {
      const data = alasql(`SELECT * FROM ${tableName}`);
      if (!data.length) {
        container.innerHTML = '<p class="empty-state" style="padding:1rem;">No rows yet. Use the SQL panel to INSERT data.</p>';
        return;
      }
      const columns = Object.keys(data[0]);
      const rows = data.map((row) => columns.map((c) => row[c] ?? 'NULL'));
      container.innerHTML = this.renderDataTable(columns, rows);
    } catch (err) {
      container.innerHTML = `<div class="message error">${this.escapeHtml(err.message)}</div>`;
    }
  },

  renderDataTable(columns, rows) {
    if (!rows.length) return '<p class="empty-state">No rows.</p>';
    let html = '<div class="data-table-wrap"><table class="data-table"><thead><tr>';
    for (const col of columns) html += `<th>${this.escapeHtml(col)}</th>`;
    html += '</tr></thead><tbody>';
    for (const row of rows) {
      html += '<tr>';
      for (const cell of row) {
        const val = cell === null || cell === undefined ? 'NULL' : cell;
        html += `<td>${this.escapeHtml(String(val))}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    return html;
  },

  renderTableList() {
    const list = document.getElementById('pgTableList');
    const hint = document.getElementById('pgEmptyHint');
    if (!list) return;

    const tables = Object.keys(this.schemas).sort();
    hint?.classList.toggle('hidden', tables.length > 0);

    list.innerHTML = tables
      .map(
        (name) =>
          `<li>
            <button class="table-list-btn${this.selectedTable === name ? ' active' : ''}" data-table="${this.escapeHtml(name)}" type="button">
              <span class="table-icon">▸</span>${this.escapeHtml(name)}
            </button>
            <button class="pg-table-delete" data-drop="${this.escapeHtml(name)}" type="button" title="Drop table">&times;</button>
          </li>`
      )
      .join('');

    list.querySelectorAll('.table-list-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.selectTable(btn.dataset.table));
    });

    list.querySelectorAll('.pg-table-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dropTable(btn.dataset.drop);
      });
    });
  },

  renderErDiagram() {
    const el = document.getElementById('pgErDiagram');
    if (!el) return;

    const lines = [];
    for (const [table, schema] of Object.entries(this.schemas)) {
      for (const col of schema.columns) {
        if (col.fk) {
          lines.push(`${col.fk.table}.${col.fk.column} ──< ${table}.${col.name}`);
        }
      }
    }

    el.textContent = lines.length ? lines.join('\n') : '—';
  },

  dropTable(tableName) {
    if (!this.schemas[tableName]) return;

    for (const [other, schema] of Object.entries(this.schemas)) {
      if (other === tableName) continue;
      for (const col of schema.columns) {
        if (col.fk?.table === tableName) {
          alert(`Cannot drop "${tableName}" — "${other}.${col.name}" references it. Drop or edit that table first.`);
          return;
        }
      }
    }

    if (!confirm(`Drop table "${tableName}"?`)) return;

    try {
      alasql(`DROP TABLE IF EXISTS ${tableName}`);
    } catch {
      /* ignore */
    }

    delete this.schemas[tableName];
    this.saveSchemas();

    if (this.selectedTable === tableName) {
      this.selectedTable = null;
      this.showBuilderEmpty();
    }

    this.renderTableList();
    this.renderErDiagram();
    this.updateSqlPreview();
  },

  dropSelectedTable() {
    if (this.selectedTable) this.dropTable(this.selectedTable);
  },

  clearAll() {
    if (!Object.keys(this.schemas).length) return;
    if (!confirm('Clear all playground tables? This cannot be undone.')) return;

    this.dropAllPlaygroundTables();
    this.schemas = {};
    this.saveSchemas();
    this.selectedTable = null;
    this.showBuilderEmpty();
    this.renderTableList();
    this.renderErDiagram();
    this.updateSqlPreview();
    document.getElementById('pgQueryResult').innerHTML = '';
  },

  runPlaygroundQuery() {
    const sql = document.getElementById('pgQueryEditor')?.value.trim();
    const resultEl = document.getElementById('pgQueryResult');
    if (!sql || !resultEl) return;

    try {
      const start = performance.now();
      const result = alasql(sql);
      const elapsed = Math.round(performance.now() - start);

      if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object') {
        const columns = Object.keys(result[0]);
        const rows = result.map((row) => columns.map((c) => row[c]));
        resultEl.innerHTML = `<p class="result-meta">${result.length} row(s) in ${elapsed}ms</p>${this.renderDataTable(columns, rows)}`;
      } else if (Array.isArray(result)) {
        resultEl.innerHTML = `<p class="message success">${result.length} row(s) returned in ${elapsed}ms.</p>`;
      } else {
        resultEl.innerHTML = `<p class="message success">${result} row(s) affected in ${elapsed}ms.</p>`;
      }

      if (this.selectedTable) this.renderDetailData(this.selectedTable);
    } catch (err) {
      resultEl.innerHTML = `<div class="message error">${this.escapeHtml(err.message)}</div>`;
    }
  },
};

document.addEventListener('DOMContentLoaded', () => SchemaPlayground.init());
