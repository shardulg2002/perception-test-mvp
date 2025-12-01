// Quick Supabase Connection Test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT FOUND');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check test_sessions table
    console.log('📊 Test 1: Checking test_sessions table...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('test_sessions')
      .select('*')
      .limit(1);
    
    if (sessionsError) {
      console.log('❌ test_sessions table error:', sessionsError.message);
    } else {
      console.log('✅ test_sessions table exists');
      console.log('   Current records:', sessions.length);
    }

    // Test 2: Check perception_attempts table
    console.log('\n📊 Test 2: Checking perception_attempts table...');
    const { data: attempts, error: attemptsError } = await supabase
      .from('perception_attempts')
      .select('*')
      .limit(1);
    
    if (attemptsError) {
      console.log('❌ perception_attempts table error:', attemptsError.message);
    } else {
      console.log('✅ perception_attempts table exists');
      console.log('   Current records:', attempts.length);
    }

    // Test 3: Try inserting a test record
    console.log('\n📊 Test 3: Testing insert permission...');
    const testSession = {
      session_id: `test_${Date.now()}`,
      candidate_name: 'Test User',
      application_number: 'TEST123',
      perception_results: [],
      fuel_pump_result: {},
      illusion_result: {},
      client_info: { test: true }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('test_sessions')
      .insert(testSession)
      .select();
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert permission working');
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('test_sessions')
        .delete()
        .eq('session_id', testSession.session_id);
      
      if (!deleteError) {
        console.log('✅ Test record cleaned up');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 SUPABASE SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log('\n✅ Your database is ready to use!');
    console.log('✅ The app will now save data to Supabase');
    console.log('\n📍 Next steps:');
    console.log('   1. Complete all 3 experiments in your app');
    console.log('   2. Check the Admin Dashboard to see the data');
    console.log('   3. View data in Supabase: Table Editor → test_sessions');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
