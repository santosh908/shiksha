<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ShikshaLevel;

class ShikshaLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ShikshaLevel = ShikshaLevel::create([
            'exam_level' => 'Shraddhavan Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_level' => 'Krishna Sevak Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_level' => 'Krishna Sadhak Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_level' => 'Shrilan Prabhupada Ashray Status',
            'is_active' => 'Y',
        ]);
        $ShikshaLevel = ShikshaLevel::create([
            'exam_level' => 'Gurupada Ashray',
            'is_active' => 'Y',
        ]);
    }
}
