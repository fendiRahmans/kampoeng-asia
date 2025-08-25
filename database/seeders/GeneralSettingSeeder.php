<?php

namespace Database\Seeders;

use App\Models\GeneralSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class GeneralSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GeneralSetting::factory()->create([
            'key' => 'site_logo',
            'value' => 'logo.png'
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_name',
            'value' => 'Kampoeng Asia'
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_title',
            'value' => 'RT 01 RW 23 Kemirisewu'
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_address',
            'value' => 'Kemirisewu, Yogyakarta'
        ]);

        GeneralSetting::factory()->create([
            'key' => 'site_description',
            'value' => 'Rukun Tetangga yang mengedepankan nilai-nilai kebersamaan, keamanan, dan kesejahteraan warga.'
        ]);
    }
}
