<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * One answer row per user/exam/session/question. Clean duplicate rows before migrating if this fails.
     */
    public function up(): void
    {
        Schema::table('submited_exam', function (Blueprint $table) {
            $table->unique(
                ['user_id', 'exam_id', 'session_id', 'question_id'],
                'submited_exam_user_exam_session_question_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submited_exam', function (Blueprint $table) {
            $table->dropUnique('submited_exam_user_exam_session_question_unique');
        });
    }
};
