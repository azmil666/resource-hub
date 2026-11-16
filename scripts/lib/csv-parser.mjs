/**
 * Zero-dependency RFC 4180 compliant CSV parser and serializer.
 */

export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;
  const len = csvText.length;

  while (i < len) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped double-quote inside quotes
        currentField += '"';
        i += 2;
        continue;
      }
      insideQuotes = !insideQuotes;
      i++;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      i++;
      continue;
    }

    currentField += char;
    i++;
  }

  // Push last field if present
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim() !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // Parse header
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const records = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty lines
    if (row.length === 1 && !row[0].trim()) continue;

    const record = {};
    for (let c = 0; c < headers.length; c++) {
      const val = row[c] !== undefined ? row[c].trim() : '';
      record[headers[c]] = val;
    }
    records.push(record);
  }

  return records;
}

export function serializeCSV(records, fields) {
  if (!records || records.length === 0) return '';
  const cols = fields || Object.keys(records[0]);

  const escapeField = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = cols.map(escapeField).join(',');
  const dataRows = records.map(record =>
    cols.map(c => escapeField(record[c])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}
