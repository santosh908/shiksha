<?php

namespace Database\Seeders;

use App\Models\RegulativePriciple;
use Illuminate\Database\Seeder;

class RegulativePricipleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $principle = RegulativePriciple::create([
            'principle_name_eglish'=>'No meat eating (including onion and garlic)',
            'principle_name_hindi'=>'मांस नहीं खाना (प्याज और लहसुन सहित)',
        ]);
        $principle = RegulativePriciple::create([
            'principle_name_eglish'=>'No intoxication',
            'principle_name_hindi'=>'कोई नशा नहीं',
        ]);
        $principle = RegulativePriciple::create([
            'principle_name_eglish'=>'No gambling',
            'principle_name_hindi'=>'कोई जुआ नहीं',
        ]);
        $principle = RegulativePriciple::create([
            'principle_name_eglish'=>'No illicit relationship',
            'principle_name_hindi'=>'कोई अवैध संबंध नहीं',
        ]);
    }
}
