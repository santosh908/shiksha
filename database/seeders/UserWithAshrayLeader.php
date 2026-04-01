<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserAssignAshrayLeader;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Auth;

class UserWithAshrayLeader extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/Users.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true, true, true);
        $user = Auth::user();

        foreach ($rows as $row) {
            $userCount = User::count();
            $generatedNumber = str_pad($userCount + 1, 4, '0', STR_PAD_LEFT);
            $devotee = User::create([
                'email' => empty($row['A']) ? 'test@gmail.com' : $row['A'],
                'name' => $row['B'],
                'Initiated_name' => empty($row['C']) ? ' ' : $row['C'],
                'dob' => empty($row['D']) ? ' ' : $row['D'],
                'contact_number' => empty($row['E']) ? ' ' : $row['E'],
                'have_you_applied_before' => 'N',
                'email_verified_at' => 'N',
                'account_approved' => 'N',
                'profile_submitted' => 'N',
                'login_id' => $row['G'], //'SHK' . $row['F'] . $generatedNumber,
                'password' => bcrypt('Shiksha@264'),
            ]);

            $devotee->assignRole('Devotee');  

            $userAsingLeader = UserAssignAshrayLeader::create([
                'user_id' => $devotee->id,
                'ashray_leader_code' => $row['F']
            ]);
        }
    }
}
