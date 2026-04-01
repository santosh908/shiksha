<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use PhpOffice\PhpSpreadsheet\IOFactory;

class permissions extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('ExcelData/Permissions.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {
            // Skip the header row (index 1 if the first row is a header)
            if ($index === 1) {
                continue;
            }

            Permission::create([
                'name' => $row['A'], 
                'guard_name' => $row['B'],
                'created_at' => $row['C'],
                'updated_at' => $row['D'],
            ]);
        }
    }
}
