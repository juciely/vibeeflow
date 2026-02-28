import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import config from './migration-config.json' assert { type: 'json' };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const outputDir = join(process.cwd(), 'scripts', 'exports', 'storage');

async function exportBucket(bucket) {
  mkdirSync(join(outputDir, bucket), { recursive: true });
  const { data: files, error } = await supabase.storage.from(bucket).list();
  if (error) {
    console.error(`Error listing ${bucket}:`, error.message);
    return;
  }
  for (const file of files) {
    const { data, error: dlError } = await supabase.storage.from(bucket).download(file.name);
    if (dlError) {
      console.error(`Error downloading ${file.name}:`, dlError.message);
      continue;
    }
    const buffer = Buffer.from(await data.arrayBuffer());
    writeFileSync(join(outputDir, bucket, file.name), buffer);
    console.log(`Downloaded ${bucket}/${file.name}`);
  }
}

async function main() {
  console.log('Starting storage export...');
  if (!config.storage_buckets?.length) {
    console.log('No storage buckets configured.');
    return;
  }
  for (const bucket of config.storage_buckets) {
    await exportBucket(bucket);
  }
  console.log('Storage export complete.');
}

main().catch(console.error);
