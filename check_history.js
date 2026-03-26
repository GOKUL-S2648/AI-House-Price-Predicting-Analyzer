import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic .env parser for .env.local
try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            env[key] = value;
        }
    });

    const supabaseUrl = env['VITE_SUPABASE_URL'];
    const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Credentials missing in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function checkLogin() {
        const { data, error } = await supabase
            .from('login_history')
            .select('*')
            .order('login_time', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching history:', error);
        } else {
            console.log('Latest Login Records:');
            console.table(data.map(d => ({
                id: d.id,
                email: d.email,
                time: new Date(d.login_time).toLocaleString(),
                user_id: d.user_id
            })));
        }
    }

    checkLogin();
} catch (err) {
    console.error('Failed to read .env.local:', err.message);
}
