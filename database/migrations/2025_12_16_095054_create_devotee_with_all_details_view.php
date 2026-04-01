<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        $bookAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(b.book_name_english, ', ')"
            : "GROUP_CONCAT(b.book_name_english SEPARATOR ', ')";
        $seminarAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(s.seminar_name_english, ', ')"
            : "GROUP_CONCAT(s.seminar_name_english SEPARATOR ', ')";
        $prayerAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(pr.prayer_name_english, ', ')"
            : "GROUP_CONCAT(pr.prayer_name_english SEPARATOR ', ')";
        $principleAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(rp.principle_name_eglish, ', ')"
            : "GROUP_CONCAT(rp.principle_name_eglish SEPARATOR ', ')";

        // Drop view or table if they exist to start fresh
        DB::statement('DROP VIEW IF EXISTS devotee_with_all_details_view');
        DB::statement('DROP TABLE IF EXISTS devotee_with_all_details_view');

        DB::statement("
            CREATE VIEW devotee_with_all_details_view AS
            SELECT
                users.login_id,
                pi2.id as prid,
                al.ashery_leader_name,
                al_user.Initiated_name as ashray_leader_initiated_name,
                bb.bhakti_bhikshuk_name,
                bb_user.Initiated_name as bhakti_leader_initiated_name,
                users.name,
                users.email,
                users.contact_number,
                users.Initiated_name,
                users.dob,
                users.have_you_applied_before,
                pi2.status_code as account_approved,
                users.devotee_type,
                e.eduction_name,
                ms.merital_status_name,
                p.profession_name,
                pi2.spiritual_master,
                pi2.current_address,
                pi2.permanent_address,
                pi2.Sector_Area,
                pi2.Socity_Name,
                pi2.pincode,
                pi2.how_many_rounds_you_chant,
                pi2.when_are_you_chantin,
                pi2.spend_everyday_hearing_lectures,
                pi2.bakti_shastri_degree,
                pi2.since_when_you_attending_ashray_classes,
                pi2.spiritual_master_you_aspiring,
                pi2.state_code,
                pi2.created_at as SubmitedDate,
                st.state_name,
                dt.district_name,
                (SELECT {$bookAgg}
                 FROM devotee_book db 
                 JOIN book b ON b.id = db.book_id 
                 WHERE db.personal_info_id = pi2.id) as book_names,
                (SELECT {$seminarAgg}
                 FROM devotee_attended_seminar das 
                 JOIN seminar s ON s.id = das.seminar_id 
                 WHERE das.personal_info_id = pi2.id) as seminar_names,
                (SELECT {$prayerAgg}
                 FROM devotee_memorised_prayers dmp 
                 JOIN prayer pr ON pr.id = dmp.prayer_id 
                 WHERE dmp.personal_info_id = pi2.id) as prayer_names,
                (SELECT {$principleAgg}
                 FROM devotee_principles dp 
                 JOIN regulative_principle rp ON rp.id = dp.principle_id 
                 WHERE dp.personal_info_id = pi2.id) as principle_names
            FROM users
            LEFT JOIN professional_information as pi2 ON users.id = pi2.user_id
            LEFT JOIN education as e ON e.id = pi2.education
            LEFT JOIN merital_status as ms ON ms.id = pi2.marital_status
            LEFT JOIN profession as p ON p.id = pi2.profession
            LEFT JOIN user_have_ashray_leader as uhal ON users.id = uhal.user_id
            LEFT JOIN bhakti_bhekshuk as bb ON uhal.Bhakti_Bhekshuk = bb.id
            LEFT JOIN ashery_leader as al ON uhal.ashray_leader_code = al.code
            LEFT JOIN users as al_user ON al.user_id = al_user.id
            LEFT JOIN users as bb_user ON bb.user_id = bb_user.id
            LEFT JOIN state as st ON st.lg_code = pi2.state_code
            LEFT JOIN district as dt ON dt.district_lg_code = pi2.district_code
            WHERE users.devotee_type = 'AD'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS devotee_with_all_details_view');
    }
};
