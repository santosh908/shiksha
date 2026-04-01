<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('professional_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignId('education')->constrained('education')->onDelete('cascade');
            $table->foreignId('marital_status')->constrained('merital_status')->onDelete('cascade');
            $table->foreignId('profession')->constrained('profession')->onDelete('cascade');
            $table->string('spiritual_master')->nullable();
            $table->string('join_askcon')->nullable();
            $table->string('current_address')->nullable();
            $table->string('Socity_Name')->nullable();
            $table->string('Sector_Area')->nullable();
            $table->string('permanent_address')->nullable();
            $table->string('pincode');
            $table->foreignId('state_code')->constrained('state')->onDelete('cascade');
            $table->foreignId('district_code')->constrained('district')->onDelete('cascade');
            $table->string('how_many_rounds_you_chant')->nullable();
            $table->string('when_are_you_chantin')->nullable();
            $table->string('spend_everyday_hearing_lectures')->nullable();
            $table->string('bakti_shastri_degree')->nullable();
            $table->integer('ashray_leader')->nullable(); // Corrected from 'int' to 'integer'
            $table->string('other_ashry_leader_name')->nullable();
            $table->string('since_when_you_attending_ashray_classes')->nullable();
            $table->string('spiritual_master_you_aspiring')->nullable();
            $table->string('attend_shray_classes_in_temple')->nullable();
            $table->string('personal_info')->nullable()->default('Y');
            $table->string('professional_info')->nullable()->default('N');
            $table->string('hearing_reading')->nullable()->default('N');
            $table->string('seminar')->nullable()->default('N');
            $table->string('status_code')->nullable()->default('N');
            $table->integer('approved_by')->nullValue()->default(0);
            $table->integer('rejected_by')->nullValue()->default(0);
            $table->integer('updated_by')->nullValue()->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_information');
    }
};
