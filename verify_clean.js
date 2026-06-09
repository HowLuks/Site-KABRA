const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('blogs').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  data.forEach((b) => {
    if (b.title !== 'Test') {
      console.log(`=== Title: ${b.title} ===`);
      let content = b.content || '';
      
      // Replace non-breaking spaces
      content = content.replace(/&nbsp;/g, ' ').replace(/\xa0/g, ' ');
      
      // Remove leading # paragraph
      content = content.replace(/^<p>\s*#\s+.*?<\/p>\s*/i, '');
      
      console.log(content.substring(0, 500));
      console.log('====================================\n');
    }
  });
}
run();
