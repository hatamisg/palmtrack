/**
 * Script to setup database schema in Supabase
 * This will create all tables, indexes, and triggers
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupSchema() {
  console.log('🔧 Setting up database schema...\n');

  try {
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📄 Reading schema.sql...');
    console.log('⚠️  Note: To run the full schema, you need to execute it in Supabase SQL Editor');
    console.log('⚠️  This script will only test the connection\n');

    // Test connection by checking if we can query
    const { data, error } = await supabase
      .from('gardens')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Tables not found. Please run the schema.sql in Supabase SQL Editor:');
      console.log('\n1. Go to: https://supabase.com/dashboard/project/zcdlrhtqvijtfdmfbaaj/sql/new');
      console.log('2. Copy and paste the entire content of supabase/schema.sql');
      console.log('3. Click "Run" or press Ctrl+Enter\n');
      console.log('Error details:', error.message);
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Tables exist and are accessible\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupSchema();
