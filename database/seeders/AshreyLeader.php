<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AshreyLeader extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create SuperAdmin
        $superAdmin = AshreyLeader::create([
            'ashery_leader_name'=>'Nitin Prabhu',
            'code'=>'1011',
            'login_id'=>'santosh@gmail.com',
            'is_active'=>'Y',
        ]);
    }
}
