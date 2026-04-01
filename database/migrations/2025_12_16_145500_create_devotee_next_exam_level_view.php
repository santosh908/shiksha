<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("DROP VIEW IF EXISTS devotee_next_exam_level_view");

        DB::statement("
            CREATE VIEW devotee_next_exam_level_view AS
            SELECT
                users.login_id,
                MAX(pi2.id) as prid,
                MAX(al.ashery_leader_name) as ashery_leader_name,
                MAX(al_user.Initiated_name) as ashray_leader_initiated_name,
                MAX(bb.bhakti_bhikshuk_name) as bhakti_bhikshuk_name,
                MAX(bb_user.Initiated_name) as bhakti_leader_initiated_name,
                MAX(users.name) as name,
                MAX(users.email) as email,
                MAX(users.Initiated_name) as Initiated_name,
                MAX(users.contact_number) as contact_number,
                MAX(pi2.status_code) as account_approved,
                MAX(users.devotee_type) as devotee_type,
                MAX(pi2.current_address) as current_address,
                MAX(pi2.Sector_Area) as Sector_Area,
                MAX(pi2.Socity_Name) as Socity_Name,
                MAX(pi2.pincode) as pincode,
                MAX(pi2.created_at) as SubmitedDate,
                MAX(st.state_name) as state_name,
                MAX(dt.district_name) as district_name
            FROM users
            JOIN professional_information as pi2 ON users.id = pi2.user_id
            LEFT JOIN shiksah_lavel_completed as slc ON users.login_id = slc.login_id
            LEFT JOIN user_have_ashray_leader as uhal ON users.id = uhal.user_id
            LEFT JOIN bhakti_bhekshuk as bb ON uhal.Bhakti_Bhekshuk = bb.id
            LEFT JOIN ashery_leader as al ON uhal.ashray_leader_code = al.code
            LEFT JOIN users as al_user ON al.user_id = al_user.id
            LEFT JOIN users as bb_user ON bb.user_id = bb_user.id
            LEFT JOIN state as st ON st.lg_code = pi2.state_code
            LEFT JOIN district as dt ON dt.district_lg_code = pi2.district_code
            WHERE users.devotee_type = 'AD'
            AND pi2.status_code = 'A'
            GROUP BY users.login_id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS devotee_next_exam_level_view");
    }
};
