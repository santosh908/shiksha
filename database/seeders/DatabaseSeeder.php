<?php

namespace Database\Seeders;

use App\Models\BhaktiBhekshuk;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            'Create Exam',
            'Create Exam Question',
            'Verify Exam',
            'Submit Monthly Report',
            'View Devotee List',
            'Edit Devotee Details',
            'Send Notification',
            'Start Exam',
            'Start Devotee Registration',
            'All Permission',
            'View Only',
            'Change Any Password',
            'Create Announcement',
            'Add&Edit AsheryLeader',
            'Add&Edit Bhakti Bhikshuk',
            'Update Master Data'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        $devotee = Role::create(['name' => 'Devotee']);
        $devotee->givePermissionTo(['Submit Monthly Report', 'Change Any Password', 'View Only']);

        $coOrdinator = Role::create(['name' => 'CoOrdinator']);
        $coOrdinator->givePermissionTo(['View Devotee List', 'Submit Monthly Report', 'Change Any Password', 'View Only']);

        $asheryLeader = Role::create(['name' => 'AsheryLeader']);
        $asheryLeader->givePermissionTo(['View Devotee List', 'Submit Monthly Report', 'Change Any Password', 'View Only', 'Send Notification']);

        $BhaktiBhekshuk = Role::create(['name' => 'BhaktiBhekshuk']);
        $BhaktiBhekshuk->givePermissionTo(['View Devotee List', 'Submit Monthly Report', 'Change Any Password', 'View Only', 'Send Notification']);

        $admin = Role::create(['name' => 'SuperAdmin']);
        $admin->givePermissionTo(Permission::all());


        $this->call([
            UsersSeeder::class,
                //UserWithAshrayLeader::class,
            EducationSeeder::class,
            MeritalStatusSeeder::class,
            ProdessionSeeder::class,
            StateSeeder::class,
            DistrictSeeder::class,
            BookSeeder::class,
            PrincipleSeeder::class,
            SeminarSeeder::class,
            PrayerSeeder::class,
            AsheryLeaderSeeder::class,
            QuestionBankSeeder::class,
            AnnouncementSeeder::class,
            ExamLavel1::class,
            BhaktiBhekshukSeeder::class,
            ShikshaLevelSeeder::class,
            InteractiveExamSeeder::class,
            QuestionBankSeeder::class,
            //ExaminationSeeder::class,
        ]);
    }
}
