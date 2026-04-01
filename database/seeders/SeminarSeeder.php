<?php

namespace Database\Seeders;

use App\Models\Seminar;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeminarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Seminar = Seminar::create([
            'seminar_name_english'=>'Vaishnava Etiquette',
            'seminar_name_hindi'=>'वैष्णव शिष्टाचार',
        ]);

        $Seminar = Seminar::create([
            'seminar_name_english'=>'IDC (Iskcon Disciple Course)',
            'seminar_name_hindi'=>'आईडीसी (इस्कॉन शिष्य पाठ्यक्रम)',
        ]);

        $Seminar = Seminar::create([
            'seminar_name_english'=>'None of the above',
            'seminar_name_hindi'=>'इनमे से कोई भी नहीं',
        ]);
    }
}
