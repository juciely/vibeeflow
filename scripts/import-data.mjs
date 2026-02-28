import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import config from './migration-config.json' assert { type: 'json' };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const inputDir = join(process.cwd(), 'scripts', 'exports');

async function importTable(table) {
  const filePath = join(inputDir, `${table}.json`);
  if (!existsSync(filePath)) {
    console.warn(`No export file for ${table}, skipping.`);
    return;
  }
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  if (!data.length) {
    console.log(`No data for ${table}, skipping.`);
    return;
  }
  const { error } = await supabase.from(table).upsert(data, { onConflict: 'id' });
  if (error) {
    console.error(`Error importing ${table}:`, error.message);
    return;
  }
  console.log(`Imported ${data.length} rows into ${table}`);
}

async function main() {
  console.log('Starting data import...');
  for (const table of config.exportOrder) {
    await importTable(table);
  }
  console.log('Import complete.');
}

main().catch(console.error);
