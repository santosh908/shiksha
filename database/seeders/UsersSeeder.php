<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Correctly import the User model


class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create SuperAdmin
        $superAdmin = User::create([
            'email' => 'super@gmail.com',
            'name' => 'Super Admin',
            'Initiated_name' => 'Super Admin',
            'dob' => '18/08/1990',
            'contact_number' => '750280264',
            'have_you_applied_before' => 'N',
            'email_verified_at' => 'N',
            'account_approved' => 'Y',
            'profile_submitted' => 'Y',
            'devotee_type' => 'SA',
            'login_id' => 'super@gmail.com',
            'password' => bcrypt('super@123')
        ]);

        $superAdmin->assignRole('SuperAdmin');

        // Create AshrayLeader
        $Leader = User::create([
            'email' => 'leader@gmail.com',
            'name' => 'Ashray Leader',
            'Initiated_name' => 'Ashray Leader',
            'dob' => '18/08/1990',
            'contact_number' => '750280264',
            'have_you_applied_before' => 'Y',
            'email_verified_at' => 'Y',
            'account_approved' => 'Y',
            'profile_submitted' => 'Y',
            'devotee_type' => 'AL',
            'login_id' => 'leader@gmail.com',
            'password' => bcrypt('leader@123')
        ]);
        $Leader->assignRole('AsheryLeader');

        // Create CoOrdinator
        $coOrdinator = User::create([
            'email' => 'coordinator@gmail.com',
            'name' => 'Co-Ordinator',
            'Initiated_name' => 'Co-Ordinator',
            'dob' => '18/08/1990',
            'contact_number' => '750280264',
            'have_you_applied_before' => 'N',
            'email_verified_at' => 'N',
            'account_approved' => 'Y',
            'profile_submitted' => 'Y',
            'devotee_type' => 'CA',
            'login_id' => 'coordinator@gmail.com',
            'password' => bcrypt('coordinator@123')
        ]);
        $coOrdinator->assignRole('CoOrdinator');

        // Create Devotee
        $devotee = User::create([
            'email' => 'santosh@gmail.com',
            'name' => 'Santosh Singh',
            'Initiated_name' => 'Santosh Singh',
            'dob' => '18/08/1990',
            'contact_number' => '750280264',
            'have_you_applied_before' => 'N',
            'email_verified_at' => 'N',
            'account_approved' => 'N',
            'profile_submitted' => 'N',
            'devotee_type' => 'AD',
            'login_id' => 'santosh@gmail.com',
            'password' => bcrypt('santosh@123')
        ]);
        $devotee->assignRole('Devotee');
    }
}
