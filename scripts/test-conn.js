const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: path.resolve(process.cwd(), '.env.neon') });

const cs = process.env.DATABASE_URL || process.env.NEON_DIRECT_URL;
if (!cs) {
  console.error('No DATABASE_URL or NEON_DIRECT_URL found in .env.neon');
  process.exit(1);
}

console.log('Using connection string from .env.neon (masked):', cs.replace(/:[^:@]+@/, ':****@'));

const client = new Client({ connectionString: cs });

(async () => {
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    console.log('Connected, query result:', res.rows);
    await client.end();
    process.exit(0);
  } catch (e) {
    console.error('Connection error:');
    console.error(e);
    try { await client.end(); } catch(_){}
    process.exit(1);
  }
})();
