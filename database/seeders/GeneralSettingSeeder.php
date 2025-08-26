<?php

namespace Database\Seeders;

use App\Models\GeneralSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class GeneralSettingSeeder extends Seeder
{
    public static ?int $userId = null;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = self::$userId;

        GeneralSetting::factory()->create([
            'key' => 'site_logo',
            'value' => 'logo.png',
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_name',
            'value' => 'Kampoeng Asia',
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_title',
            'value' => 'RT 01 RW 23 Kemirisewu',
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_address',
            'value' => 'Kemirisewu, Yogyakarta',
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_description',
            'value' => 'Rukun Tetangga yang mengedepankan nilai-nilai kebersamaan, keamanan, dan kesejahteraan warga.',
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }
}
