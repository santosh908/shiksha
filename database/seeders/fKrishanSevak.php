<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamLavelCompleted;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\IOFactory;

class fKrishanSevak extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('ExcelData/resultSeeder/KrishanSevak.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);
        $CertNumber = 0001;
        foreach ($rows as $index => $row) {
            // Skip the header row (index 1 if the first row is a header)
            if ($index === 1) {
                continue;
            }
            $ashrayLeaderCode = User::join('user_have_ashray_leader', 'users.id', '=', 'user_have_ashray_leader.user_id')
            ->where('users.login_id','=', $row['A'])->value('user_have_ashray_leader.ashray_leader_code');

            $prefix = "ISKDwk/Session-5/KSwk";
            $certNumStr = str_pad($CertNumber, 4, '0', STR_PAD_LEFT);
            $certificateNumber = $prefix . $certNumStr;
            $CertNumber++;

            ExamLavelCompleted::create([
                'login_id' => $row['A'], // Replace with the actual column letter
                'shiksha_level' => $row['B'], // Replace with the actual column letter
                'exam_date' => $row['C'], // Ensure date format matches the database
                'total_questions' => $row['D'], // Replace with the actual column letter
                'total_marks' => $row['E'], // Replace with the actual column letter
                'total_obtain' => $row['F'], // Replace with the actual column letter
                'is_qualified' => filter_var($row['G'], FILTER_VALIDATE_BOOLEAN), // Convert to boolean
                'certificate_issued' => filter_var($row['H'], FILTER_VALIDATE_BOOLEAN), // Convert to boolean
                'ashray_leader_code' =>$ashrayLeaderCode,
                'certificate_number' => $row['G']==true ? $certificateNumber : null,
                'exam_id' => $row['I'], // Replace with the actual column letter
            ]);
        }
    }
}
