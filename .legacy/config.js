// config.js
// SUBSTITUA AS CHAVES PELOS VALORES CORRETOS.

const SUPABASE_URL = 'https://echorfxishvrfeboagxj.supabase.co';

// NOTA: Você colou a URL de cima aqui embaixo também sem querer. 
// Copie a sua chave "anon / public" e coloque no lugar deste texto!
const SUPABASE_ANON_KEY = 'sb_publishable_XzINZeLhLY-fId5YRiB1hg_cD026eWE';

if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'cole_sua_chave_anonima_neste_espaco') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("⚠️ Supabase não configurado! Cole sua ANON_KEY correta no arquivo config.js");
}
