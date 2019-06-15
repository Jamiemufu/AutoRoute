<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\User::create([

            'name' => env('ADMIN_NAME', ''),
            'email' => env('ADMIN_EMAIL', ''),
            'email_verified_at' => now(),
            'password' => bcrypt(env('ADMIN_PASSWORD', '')),
            'role' => 'admin',
            'created_at' => now(),

        ]);
    }
}
