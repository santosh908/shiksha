<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExamLavelCompleted;
use PhpOffice\PhpSpreadsheet\IOFactory;

class InteractiveExamSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('ExcelData/IntrativeExam.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {
            // Skip the header row (index 1 if the first row is a header)
            if ($index === 1) {
                continue;
            }

            ExamLavelCompleted::create([
                'login_id' => $row['B'], // Replace with the actual column letter
                'shiksha_level' => $row['C'], // Replace with the actual column letter
                'exam_date' => $row['D'], // Ensure date format matches the database
                'total_questions' => $row['E'], // Replace with the actual column letter
                'total_marks' => $row['F'], // Replace with the actual column letter
                'total_obtain' => $row['G'], // Replace with the actual column letter
                'is_qualified' => filter_var($row['H'], FILTER_VALIDATE_BOOLEAN), // Convert to boolean
                'certificate_issued' => filter_var($row['I'], FILTER_VALIDATE_BOOLEAN), // Convert to boolean
                'certificate_path' => $row['J'], // Replace with the actual column letter
                'is_promoted_by_ashray_leader' => filter_var($row['K'], FILTER_VALIDATE_BOOLEAN), // Convert to boolean
                'ashray_leader_code' => $row['L'], // Replace with the actual column letter
            ]);
        }
    }
}
