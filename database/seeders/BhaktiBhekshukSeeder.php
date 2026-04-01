<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BhaktiBhekshuk;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\IOFactory;

class BhaktiBhekshukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = public_path('ExcelData/BhaktiBhekshuk.xlsx'); // Path to the uploaded file

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        foreach ($rows as $row) {
            $crUser = User::create([
                'email' => empty($row['A']) ? 'test@gmail.com' : $row['A'],
                'name' => $row['B'],
                'Initiated_name' => empty($row['C']) ? ' ' : $row['C'],
                'dob' => empty($row['D']) ? ' ' : $row['D'],
                'contact_number' => empty($row['E']) ? ' ' : $row['E'],
                'have_you_applied_before' => $row['F'],
                'email_verified_at' =>$row['G'] ,
                'account_approved' => $row['H'],
                'profile_submitted' => $row['I'],
                'devotee_type' =>'BB',
                'login_id' => $row['J'],
                'password' => bcrypt($row['J']),
            ]);
            
            $crUser->assignRole('BhaktiBhekshuk');

            $BhaktiBhekshuk = BhaktiBhekshuk::create([
                'bhakti_bhikshuk_name' => $row['B'],
                'ashray_leader_code' => $row['K'],
                'user_id' => $crUser->id,
                'is_active' => 'Y',
            ]);
        }
    }
}
