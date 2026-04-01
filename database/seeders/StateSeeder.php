<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/State.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $row) {
            State::create([
                'lg_code' => $row['A'], // Assuming 'lg_code' is in column A
                'state_code' => $row['B'], // Assuming 'state_code' is in column B
                'state_name' => $row['C'], // Assuming 'state_name' is in column C
            ]);
        }
    }
}
