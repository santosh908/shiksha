<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AsheryLeader;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\IOFactory;

class AsheryLeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/AshrayLeader.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true, true, true, null, true, true, true, true, true);

        foreach ($rows as $row) {
            $crUser = User::create([
                'email' => empty($row['A']) ? 'test@gmail.com' : $row['A'],
                'name' => $row['B'],
                'Initiated_name' => empty($row['C']) ? ' ' : $row['C'],
                'dob' => empty($row['D']) ? ' ' : $row['D'],
                'contact_number' => empty($row['E']) ? ' ' : $row['E'],
                'have_you_applied_before' => $row['F'],
                'email_verified_at' => $row['G'],
                'account_approved' => $row['H'],
                'profile_submitted' => $row['I'],
                'devotee_type' => 'AL',
                'login_id' => $row['J'],
                'password' => bcrypt($row['J']),
            ]);

            $crUser->assignRole('AsheryLeader');

            $AshrayLeaderMaster = AsheryLeader::create([
                'ashery_leader_name' => $row['K'],
                'code' => $row['L'],
                'user_id' => $crUser->id,
                'is_active' => 'Y',
            ]);
        }
    }
}
