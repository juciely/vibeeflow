import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import config from './migration-config.json' assert { type: 'json' };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const outputDir = join(process.cwd(), 'scripts', 'exports');
mkdirSync(outputDir, { recursive: true });

async function exportTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Error exporting ${table}:`, error.message);
    return;
  }
  const filePath = join(outputDir, `${table}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Exported ${data.length} rows from ${table}`);
}

async function main() {
  console.log('Starting data export...');
  for (const table of config.exportOrder) {
    await exportTable(table);
  }
  console.log('Export complete. Files saved to scripts/exports/');
}

main().catch(console.error);
