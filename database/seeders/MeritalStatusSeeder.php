<?php

namespace Database\Seeders;
use App\Models\MeritalStatus;
use Illuminate\Database\Seeder;

class MeritalStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $MeritalStatus = MeritalStatus::create([
            'merital_status_name'=>'Married',
        ]);

        $MeritalStatus = MeritalStatus::create([
            'merital_status_name'=>'Un-Married',
        ]);
        
        $MeritalStatus = MeritalStatus::create([
            'merital_status_name'=>'Divorce',
        ]);

        $MeritalStatus = MeritalStatus::create([
            'merital_status_name'=>'Trangender',
        ]);
    }
}
