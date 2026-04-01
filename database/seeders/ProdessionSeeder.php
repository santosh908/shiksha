<?php

namespace Database\Seeders;

use App\Models\Profession;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Education = Profession::create([
            'profession_name'=>'Doctor',
        ]);

        $Education = Profession::create([
            'profession_name'=>'Engineer',
        ]);
        
        $Education = Profession::create([
            'profession_name'=>'Carpenter',
        ]);
    }
}
