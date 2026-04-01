<?php

namespace Database\Seeders;
use App\Models\District;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/District.xlsx'); // Path to the uploaded file
        
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $row) {
            District::create([
                'state_code' => $row['A'], // Assuming 'state_code' is in column A
                'district_lg_code' => $row['B'], // Assuming 'district_lg_code' is in column B
                'district_name' => $row['C'], // Assuming 'district_name' is in column C
            ]);
        }
    }
}
