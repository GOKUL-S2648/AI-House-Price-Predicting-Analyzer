import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Credentials missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLogin() {
    const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching history:', error);
    } else {
        console.log('Latest 5 Login Records:');
        console.table(data);
    }
}

checkLogin();
