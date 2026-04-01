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
        $driver = DB::getDriverName();
        $principlesAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(rp.principle_name_eglish, ', ')"
            : "GROUP_CONCAT(rp.principle_name_eglish SEPARATOR ', ')";
        $booksAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(b.book_name_english, ', ')"
            : "GROUP_CONCAT(b.book_name_english SEPARATOR ', ')";
        $prayersAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(pr.prayer_name_english, ', ')"
            : "GROUP_CONCAT(pr.prayer_name_english SEPARATOR ', ')";
        $seminarsAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(sem.seminar_name_english, ', ')"
            : "GROUP_CONCAT(sem.seminar_name_english SEPARATOR ', ')";
        $remarksAgg = $driver === 'sqlite'
            ? "GROUP_CONCAT(drr.remarks, ', ')"
            : "GROUP_CONCAT(drr.remarks SEPARATOR ', ')";

        DB::statement("DROP VIEW IF EXISTS devotee_registration_list_view");

        DB::statement("
            CREATE VIEW devotee_registration_list_view AS
            SELECT
                u.id as user_id,
                pi.id as ProfilePrID,
                al.ashery_leader_name,
                al_user.Initiated_name as ashray_leader_initiated_name,
                bb.bhakti_bhikshuk_name,
                bb_user.Initiated_name as bhakti_leader_initiated_name,
                al.code as ashray_leader_code,
                bb.user_id as bhakti_vriksha_user_id,
                u.devotee_type,
                u.name,
                u.Initiated_name,
                u.email,
                u.contact_number,
                u.dob,
                e.eduction_name,
                u.login_id,
                ms.merital_status_name,
                p.profession_name,
                pi.spiritual_master,
                pi.join_askcon,
                pi.current_address,
                pi.Socity_Name,
                pi.Sector_Area,
                d.district_name,
                s.state_name,
                pi.pincode,
                pi.how_many_rounds_you_chant,
                pi.when_are_you_chantin,
                pi.spend_everyday_hearing_lectures,
                pi.bakti_shastri_degree,
                pi.since_when_you_attending_ashray_classes,
                pi.spiritual_master_you_aspiring,
                COALESCE(NULLIF(pi.status_code, ''), 'P') as status_code,
                pi.created_at,
                (
                    SELECT {$principlesAgg}
                    FROM devotee_principles dp
                    JOIN regulative_principle rp ON rp.id = dp.principle_id
                    WHERE dp.personal_info_id = pi.id
                ) as regulative_principles,
                (
                    SELECT {$booksAgg}
                    FROM devotee_book db
                    JOIN book b ON b.id = db.book_id
                    WHERE db.personal_info_id = pi.id
                ) as DevoteeBookRead,
                (
                    SELECT {$prayersAgg}
                    FROM devotee_memorised_prayers dmp
                    JOIN prayer pr ON pr.id = dmp.prayer_id
                    WHERE dmp.personal_info_id = pi.id
                ) as DevoteePrayers,
                (
                    SELECT {$seminarsAgg}
                    FROM devotee_attended_seminar das
                    JOIN seminar sem ON sem.id = das.seminar_id
                    WHERE das.personal_info_id = pi.id
                ) as DevoteeSeminar,
                (
                    SELECT {$remarksAgg}
                    FROM devotee_registration_rejection drr
                    WHERE drr.profile_id = pi.id
                ) as DevoteeRemarks

            FROM users u
            LEFT JOIN professional_information pi ON pi.user_id = u.id
            LEFT JOIN education e ON e.id = pi.education
            LEFT JOIN merital_status ms ON ms.id = pi.marital_status
            LEFT JOIN profession p ON p.id = pi.profession
            LEFT JOIN state s ON s.lg_code = pi.state_code
            LEFT JOIN district d ON d.district_lg_code = pi.district_code
            LEFT JOIN user_have_ashray_leader uhal ON u.id = uhal.user_id
            LEFT JOIN ashery_leader al ON uhal.ashray_leader_code = al.code
            LEFT JOIN bhakti_bhekshuk bb ON uhal.Bhakti_Bhekshuk = bb.id
            LEFT JOIN users al_user ON al.user_id = al_user.id
            LEFT JOIN users bb_user ON bb.user_id = bb_user.id
            WHERE u.devotee_type = 'AD'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS devotee_registration_list_view');
    }
};
