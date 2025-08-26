<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default application user and pass its id to the GeneralSettingSeeder via static property
        $defaultUser = User::firstWhere('email', 'kampoengasia@getnada.com');
        if (! $defaultUser) {
            $defaultUser = User::create([
                'name' => 'Kampoeng Asia',
                'email' => 'kampoengasia@getnada.com',
                'password' => Hash::make('kampoeng123asia'),
                'role' => 'superadmin',
            ]);
        } elseif ($defaultUser->role !== 'superadmin') {
            // ensure existing account is upgraded to superadmin
            $defaultUser->role = 'superadmin';
            $defaultUser->save();
        }

        \Database\Seeders\GeneralSettingSeeder::$userId = $defaultUser->id;
        $this->call(GeneralSettingSeeder::class);

        // Keep an extra test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
