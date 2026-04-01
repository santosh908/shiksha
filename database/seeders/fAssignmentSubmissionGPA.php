<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamLavelCompleted;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\IOFactory;

class fAssignmentSubmissionGPA extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('ExcelData/resultSeeder/fAssignmentSubmissionGPA.xlsx'); // Path to the uploaded file
        $writtenExamFilePath = public_path('ExcelData/resultSeeder/fShriGurpadaAshray.xlsx'); // Path to the uploaded file
        
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {
            // Skip the header row (index 1 if the first row is a header)
            if ($index === 1) {
                continue;
            }
            $ashrayLeaderCode = User::join('user_have_ashray_leader', 'users.id', '=', 'user_have_ashray_leader.user_id')
            ->where('users.login_id','=', $row['A'])->value('user_have_ashray_leader.ashray_leader_code');

            // Load written exam marks from the second file
            $writtenSpreadsheet = IOFactory::load($writtenExamFilePath);
            $writtenSheet = $writtenSpreadsheet->getActiveSheet();
            $writtenRows = $writtenSheet->toArray(null, true, true, true);
            $writtenMarks = 0;
            foreach ($writtenRows as $wIndex => $wRow) {
                // Assuming login_id is in column A in both files
                if ($wIndex === 1) continue;
                if ($wRow['A'] === $row['A']) {
                    $writtenMarks = (float)$wRow['F']; // Adjust column as needed
                    break;
                }
            }

            $totalObtain = (float)$row['F'] + $writtenMarks;
            $isQualified = $totalObtain > 98 ? true : false;

            ExamLavelCompleted::create([
                'login_id' => $row['A'], // Replace with the actual column letter
                'shiksha_level' => $row['B'], // Replace with the actual column letter
                'exam_date' => $row['C'], // Ensure date format matches the database
                'total_questions' => $row['D'], // Replace with the actual column letter
                'total_marks' => $row['E'], // Replace with the actual column letter
                'total_obtain' =>$row['F'], // Sum of both marks
                'is_qualified' => $isQualified, // true if sum > 99
                'certificate_issued' => 0, // Convert to boolean
                'ashray_leader_code' =>$ashrayLeaderCode,
                'exam_id' => $row['I'], // Replace with the actual column letter
            ]);
        }
    }
}
