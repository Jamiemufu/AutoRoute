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
        $faker = \Faker\Factory::create('en_GB');

        \App\User::create([
            'name' => env('ADMIN_NAME', ''),
            'email' => env('ADMIN_EMAIL', ''),
            'email_verified_at' => now(),
            'password' => bcrypt(env('ADMIN_PASSWORD', '')),
            'role' => 'admin',
            'created_at' => now(),
        ]);

        // Added seed of random UK address data for ease
        for ($i = 0; $i < 10; $i++) 
        {
            \App\Restaurant::create([
                'name' => $faker->name,
                'street' => $faker->streetName,
                'city' => $faker->city,
                'postcode' => $faker->postcode
            ]);
        }
    }
}
