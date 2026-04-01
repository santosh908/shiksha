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
        Schema::create('raise_queries', function (Blueprint $table) {
            $table->id();
            $table->text('subject');
            $table->text('description');
            $table->string('from_id');
            $table->string('to_id');
            $table->string('query_id');
            $table->boolean('is_viewed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raise_queries');
    }
};
