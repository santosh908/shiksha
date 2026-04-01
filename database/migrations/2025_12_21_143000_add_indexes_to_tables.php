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
        Schema::table('users', function (Blueprint $table) {
            $table->index('devotee_type');
        });

        Schema::table('shiksah_lavel_completed', function (Blueprint $table) {
            $table->index('login_id');
            $table->index('shiksha_level');
            $table->index('is_qualified');
        });

        Schema::table('raise_queries', function (Blueprint $table) {
            $table->index('query_id');
            $table->index('from_id');
            $table->index('to_id');
        });

        Schema::table('user_have_ashray_leader', function (Blueprint $table) {
            $table->index('ashray_leader_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['devotee_type']);
        });

        Schema::table('shiksah_lavel_completed', function (Blueprint $table) {
            $table->dropIndex(['login_id']);
            $table->dropIndex(['shiksha_level']);
            $table->dropIndex(['is_qualified']);
        });

        Schema::table('raise_queries', function (Blueprint $table) {
            $table->dropIndex(['query_id']);
            $table->dropIndex(['from_id']);
            $table->dropIndex(['to_id']);
        });

        Schema::table('user_have_ashray_leader', function (Blueprint $table) {
            $table->dropIndex(['ashray_leader_code']);
        });
    }
};
