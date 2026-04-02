/**
 * RD COURS COMPTA — Supabase Client
 */
const { createClient } = supabase;
const supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
export default supabaseClient;
