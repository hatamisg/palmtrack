/**
 * Script to seed Supabase database with mock data
 * Run this script after setting up your Supabase project
 *
 * Usage: npm run seed
 *
 * Prerequisites:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run the schema.sql file in Supabase SQL Editor
 * 3. Copy .env.local.example to .env.local and fill in your Supabase credentials
 * 4. Run this script: npm run seed
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { supabase } from '../lib/supabase/client';
import { gardens, tasks, harvests, issues, maintenances, documentation, expenses } from '../lib/data/mock-data';
import { generateSlug } from '../lib/utils';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  if (!supabase) {
    console.error('❌ Supabase client is not configured. Please check your environment variables.');
    process.exit(1);
  }

  try {
    // 1. Seed Gardens and create ID mapping
    console.log('📍 Seeding gardens...');
    const gardenIdMap = new Map<string, string>();

    for (const garden of gardens) {
      const { data, error } = await (supabase as any)
        .from('gardens')
        .insert({
          nama: garden.nama,
          slug: generateSlug(garden.nama),
          lokasi: garden.lokasi,
          lokasi_lengkap: garden.lokasiLengkap,
          luas: garden.luas,
          jumlah_pohon: garden.jumlahPohon,
          tahun_tanam: garden.tahunTanam,
          varietas: garden.varietas,
          status: garden.status,
          created_at: garden.createdAt.toISOString(),
          updated_at: garden.updatedAt.toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Error seeding garden ${garden.nama}:`, error.message);
      } else if (data) {
        gardenIdMap.set(garden.id, data.id);
        console.log(`  ✅ Seeded garden: ${garden.nama}`);
      }
    }

    console.log(`✅ Seeded ${gardens.length} gardens\n`);

    // 2. Seed Tasks
    console.log('📋 Seeding tasks...');
    for (const task of tasks) {
      const gardenUuid = gardenIdMap.get(task.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('tasks')
        .insert({
          garden_id: gardenUuid,
          judul: task.judul,
          deskripsi: task.deskripsi || null,
          kategori: task.kategori,
          prioritas: task.prioritas,
          status: task.status,
          tanggal_target: task.tanggalTarget.toISOString().split('T')[0],
          assigned_to: task.assignedTo || null,
          created_at: task.createdAt.toISOString(),
          updated_at: task.updatedAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding task ${task.judul}:`, error.message);
      }
    }
    console.log(`✅ Seeded ${tasks.length} tasks\n`);

    // 3. Seed Harvests
    console.log('🌾 Seeding harvests...');
    for (const harvest of harvests) {
      const gardenUuid = gardenIdMap.get(harvest.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('harvests')
        .insert({
          garden_id: gardenUuid,
          tanggal: harvest.tanggal.toISOString().split('T')[0],
          jumlah_kg: harvest.jumlahKg,
          harga_per_kg: harvest.hargaPerKg,
          total_nilai: harvest.totalNilai,
          kualitas: harvest.kualitas,
          catatan: harvest.catatan || null,
          created_at: harvest.createdAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding harvest:`, error.message);
      }
    }
    console.log(`✅ Seeded ${harvests.length} harvests\n`);

    // 4. Seed Issues
    console.log('⚠️  Seeding issues...');
    for (const issue of issues) {
      const gardenUuid = gardenIdMap.get(issue.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('issues')
        .insert({
          garden_id: gardenUuid,
          judul: issue.judul,
          deskripsi: issue.deskripsi,
          area_terdampak: issue.areaTerdampak,
          tingkat_keparahan: issue.tingkatKeparahan,
          status: issue.status,
          foto_urls: issue.fotoUrls || null,
          solusi: issue.solusi || null,
          tanggal_lapor: issue.tanggalLapor.toISOString().split('T')[0],
          tanggal_selesai: issue.tanggalSelesai ? issue.tanggalSelesai.toISOString().split('T')[0] : null,
          created_at: issue.createdAt.toISOString(),
          updated_at: issue.updatedAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding issue ${issue.judul}:`, error.message);
      }
    }
    console.log(`✅ Seeded ${issues.length} issues\n`);

    // 5. Seed Maintenances
    console.log('🔧 Seeding maintenances...');
    for (const maintenance of maintenances) {
      const gardenUuid = gardenIdMap.get(maintenance.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('maintenances')
        .insert({
          garden_id: gardenUuid,
          jenis_perawatan: maintenance.jenisPerawatan,
          judul: maintenance.judul,
          tanggal_dijadwalkan: maintenance.tanggalDijadwalkan.toISOString().split('T')[0],
          status: maintenance.status,
          detail: maintenance.detail || null,
          penanggung_jawab: maintenance.penanggungJawab || null,
          is_recurring: maintenance.isRecurring,
          recurring_interval: maintenance.recurringInterval || null,
          tanggal_selesai: maintenance.tanggalSelesai ? maintenance.tanggalSelesai.toISOString().split('T')[0] : null,
          created_at: maintenance.createdAt.toISOString(),
          updated_at: maintenance.updatedAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding maintenance ${maintenance.judul}:`, error.message);
      }
    }
    console.log(`✅ Seeded ${maintenances.length} maintenances\n`);

    // 6. Seed Documentation
    console.log('📄 Seeding documentation...');
    for (const doc of documentation) {
      const gardenUuid = gardenIdMap.get(doc.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('documentation')
        .insert({
          garden_id: gardenUuid,
          tipe: doc.tipe,
          judul: doc.judul,
          deskripsi: doc.deskripsi || null,
          file_url: doc.fileUrl || null,
          content: doc.content || null,
          kategori: doc.kategori || null,
          created_at: doc.createdAt.toISOString(),
          updated_at: doc.updatedAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding documentation ${doc.judul}:`, error.message);
      }
    }
    console.log(`✅ Seeded ${documentation.length} documentation items\n`);

    // 7. Seed Expenses
    console.log('💰 Seeding expenses...');
    for (const expense of expenses) {
      const gardenUuid = gardenIdMap.get(expense.gardenId);
      if (!gardenUuid) continue;

      const { error } = await (supabase as any)
        .from('expenses')
        .insert({
          garden_id: gardenUuid,
          tanggal: expense.tanggal.toISOString().split('T')[0],
          kategori: expense.kategori,
          deskripsi: expense.deskripsi,
          jumlah: expense.jumlah,
          catatan: expense.catatan || null,
          created_at: expense.createdAt.toISOString(),
          updated_at: expense.updatedAt.toISOString(),
        });

      if (error) {
        console.error(`  ❌ Error seeding expense:`, error.message);
      }
    }
    console.log(`✅ Seeded ${expenses.length} expenses\n`);

    console.log('✅ Database seeding completed successfully! 🎉\n');
    console.log('Summary:');
    console.log(`  - Gardens: ${gardens.length}`);
    console.log(`  - Tasks: ${tasks.length}`);
    console.log(`  - Harvests: ${harvests.length}`);
    console.log(`  - Issues: ${issues.length}`);
    console.log(`  - Maintenances: ${maintenances.length}`);
    console.log(`  - Documentation: ${documentation.length}`);
    console.log(`  - Expenses: ${expenses.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
