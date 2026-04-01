<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExamLavelCompleted;
use PhpOffice\PhpSpreadsheet\IOFactory;

class GpaSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('ExcelData/GPA_Data.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {
            // Skip the header row (index 1 if the first row is a header)
            if ($index === 1) {
                continue;
            }

            ExamLavelCompleted::create([
                'login_id' => $row['B'], 
                'shiksha_level' => $row['C'],
                'exam_date' => $row['D'],
                'total_questions' => $row['E'],
                'total_marks' => $row['F'],
                'total_obtain' => $row['G'],
                'is_qualified' => $row['H'],
                'certificate_issued' => $row['I'],
                'certificate_path' => $row['J'],
                'is_promoted_by_ashray_leader' => $row['K'],
                'ashray_leader_code' => $row['L'],
                'certificate_number' => $row['M'],
                'exam_id' => $row['N'],
            ]);
        }
    }
}
