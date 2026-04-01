<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Education = Education::create([
            'eduction_name'=>'Post Graduation',
        ]);

        $Education = Education::create([
            'eduction_name'=>'Under Graduation',
        ]);
        
        $Education = Education::create([
            'eduction_name'=>'Uneducated',
        ]);
    }
}
