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
        Schema::table('tracking_surat', function (Blueprint $table) {
            // Ubah ->after('ke_user_id') menjadi ->after('status_surat_id')
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null')->after('status_surat_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tracking_surat', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn('user_id');
        });
    }
};