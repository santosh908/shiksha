<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('professional_information', function (Blueprint $table) {
            $table->index('status_code');
        });

        Schema::table('bhakti_bhekshuk', function (Blueprint $table) {
            $table->index('ashray_leader_code');
            $table->index('is_active');
        });

        Schema::table('ashery_leader', function (Blueprint $table) {
            $table->index('code');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('professional_information', function (Blueprint $table) {
            $table->dropIndex(['status_code']);
        });

        Schema::table('bhakti_bhekshuk', function (Blueprint $table) {
            $table->dropIndex(['ashray_leader_code']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('ashery_leader', function (Blueprint $table) {
            $table->dropIndex(['code']);
            $table->dropIndex(['is_active']);
        });
    }
};
