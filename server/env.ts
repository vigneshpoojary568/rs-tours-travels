// Imported first by server.ts so env vars are loaded before the other server modules read them.
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'], quiet: true });
