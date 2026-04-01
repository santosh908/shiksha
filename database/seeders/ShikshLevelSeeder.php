<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ShikshaLevel;

class ShikshLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ShikshaLevel = ShikshaLevel::create([
            'exam_name' => 'Shraddhavan Status',
            'is_active' => 'Y',
        ]);

        $ShikshaLevel = ShikshaLevel::create([
            'exam_name' => 'Krishna Sevak Status',
            'is_active' => 'Y',
        ]);

        $ShikshaLevel = ShikshaLevel::create([
            'exam_name' => 'Krishna Sadhak Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_name' => 'Shrilan Prabhupada Ashray Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_name' => 'Gurupada Ashray',
            'is_active' => 'Y',
        ]);
    }
}
