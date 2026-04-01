<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\QuestionBank\QuestionBank;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Subject\Subject;
use App\Models\ShikshaLevel;
use App\Models\Chapter\chapter;
class QuestionBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('BulkQuestionBank/QuestionBank.xlsx');

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {

            if ($index === 1) {
                continue;
            }
            $subject = Subject::where('id', $row['C'])->first();
            $chapter = chapter::where('id', $row['D'])->first();
            $level = ShikshaLevel::where('id', $row['E'])->first();

            QuestionBank::create([
                'question_english' => $row['A'],
                'question_hindi' => $row['B'],
                'subject' => $row['C'],
                'chapter' => $row['D'],
                'level' => $row['E'],
                'difficulty_label' => $row['F'],
                'option1' => $row['G'],
                'option2' => $row['H'],
                'option3' => $row['I'],
                'option4' => $row['J'],
                'correctanswer' => $row['K'],
                'any_remark' => $row['L'],
                'is_active' => $row['M'],
            ]);
        }
    }
}