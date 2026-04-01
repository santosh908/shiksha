<?php

namespace Database\Seeders;

use App\Models\Prayer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Vaishnava Pranam Mantra',
            'prayer_name_hindi' => 'वैष्णव प्रणाम मंत्र',
        ]);

        $Seminar = Prayer::create([
            'prayer_name_english' => 'Prabhupada Pranam Mantra',
            'prayer_name_hindi' => 'प्रभुपाद प्रणाम मंत्र',
        ]);

        $Seminar = Prayer::create([
            'prayer_name_english' => 'Krishna Pranam Mantra',
            'prayer_name_hindi' => 'कृष्णा प्रनाम मंत्र',
        ]);

        $Seminar = Prayer::create([
            'prayer_name_english' => 'Radharani Pranam Mantra',
            'prayer_name_hindi' => 'राधारानी प्रणाम मंत्र',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Gaur Nitai Pranam Mantra',
            'prayer_name_hindi' => 'गौर निताई प्रणाम मंत्र',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Jagannath Baladeva Subhadra Pranam Mantra',
            'prayer_name_hindi' => 'जगन्नाथ बलदेव सुभद्रा प्रणाम मंत्र',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Prasadam Honoring Mantra',
            'prayer_name_hindi' => 'प्रसादम सम्मान मंत्र',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Prayers for offering bhoga',
            'prayer_name_hindi' => 'भोग लगाने के लिए प्रार्थना',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Ten offences to be avoided',
            'prayer_name_hindi' => 'दस अपराधों से बचना चाहिए',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Sikshastakam',
            'prayer_name_hindi' => 'सिक्शास्टैकम',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'Guru Maharaj Pranam Mantra',
            'prayer_name_hindi' => 'गुरु महाराज प्रनाम मंत्र',
        ]);
        $Seminar = Prayer::create([
            'prayer_name_english' => 'None',
            'prayer_name_hindi' => '',
        ]);
    }
}
