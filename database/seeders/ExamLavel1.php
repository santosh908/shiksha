<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExamLavelCompleted;
use App\Models\UserAssignAshrayLeader;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Auth;

class ExamLavel1 extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/Lavel1.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(true, true, false, true, true, true);
        $user = Auth::user();

        foreach ($rows as $row) {
            $devotee = ExamLavelCompleted::create([
                'user_id' => $row['A'],
                'shiksha_level' => $row['B'],
                'exam_date' => $row['C'],
                'total_questions' =>  $row['D'],
                'total_marks' => $row['E'],
                'exam_achieved_marks' => $row['F'],
                'interview_total_marks' => $row['G'],
                'external_marks' => $row['H'],
                'total_obtain' =>  $row['I'],
                'is_qualified' => $row['J'], 
                'certificate_issued' =>  $row['K'],
                'certificate_path' =>  $row['L'],
                'is_promoted_by_ashray_leader' =>  $row['M'],
                'promoted_level' =>  $row['N'],
            ]);
        }
    }
}
