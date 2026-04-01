<?php

namespace Database\Seeders;

use App\Models\Announcements;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Announcements = Announcements::create([
                'title' => 'Announcement 1',
                'description' => 'This is the description for announcement 1.',
                'valid_upto' => now()->addDays(30)->toDateString(), 
                'is_active' => 'Y',
        ]);
        $Announcements = Announcements::create([
                'title' => 'Announcement 2',
                'description' => 'This is the description for announcement 2.',
                'valid_upto' => now()->addDays(15)->toDateString(), 
                'is_active' => 'Y',
        ]);
    }
}
