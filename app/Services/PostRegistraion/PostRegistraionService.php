<?php

namespace App\Services\PostRegistraion;

use App\Models\DevoteeAttendedSeminar;
use App\Models\DevoteeBookRead;
use App\Models\DevoteeMemoriesPrayer;
use App\Models\DevoteePrinciples;
use App\Models\DevoteeRegistraionRejected;
use App\Models\Prayer;
use Illuminate\Support\Facades\Auth;
use App\Models\Book;
use App\Models\District;
use App\Models\Principle;
use App\Models\Profession;
use App\Models\AsheryLeader;
use App\Models\Education;
use App\Models\MeritalStatus;
use App\Models\Seminar;
use App\Models\State;
use App\Models\RaiseQuery\RaiseQuery;
use App\Models\User;
use App\Models\ProfessionalInformation;
use App\Models\UserAssignAshrayLeader;
use App\Models\BhaktiBhekshuk;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class PostRegistraionService
{
    public function getMasterData()
    {
        $user = Auth::user();
        $personalInfo = ProfessionalInformation::where('user_id', $user->id)->first();

        $personalInfoData = $personalInfo ? $personalInfo->toArray() : null;

        $list = [
            'AshreyLeader' => AsheryLeader::with([
                'bhaktiBhikshuks' => function ($query) {
                    $query->orderBy('bhakti_bhikshuk_name', 'asc')
                        ->select(
                            'id as BhaktiBhikshukId',
                            'bhakti_bhikshuk_name',
                            'ashray_leader_code',
                            'user_id'
                        );
                },
                'bhaktiBhikshuks.user:id,initiated_name'
            ])
                ->orderBy('ashery_leader_name', 'asc')
                ->get()
                ->toArray(),
            'Book' => Book::orderBy('book_name_english', 'asc')->get()->toArray(),
            'District' => District::orderBy('district_name', 'asc')->get()->toArray(),
            'Education' => Education::orderBy('eduction_name', 'asc')->get()->toArray(),
            'MeritalStatus' => MeritalStatus::orderBy('merital_status_name', 'asc')->get()->toArray(),
            'Principle' => Principle::orderBy('principle_name_eglish', 'asc')->get()->toArray(),
            'Profession' => Profession::orderBy('profession_name', 'asc')->get()->toArray(),
            'Seminar' => Seminar::orderBy('seminar_name_english', 'asc')->get()->toArray(),
            'State' => State::orderBy('state_name', 'asc')->get()->toArray(),
            'User' => User::where('id', Auth::user()->id)->first(),
            'Prayers' => Prayer::orderBy('prayer_name_english', 'asc')->get()->toArray(),
            'DevoteeLeader' => UserAssignAshrayLeader::select('ashray_leader_code as code')->where('user_id', $user->id)->first(),
            'BhaktiBhikshuk' => UserAssignAshrayLeader::select('Bhakti_Bhekshuk')->where('user_id', $user->id)->first(),
            'PersonalInfo' => $personalInfoData ? array_merge($personalInfoData, ['encrypted_id' => $personalInfo->encrypted_id]) : null,
            'DevoteePrinciple' => $personalInfo ? DevoteePrinciples::select('principle_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeBookRead' => $personalInfo ? DevoteeBookRead::select('book_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeMemoriesPrayer' => $personalInfo ? DevoteeMemoriesPrayer::select('prayer_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeAttendedSeminar' => $personalInfo ? DevoteeAttendedSeminar::select('seminar_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
        ];
        return $list;
    }
    public function getDevoteeDtails($userid)
    {
        $professionalInfo = ProfessionalInformation::where('user_id', $userid)->first();
        return [
            'AshreyLeader' => AsheryLeader::with([
                'bhaktiBhikshuks' => function ($query) {
                    $query->orderBy('bhakti_bhikshuk_name', 'asc')
                        ->select(
                            'id as BhaktiBhikshukId',
                            'bhakti_bhikshuk_name',
                            'ashray_leader_code',
                            'user_id'
                        );
                },
                'bhaktiBhikshuks.user:id,initiated_name'
            ])
                ->orderBy('ashery_leader_name', 'asc')
                ->get()
                ->toArray(),
            'Book' => Book::orderBy('book_name_english', 'asc')->get()->toArray(),
            'District' => District::orderBy('district_name', 'asc')->get()->toArray(),
            'Education' => Education::orderBy('eduction_name', 'asc')->get()->toArray(),
            'MeritalStatus' => MeritalStatus::orderBy('merital_status_name', 'asc')->get()->toArray(),
            'Principle' => Principle::orderBy('principle_name_eglish', 'asc')->get()->toArray(),
            'Profession' => Profession::orderBy('profession_name', 'asc')->get()->toArray(),
            'Seminar' => Seminar::orderBy('seminar_name_english', 'asc')->get()->toArray(),
            'State' => State::orderBy('state_name', 'asc')->get()->toArray(),
            'User' => User::where('id', $userid)->first(),
            'Prayers' => Prayer::orderBy('prayer_name_english', 'asc')->get()->toArray(),
            'DevoteeLeader' => UserAssignAshrayLeader::select('ashray_leader_code as code')->where('user_id', $userid)->first(),
            'BhaktiBhikshuk' => UserAssignAshrayLeader::select('Bhakti_Bhekshuk')->where('user_id', $userid)->first(),
            'PersonalInfo' => $professionalInfo,
            'DevoteePrinciple' => $professionalInfo ? DevoteePrinciples::select('principle_id as id')->where('personal_info_id', $professionalInfo->id)->get() : null,
            'DevoteeBookRead' => $professionalInfo ? DevoteeBookRead::select('book_id as id')->where('personal_info_id', $professionalInfo->id)->get() : null,
            'DevoteeMemoriesPrayer' => $professionalInfo ? DevoteeMemoriesPrayer::select('prayer_id as id')->where('personal_info_id', $professionalInfo->id)->get() : null,
            'DevoteeAttendedSeminar' => $professionalInfo ? DevoteeAttendedSeminar::select('seminar_id as id')->where('personal_info_id', $professionalInfo->id)->get() : null,
        ];
    }

    public function getPartiallDevoteeDtails($userID)
    {
        $personalInfo = ProfessionalInformation::where('user_id', $userID)->first();
        //dd($userID);
        $personalInfoData = $personalInfo ? $personalInfo->toArray() : [];

        return [
            'AshreyLeader' => AsheryLeader::with([
                'bhaktiBhikshuks' => function ($query) {
                    $query->orderBy('bhakti_bhikshuk_name', 'asc')
                        ->select('id as BhaktiBhikshukId', 'bhakti_bhikshuk_name', 'ashray_leader_code');
                }
            ])
                ->orderBy('ashery_leader_name', 'asc')
                ->get()
                ->toArray(),
            'Book' => Book::orderBy('book_name_english', 'asc')->get()->toArray(),
            'District' => District::orderBy('district_name', 'asc')->get()->toArray(),
            'Education' => Education::orderBy('eduction_name', 'asc')->get()->toArray(),
            'MeritalStatus' => MeritalStatus::orderBy('merital_status_name', 'asc')->get()->toArray(),
            'Principle' => Principle::orderBy('principle_name_eglish', 'asc')->get()->toArray(),
            'Profession' => Profession::orderBy('profession_name', 'asc')->get()->toArray(),
            'Seminar' => Seminar::orderBy('seminar_name_english', 'asc')->get()->toArray(),
            'State' => State::orderBy('state_name', 'asc')->get()->toArray(),
            'User' => User::where('id', $userID)->first(),
            'Prayers' => Prayer::orderBy('prayer_name_english', 'asc')->get()->toArray(),
            'DevoteeLeader' => UserAssignAshrayLeader::select('ashray_leader_code as code')->where('user_id', $userID)->first(),
            'PersonalInfo' => $personalInfoData ? array_merge($personalInfoData, ['encrypted_id' => $personalInfo->encrypted_id]) : null,
            'DevoteePrinciple' => $personalInfo ? DevoteePrinciples::select('principle_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeBookRead' => $personalInfo ? DevoteeBookRead::select('book_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeMemoriesPrayer' => $personalInfo ? DevoteeMemoriesPrayer::select('prayer_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
            'DevoteeAttendedSeminar' => $personalInfo ? DevoteeAttendedSeminar::select('seminar_id as id')->where('personal_info_id', $personalInfo->id)->get() : null,
        ];
    }
    public function SavePersonalInfo($request)
    {
        $user = Auth::user();
        return ProfessionalInformation::updateOrCreate(
            ['user_id' => $user->id],
            [
                'education' => $request['Educational'],
                'marital_status' => $request['MaritalStatus'],
                'profession' => $request['Profession'],
                "spiritual_master" => $request['SpiritualMaster'],
                "join_askcon" => $request['JoinedSckon'],
                'current_address' => $request['CurrentAddress'],
                'Sector_Area' => $request['Sector_Area'],
                'Socity_Name' => $request['Socity_Name'],
                'pincode' => $request['Pincode'],
                'state_code' => $request['State'],
                'district_code' => $request['District'],
                'personal_info' => "Y",
            ]
        );
    }
    public function SaveProfessionalInfo($request): ProfessionalInformation
    {
        $user = Auth::user();

        // Retrieve existing record or create a new one
        $professionalInfo = ProfessionalInformation::where('user_id', $user->id)->first();

        if (!$professionalInfo) {
            // If record doesn't exist, create a new one
            $professionalInfo = new ProfessionalInformation();
            $professionalInfo->user_id = $user->id;
        }

        // Update the record with new data
        $professionalInfo->how_many_rounds_you_chant = $request['NoOfChant'];
        $professionalInfo->when_are_you_chantin = $request['ChantingStartDate'];
        $professionalInfo->spend_everyday_hearing_lectures = $request['SpendTimeHearingLecture'];
        $professionalInfo->professional_info = 'Y';
        $professionalInfo->save(); // Save changes to the database

        // Sync the many-to-many relationships
        $professionalInfo->devoteePrinciples()->sync($request->RegulativePrinciples);

        $professionalInfo->devoteeBookRead()->sync($request->BooksRead);

        return $professionalInfo;
    }
    public function SaveHearingReading($request): ProfessionalInformation
    {
        $user = Auth::user();

        // Retrieve existing record or create a new one
        $professionalInfo = ProfessionalInformation::where('user_id', $user->id)->first();

        if (!$professionalInfo) {
            // If record doesn't exist, create a new one
            $professionalInfo = new ProfessionalInformation();
            $professionalInfo->user_id = $user->id;
        }

        // Update the record with new data
        $professionalInfo->bakti_shastri_degree = $request['ShastriDegree'];
        $professionalInfo->hearing_reading = 'Y';
        $professionalInfo->save(); // Save changes to the database

        $professionalInfo->devoteeMemorisePrayer()->sync($request->MemorisedPrayers);

        $professionalInfo->devoteeAttendedSeminar()->sync($request->Seminar);

        return $professionalInfo;
    }
    public function SaveDevoteeSeminar($request): ProfessionalInformation
    {
        $user = Auth::user();
        // Retrieve existing record or create a new one
        $professionalInfo = ProfessionalInformation::where('user_id', $user->id)->first();

        if (!$professionalInfo) {
            // If record doesn't exist, create a new one
            $professionalInfo = new ProfessionalInformation();
            $professionalInfo->user_id = $user->id;
        }

        if ($professionalInfo->status_code !== 'S' && $professionalInfo->status_code !== 'A') {
            // Update the record with new data
            $professionalInfo->since_when_you_attending_ashray_classes = $request['since_when_you_attending_ashray_classes'];
            $professionalInfo->spiritual_master_you_aspiring = $request['spiritual_master_you_aspiring'];
            $professionalInfo->seminar = 'Y';

            // Set status_code to 'S' only if it’s not already set to 'S' or 'A'
            $professionalInfo->status_code = 'S';

            $professionalInfo->save();

            // Save or update the ashray leader information
            $leader = UserAssignAshrayLeader::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'ashray_leader_code' => $request['ashray_leader_code'],
                    'Bhakti_Bhekshuk' => $request['Bhakti_BhikshukId'] ?? 0,
                    'is_active' => $request['Y'],
                ]
            );
        } else {
            $professionalInfo->since_when_you_attending_ashray_classes = $request['since_when_you_attending_ashray_classes'];
            $professionalInfo->spiritual_master_you_aspiring = $request['spiritual_master_you_aspiring'];
            $professionalInfo->save();

            UserAssignAshrayLeader::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'ashray_leader_code' => $request['ashray_leader_code'],
                    'Bhakti_Bhekshuk' => $request['Bhakti_BhikshukId'] ?? 0,
                    'is_active' => $request['Y'],
                ]
            );
        }


        return $professionalInfo;
    }
    public function GetDevoteeRegistrationList()
    {
        $user = Auth::user();
        $AshrayLeaderCode = User::join('ashery_leader', 'users.id', '=', 'ashery_leader.user_id')
            ->where('ashery_leader.user_id', $user->id)
            ->get('ashery_leader.code')->toArray();
        $DevoteeList = null;
        if (!empty($AshrayLeaderCode) && isset($AshrayLeaderCode[0]['code'])) {
            $DevoteeList = UserAssignAshrayLeader::join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
                ->join('ashery_leader', 'ashery_leader.code', 'user_have_ashray_leader.ashray_leader_code')
                ->join('professional_information', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
                ->join('education', 'education.id', '=', 'professional_information.education')
                ->join('merital_status', 'merital_status.id', '=', 'professional_information.marital_status')
                ->join('profession', 'profession.id', '=', 'professional_information.profession')
                ->join('state', 'state.lg_code', '=', 'professional_information.state_code')
                ->join('district', 'district.district_lg_code', '=', 'professional_information.district_code')
                ->leftJoin('users as al_user', 'ashery_leader.user_id', '=', 'al_user.id')
                ->where('user_have_ashray_leader.ashray_leader_code', '=', $AshrayLeaderCode[0]['code'])
                ->whereIn('professional_information.status_code', ['S', 'R', 'A'])
                ->where('user_have_ashray_leader.Bhakti_Bhekshuk', '0')
                ->select(
                    'users.id as user_id',
                    'professional_information.id as ProfilePrID',
                    'ashery_leader.ashery_leader_name',
                    'al_user.Initiated_name as ashray_leader_initiated_name',
                    'users.devotee_type',
                    'users.name',
                    'users.Initiated_name',
                    'users.email',
                    'users.contact_number',
                    'users.dob',
                    'education.eduction_name',
                    'users.login_id',
                    'merital_status.merital_status_name',
                    'profession.profession_name',
                    'professional_information.spiritual_master',
                    'professional_information.join_askcon',
                    'professional_information.current_address',
                    'professional_information.Socity_Name',
                    'professional_information.Sector_Area',
                    'district.district_name',
                    'state.state_name',
                    'professional_information.pincode',
                    'professional_information.how_many_rounds_you_chant',
                    'professional_information.when_are_you_chantin',
                    'professional_information.spend_everyday_hearing_lectures',
                    'professional_information.bakti_shastri_degree',
                    'professional_information.since_when_you_attending_ashray_classes',
                    'professional_information.spiritual_master_you_aspiring',
                    'professional_information.status_code',
                    'professional_information.created_at',
                )
                ->get()
                ->toArray();

            // Now fetch the regulative principles and group them by user ID 
            $RegulativePrinciples = DevoteePrinciples::join('regulative_principle', 'regulative_principle.id', '=', 'devotee_principles.principle_id')
                ->select('personal_info_id', 'regulative_principle.principle_name_eglish')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeBooks = DevoteeBookRead::join('book', 'book.id', '=', 'devotee_book.book_id')
                ->select('personal_info_id', 'book.book_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $MemorisePrayers = DevoteeMemoriesPrayer::join('prayer', 'prayer.id', '=', 'devotee_memorised_prayers.prayer_id')
                ->select('devotee_memorised_prayers.personal_info_id', 'prayer.prayer_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeSeminarList = DevoteeAttendedSeminar::join('seminar', 'seminar.id', '=', 'devotee_attended_seminar.seminar_id')
                ->select('devotee_attended_seminar.personal_info_id', 'seminar.seminar_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeRemarksList = DevoteeRegistraionRejected::join('professional_information', 'professional_information.id', '=', 'devotee_registration_rejection.profile_id')
                ->select('devotee_registration_rejection.profile_id', 'devotee_registration_rejection.remarks')
                ->get()
                ->groupBy('profile_id')
                ->toArray();

            foreach ($DevoteeList as &$devotee) {
                // Use the ProfilePrID (which corresponds to personal_info_id) to find principles
                $devotee['regulative_principles'] = isset($RegulativePrinciples[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['principle_name_eglish']; // Only return the name
                    }, $RegulativePrinciples[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeBookRead'] = isset($DevoteeBooks[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['book_name_english']; // Only return the name
                    }, $DevoteeBooks[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteePrayers'] = isset($MemorisePrayers[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['prayer_name_english']; // Only return the name
                    }, $MemorisePrayers[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeSeminar'] = isset($DevoteeSeminarList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['seminar_name_english']; // Only return the name
                    }, $DevoteeSeminarList[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeRemarks'] = isset($DevoteeRemarksList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['remarks']; // Only return the name
                    }, $DevoteeRemarksList[$devotee['ProfilePrID']])
                    : [];
            }
        } else {
            $DevoteeList = ['message' => 'No record found'];
        }
        return [
            'RegistrationRequest' => $DevoteeList,
        ];
    }
    public function AshrayLeaderGetBhaktiBhikshukDevoteeList()
    {
        $user = Auth::user();
        $AshrayLeaderCode = User::join('ashery_leader', 'users.id', '=', 'ashery_leader.user_id')
            ->where('ashery_leader.user_id', $user->id)
            ->get('ashery_leader.code')->toArray();
        $DevoteeList = null;
        if (!empty($AshrayLeaderCode) && isset($AshrayLeaderCode[0]['code'])) {
            $DevoteeList = UserAssignAshrayLeader::join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
                ->join('ashery_leader', 'ashery_leader.code', 'user_have_ashray_leader.ashray_leader_code')
                ->join('bhakti_bhekshuk', 'bhakti_bhekshuk.id', 'user_have_ashray_leader.Bhakti_Bhekshuk')
                ->join('professional_information', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
                ->join('education', 'education.id', '=', 'professional_information.education')
                ->join('merital_status', 'merital_status.id', '=', 'professional_information.marital_status')
                ->join('profession', 'profession.id', '=', 'professional_information.profession')
                ->join('state', 'state.lg_code', '=', 'professional_information.state_code')
                ->join('district', 'district.district_lg_code', '=', 'professional_information.district_code')
                ->leftJoin('users as al_user', 'ashery_leader.user_id', '=', 'al_user.id')
                ->leftJoin('users as bb_user', 'bhakti_bhekshuk.user_id', '=', 'bb_user.id')
                ->where('user_have_ashray_leader.ashray_leader_code', '=', $AshrayLeaderCode[0]['code'])
                ->whereIn('professional_information.status_code', ['S', 'R', 'A'])
                ->where('user_have_ashray_leader.Bhakti_Bhekshuk', '!=', '0')
                ->select(
                    'users.id as user_id',
                    'professional_information.id as ProfilePrID',
                    'ashery_leader.ashery_leader_name',
                    'al_user.Initiated_name as ashray_leader_initiated_name',
                    'bhakti_bhekshuk.bhakti_bhikshuk_name',
                    'bb_user.Initiated_name as bhakti_leader_initiated_name',
                    'users.devotee_type',
                    'users.name',
                    'users.Initiated_name',
                    'users.email',
                    'users.contact_number',
                    'users.dob',
                    'education.eduction_name',
                    'users.login_id',
                    'merital_status.merital_status_name',
                    'profession.profession_name',
                    'professional_information.spiritual_master',
                    'professional_information.join_askcon',
                    'professional_information.current_address',
                    'professional_information.Socity_Name',
                    'professional_information.Sector_Area',
                    'district.district_name',
                    'state.state_name',
                    'professional_information.pincode',
                    'professional_information.how_many_rounds_you_chant',
                    'professional_information.when_are_you_chantin',
                    'professional_information.spend_everyday_hearing_lectures',
                    'professional_information.bakti_shastri_degree',
                    'professional_information.since_when_you_attending_ashray_classes',
                    'professional_information.spiritual_master_you_aspiring',
                    'professional_information.status_code',
                    'professional_information.created_at',
                )
                ->get()
                ->toArray();

            // Now fetch the regulative principles and group them by user ID 
            $RegulativePrinciples = DevoteePrinciples::join('regulative_principle', 'regulative_principle.id', '=', 'devotee_principles.principle_id')
                ->select('personal_info_id', 'regulative_principle.principle_name_eglish')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeBooks = DevoteeBookRead::join('book', 'book.id', '=', 'devotee_book.book_id')
                ->select('personal_info_id', 'book.book_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $MemorisePrayers = DevoteeMemoriesPrayer::join('prayer', 'prayer.id', '=', 'devotee_memorised_prayers.prayer_id')
                ->select('devotee_memorised_prayers.personal_info_id', 'prayer.prayer_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeSeminarList = DevoteeAttendedSeminar::join('seminar', 'seminar.id', '=', 'devotee_attended_seminar.seminar_id')
                ->select('devotee_attended_seminar.personal_info_id', 'seminar.seminar_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeRemarksList = DevoteeRegistraionRejected::join('professional_information', 'professional_information.id', '=', 'devotee_registration_rejection.profile_id')
                ->select('devotee_registration_rejection.profile_id', 'devotee_registration_rejection.remarks')
                ->get()
                ->groupBy('profile_id')
                ->toArray();

            foreach ($DevoteeList as &$devotee) {
                // Use the ProfilePrID (which corresponds to personal_info_id) to find principles
                $devotee['regulative_principles'] = isset($RegulativePrinciples[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['principle_name_eglish']; // Only return the name
                    }, $RegulativePrinciples[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeBookRead'] = isset($DevoteeBooks[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['book_name_english']; // Only return the name
                    }, $DevoteeBooks[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteePrayers'] = isset($MemorisePrayers[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['prayer_name_english']; // Only return the name
                    }, $MemorisePrayers[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeSeminar'] = isset($DevoteeSeminarList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['seminar_name_english']; // Only return the name
                    }, $DevoteeSeminarList[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeRemarks'] = isset($DevoteeRemarksList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['remarks']; // Only return the name
                    }, $DevoteeRemarksList[$devotee['ProfilePrID']])
                    : [];
            }
        } else {
            $DevoteeList = ['message' => 'No record found'];
        }
        return [
            'RegistrationRequest' => $DevoteeList,
        ];
    }
    public function GetBhaktiBhikshukDevoteeList()
    {
        $user = Auth::user();
        $bhakti_bhekshuk = User::join('bhakti_bhekshuk', 'users.id', '=', 'bhakti_bhekshuk.user_id')
            ->where('bhakti_bhekshuk.user_id', $user->id)
            ->get('bhakti_bhekshuk.id')->toArray();
        $DevoteeList = null;
        if (!empty($bhakti_bhekshuk) && isset($bhakti_bhekshuk[0]['id'])) {
            $DevoteeList = UserAssignAshrayLeader::join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
                ->join('ashery_leader', 'ashery_leader.code', 'user_have_ashray_leader.ashray_leader_code')
                ->join('bhakti_bhekshuk', 'bhakti_bhekshuk.id', 'user_have_ashray_leader.Bhakti_Bhekshuk')
                ->join('professional_information', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
                ->join('education', 'education.id', '=', 'professional_information.education')
                ->join('merital_status', 'merital_status.id', '=', 'professional_information.marital_status')
                ->join('profession', 'profession.id', '=', 'professional_information.profession')
                ->join('state', 'state.lg_code', '=', 'professional_information.state_code')
                ->join('district', 'district.district_lg_code', '=', 'professional_information.district_code')
                ->leftJoin('users as al_user', 'ashery_leader.user_id', '=', 'al_user.id')
                ->leftJoin('users as bb_user', 'bhakti_bhekshuk.user_id', '=', 'bb_user.id')
                ->where('bhakti_bhekshuk.id', '=', $bhakti_bhekshuk[0]['id'])
                ->whereIn('professional_information.status_code', ['S', 'R', 'A'])
                ->select(
                    'professional_information.id as ProfilePrID',
                    'ashery_leader.ashery_leader_name',
                    'al_user.Initiated_name as ashray_leader_initiated_name',
                    'bhakti_bhekshuk.bhakti_bhikshuk_name',
                    'bb_user.Initiated_name as bhakti_leader_initiated_name',
                    'users.devotee_type',
                    'users.name',
                    'users.Initiated_name',
                    'users.email',
                    'users.contact_number',
                    'users.dob',
                    'education.eduction_name',
                    'users.login_id',
                    'merital_status.merital_status_name',
                    'profession.profession_name',
                    'professional_information.spiritual_master',
                    'professional_information.join_askcon',
                    'professional_information.current_address',
                    'professional_information.Socity_Name',
                    'professional_information.Sector_Area',
                    'district.district_name',
                    'state.state_name',
                    'professional_information.pincode',
                    'professional_information.how_many_rounds_you_chant',
                    'professional_information.when_are_you_chantin',
                    'professional_information.spend_everyday_hearing_lectures',
                    'professional_information.bakti_shastri_degree',
                    'professional_information.since_when_you_attending_ashray_classes',
                    'professional_information.spiritual_master_you_aspiring',
                    'professional_information.status_code',
                    'professional_information.created_at',
                )
                ->get()
                ->toArray();

            // Now fetch the regulative principles and group them by user ID 
            $RegulativePrinciples = DevoteePrinciples::join('regulative_principle', 'regulative_principle.id', '=', 'devotee_principles.principle_id')
                ->select('personal_info_id', 'regulative_principle.principle_name_eglish')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeBooks = DevoteeBookRead::join('book', 'book.id', '=', 'devotee_book.book_id')
                ->select('personal_info_id', 'book.book_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $MemorisePrayers = DevoteeMemoriesPrayer::join('prayer', 'prayer.id', '=', 'devotee_memorised_prayers.prayer_id')
                ->select('devotee_memorised_prayers.personal_info_id', 'prayer.prayer_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeSeminarList = DevoteeAttendedSeminar::join('seminar', 'seminar.id', '=', 'devotee_attended_seminar.seminar_id')
                ->select('devotee_attended_seminar.personal_info_id', 'seminar.seminar_name_english')
                ->get()
                ->groupBy('personal_info_id')
                ->toArray();
            $DevoteeRemarksList = DevoteeRegistraionRejected::join('professional_information', 'professional_information.id', '=', 'devotee_registration_rejection.profile_id')
                ->select('devotee_registration_rejection.profile_id', 'devotee_registration_rejection.remarks')
                ->get()
                ->groupBy('profile_id')
                ->toArray();

            foreach ($DevoteeList as &$devotee) {
                // Use the ProfilePrID (which corresponds to personal_info_id) to find principles
                $devotee['regulative_principles'] = isset($RegulativePrinciples[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['principle_name_eglish']; // Only return the name
                    }, $RegulativePrinciples[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeBookRead'] = isset($DevoteeBooks[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['book_name_english']; // Only return the name
                    }, $DevoteeBooks[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteePrayers'] = isset($MemorisePrayers[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['prayer_name_english']; // Only return the name
                    }, $MemorisePrayers[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeSeminar'] = isset($DevoteeSeminarList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['seminar_name_english']; // Only return the name
                    }, $DevoteeSeminarList[$devotee['ProfilePrID']])
                    : [];

                $devotee['DevoteeRemarks'] = isset($DevoteeRemarksList[$devotee['ProfilePrID']])
                    ? array_map(function ($item) {
                        return $item['remarks']; // Only return the name
                    }, $DevoteeRemarksList[$devotee['ProfilePrID']])
                    : [];
            }
        } else {
            $DevoteeList = ['message' => 'No record found'];
        }
        return [
            'RegistrationRequest' => $DevoteeList,
        ];
    }
    public function SuperAdminGetBhaktiBhikshukDevoteeList()
    {
        $user = Auth::user();

        // Start building the query
        $query = UserAssignAshrayLeader::join('users', 'users.id', '=', 'user_have_ashray_leader.user_id')
            ->rightJoin('bhakti_bhekshuk', 'user_have_ashray_leader.Bhakti_Bhekshuk', '=', 'bhakti_bhekshuk.id')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'bhakti_bhekshuk.ashray_leader_code')
            ->leftJoin('professional_information', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->leftJoin('education', 'education.id', '=', 'professional_information.education')
            ->leftJoin('merital_status', 'merital_status.id', '=', 'professional_information.marital_status')
            ->leftJoin('profession', 'profession.id', '=', 'professional_information.profession')
            ->leftJoin('state', 'state.lg_code', '=', 'professional_information.state_code')
            ->leftJoin('district', 'district.district_lg_code', '=', 'professional_information.district_code')
            ->leftJoin('devotee_registration_rejection', 'devotee_registration_rejection.profile_id', '=', 'professional_information.id')
            ->whereIn('professional_information.status_code', ['S', 'R', 'A'])
            ->where('user_have_ashray_leader.Bhakti_Bhekshuk', '!=', '0');

        if ($user && $user->hasRole('AsheryLeader')) {
            $asheryLeader = AsheryLeader::where('user_id', $user->id)->first();
            if ($asheryLeader) {
                $query->where('ashery_leader.code', '=', $asheryLeader->code);
            }
        }

        if ($user && $user->hasRole('BhaktiVriksha')) {
            $query->where('bhakti_bhekshuk.user_id', '=', $user->id);
        }

        $DevoteeList = $query->select(
            'users.login_id',
            'professional_information.id as ProfilePrID',
            'ashery_leader.ashery_leader_name',
            'bhakti_bhekshuk.bhakti_bhikshuk_name',
            'users.devotee_type',
            'users.name',
            'users.Initiated_name',
            'users.email',
            'users.contact_number',
            'users.dob',
            'education.eduction_name',
            'merital_status.merital_status_name',
            'profession.profession_name',
            'professional_information.spiritual_master',
            'professional_information.join_askcon',
            'professional_information.current_address',
            'professional_information.Socity_Name',
            'professional_information.Sector_Area',
            'district.district_name',
            'state.state_name',
            'professional_information.pincode',
            'professional_information.how_many_rounds_you_chant',
            'professional_information.when_are_you_chantin',
            'professional_information.spend_everyday_hearing_lectures',
            'professional_information.bakti_shastri_degree',
            'professional_information.since_when_you_attending_ashray_classes',
            'professional_information.spiritual_master_you_aspiring',
            'professional_information.status_code',
            'professional_information.created_at'
        )
            ->groupBy(
                'users.login_id',
                'professional_information.id',
                'ashery_leader.ashery_leader_name',
                'bhakti_bhekshuk.bhakti_bhikshuk_name',
                'users.devotee_type',
                'users.name',
                'users.Initiated_name',
                'users.email',
                'users.contact_number',
                'users.dob',
                'education.eduction_name',
                'merital_status.merital_status_name',
                'profession.profession_name',
                'professional_information.spiritual_master',
                'professional_information.join_askcon',
                'professional_information.current_address',
                'professional_information.Socity_Name',
                'professional_information.Sector_Area',
                'district.district_name',
                'state.state_name',
                'professional_information.pincode',
                'professional_information.how_many_rounds_you_chant',
                'professional_information.when_are_you_chantin',
                'professional_information.spend_everyday_hearing_lectures',
                'professional_information.bakti_shastri_degree',
                'professional_information.since_when_you_attending_ashray_classes',
                'professional_information.spiritual_master_you_aspiring',
                'professional_information.status_code',
                'professional_information.created_at'
            )
            ->get()
            ->toArray();

        // Now fetch the regulative principles and group them by user ID
        $RegulativePrinciples = DevoteePrinciples::join('regulative_principle', 'regulative_principle.id', '=', 'devotee_principles.principle_id')
            ->select('personal_info_id', 'regulative_principle.principle_name_eglish')
            ->get()
            ->groupBy('personal_info_id')
            ->toArray();
        $DevoteeBooks = DevoteeBookRead::join('book', 'book.id', '=', 'devotee_book.book_id')
            ->select('personal_info_id', 'book.book_name_english')
            ->get()
            ->groupBy('personal_info_id')
            ->toArray();
        $MemorisePrayers = DevoteeMemoriesPrayer::join('prayer', 'prayer.id', '=', 'devotee_memorised_prayers.prayer_id')
            ->select('devotee_memorised_prayers.personal_info_id', 'prayer.prayer_name_english')
            ->get()
            ->groupBy('personal_info_id')
            ->toArray();
        $DevoteeSeminarList = DevoteeAttendedSeminar::join('seminar', 'seminar.id', '=', 'devotee_attended_seminar.seminar_id')
            ->select('devotee_attended_seminar.personal_info_id', 'seminar.seminar_name_english')
            ->get()
            ->groupBy('personal_info_id')
            ->toArray();

        $DevoteeRemarksList = DevoteeRegistraionRejected::join('professional_information', 'professional_information.id', '=', 'devotee_registration_rejection.profile_id')
            ->select('devotee_registration_rejection.profile_id', 'devotee_registration_rejection.remarks')
            ->get()
            ->groupBy('profile_id')
            ->toArray();

        foreach ($DevoteeList as &$devotee) {
            // Use the ProfilePrID (which corresponds to personal_info_id) to find principles
            $devotee['regulative_principles'] = isset($RegulativePrinciples[$devotee['ProfilePrID']])
                ? array_map(function ($item) {
                    return $item['principle_name_eglish']; // Only return the name
                }, $RegulativePrinciples[$devotee['ProfilePrID']])
                : [];

            $devotee['DevoteeBookRead'] = isset($DevoteeBooks[$devotee['ProfilePrID']])
                ? array_map(function ($item) {
                    return $item['book_name_english']; // Only return the name
                }, $DevoteeBooks[$devotee['ProfilePrID']])
                : [];

            $devotee['DevoteePrayers'] = isset($MemorisePrayers[$devotee['ProfilePrID']])
                ? array_map(function ($item) {
                    return $item['prayer_name_english']; // Only return the name
                }, $MemorisePrayers[$devotee['ProfilePrID']])
                : [];

            $devotee['DevoteeSeminar'] = isset($DevoteeSeminarList[$devotee['ProfilePrID']])
                ? array_map(function ($item) {
                    return $item['seminar_name_english']; // Only return the name
                }, $DevoteeSeminarList[$devotee['ProfilePrID']])
                : [];

            $devotee['DevoteeRemarks'] = isset($DevoteeRemarksList[$devotee['ProfilePrID']])
                ? array_map(function ($item) {
                    return $item['remarks']; // Only return the name
                }, $DevoteeRemarksList[$devotee['ProfilePrID']])
                : [];
        }

        return [
            'RegistrationRequest' => $DevoteeList,
        ];
    }

    public function DevoteeSuperAdminList()
    {
        $user = Auth::user();
        $query = DB::table('devotee_registration_list_view');
        
        // ---------------- Role Based Filters ----------------
        if ($user && $user->hasRole('AsheryLeader')) {
            $asheryLeader = AsheryLeader::where('user_id', $user->id)->first();
            if ($asheryLeader) {
                $query->where('ashray_leader_code', '=', $asheryLeader->code);
                    //->where(function ($q) {
                    //    $q->where('bhakti_vriksha_user_id', 0)
                   //         ->orWhereNull('bhakti_vriksha_user_id');
                   // });
            }
        }

        if ($user && $user->hasRole('BhaktiVriksha')) {
            $query->where('bhakti_vriksha_user_id', '=', $user->id);
        }

        $list = $query->orderBy('user_id', 'desc')->get();

        // ---------------- Format Data ----------------
        $DevoteeList = $list->map(function ($item) {
            // Convert objects to arrays if needed, or keep as objects. 
            // The previous code returned arrays, so we can cast to array if strict compatibility is needed.
            $devotee = (array) $item;

            // Explode comma-separated strings back to arrays
            $devotee['regulative_principles'] = !empty($item->regulative_principles) ? explode(', ', $item->regulative_principles) : [];
            $devotee['DevoteeBookRead'] = !empty($item->DevoteeBookRead) ? explode(', ', $item->DevoteeBookRead) : [];
            $devotee['DevoteePrayers'] = !empty($item->DevoteePrayers) ? explode(', ', $item->DevoteePrayers) : [];
            $devotee['DevoteeSeminar'] = !empty($item->DevoteeSeminar) ? explode(', ', $item->DevoteeSeminar) : [];
            $devotee['DevoteeRemarks'] = !empty($item->DevoteeRemarks) ? explode(', ', $item->DevoteeRemarks) : [];

            // Ensure status_code default
            if (empty($devotee['status_code'])) {
                $devotee['status_code'] = 'P';
            }

            return $devotee;
        })->toArray();

        return [
            'RegistrationRequest' => $DevoteeList,
        ];
    }
    public function ApproveDevoteeByLeader($personalinfo)
    {
        $user = Auth::user();
        $professionalInfo = ProfessionalInformation::where('id', $personalinfo)->first();
        if ($professionalInfo) {
            $professionalInfo->status_code = "A";
            $professionalInfo->approved_by = $user->id;
            $professionalInfo->save(); // Save changes to the database

            $userDetails = User::where('id', $professionalInfo->user_id)->first();
            if ($userDetails) { // Check if userDetails was found
                $userDetails->account_approved = "Y";
                $userDetails->save(); // Save changes to the database
            }
        }

        return $professionalInfo;
    }
    public function getEmailByProfessionalId($professionalId)
    {
        $email = ProfessionalInformation::join('users', 'professional_information.user_id', '=', 'users.id')
            ->where('professional_information.id', $professionalId)
            ->value('users.email'); // Use value() to get a single column directly

        return $email; // This will return the email string
    }
    public function RejectedDevotee($remarks, $personalinfo)
    {
            $userDetails = User::where('id', $personalinfo)->first();
            if ($userDetails) { // Check if userDetails was found
                $userDetails->account_approved = 'R';
                $userDetails->save(); // Save changes to the database

                $professionalInfo = ProfessionalInformation::where('user_id', $personalinfo)->first();
                if ($professionalInfo) {

                    $user = Auth::user();
                    $professionalInfo->status_code = 'R';
                    $professionalInfo->rejected_by = $user->id;
                    $professionalInfo->save(); // Save changes to the database
                }

                $RejectedRemarks = new DevoteeRegistraionRejected();
                $RejectedRemarks->profile_id = $professionalInfo->id;
                $RejectedRemarks->rejected_by = $user->id;
                $RejectedRemarks->remarks = $remarks;
                $RejectedRemarks->save();
            }

        return $userDetails;
    }
    public function SuperAdminUpdatePersonalInfo($request)
    {
        $user = Auth::user();

        // Fetch or create the professional information record
        $professionalInfo = ProfessionalInformation::firstOrNew(
            ['id' => $request->profileId], // Search criteria
            ['user_id' => $request->userId]   // Set defaults for new record
        );

        // Update the fields for professional information
        $professionalInfo->education = $request->Educational;
        $professionalInfo->marital_status = $request->MaritalStatus;
        $professionalInfo->profession = $request->Profession;
        $professionalInfo->spiritual_master = $request->SpiritualMaster;
        $professionalInfo->join_askcon = $request->JoinedSckon;
        $professionalInfo->current_address = $request->CurrentAddress;
        $professionalInfo->Sector_Area = $request->Sector_Area;
        $professionalInfo->Socity_Name = $request->Socity_Name;
        $professionalInfo->pincode = $request->Pincode;
        $professionalInfo->state_code = $request->State;
        $professionalInfo->district_code = $request->District;
        $professionalInfo->updated_by = $user->id;
        $professionalInfo->save(); // Save the changes

        // Fetch user details and update
        $userDetails = User::find($request->userId); // Use `find` for brevity
        if ($userDetails) {
            $userDetails->name = $request->name;
            $userDetails->Initiated_name = $request->Initiated_name;
            $userDetails->email = $request->email;
            $userDetails->contact_number = $request->contact_number;
            $userDetails->dob = $request->dob;
            $userDetails->m_relation_type = $request->relation_type;
            $userDetails->relative_login_id = $request->relative_login_id;
            $userDetails->save(); // Save changes to the user
        }

        return $professionalInfo;
    }

    public function SuperAdminUpdateSpritualInfoOne($request)
    {
        $user = Auth::user();
        $professionalInfo = ProfessionalInformation::where('id', $request->profileId)->first();
        if ($professionalInfo) {
            $professionalInfo->how_many_rounds_you_chant = $request['NoOfChant'];
            $professionalInfo->when_are_you_chantin = $request['ChantingStartDate'];
            $professionalInfo->spend_everyday_hearing_lectures = $request['SpendTimeHearingLecture'];
            $professionalInfo->updated_by = $user->id;
            $professionalInfo->professional_info = 'Y';
            $professionalInfo->save(); // Save changes to the database

            // Ensure the $request->RegulativePrinciples and $request->BooksRead are valid arrays of IDs
            if (!empty($request->RegulativePrinciples)) {
                // Sync the devotee principles without detaching existing relationships
                $professionalInfo->devoteePrinciples()->syncWithoutDetaching($request->RegulativePrinciples);
            }

            if (!empty($request->BooksRead)) {
                // Sync the books read without detaching existing relationships
                $professionalInfo->devoteeBookRead()->syncWithoutDetaching($request->BooksRead);
            }

            // Return the updated professional info
            return $professionalInfo;
        } else {
            // Handle case if professional information is not found
            return response()->json(['error' => 'Professional information not found'], 404);
        }
    }
    public function SuperAdminUpdateSpritualInfoTwo($request)
    {
        $user = Auth::user();
        $professionalInfo = ProfessionalInformation::where('id', $request->profileId)->first();
        if ($professionalInfo) {
            // Update the record with new data
            $professionalInfo->bakti_shastri_degree = $request['ShastriDegree'];
            $professionalInfo->updated_by = $user->id;
            $professionalInfo->hearing_reading = 'Y';

            $professionalInfo->save(); // Save changes to the database

            // Ensure the $request->RegulativePrinciples and $request->BooksRead are valid arrays of IDs
            if (!empty($request->MemorisedPrayers)) {
                // Sync the devotee principles without detaching existing relationships
                $professionalInfo->devoteeMemorisePrayer()->syncWithoutDetaching($request->MemorisedPrayers);
            }

            if (!empty($request->BooksRead)) {
                // Sync the books read without detaching existing relationships
                $professionalInfo->devoteeAttendedSeminar()->syncWithoutDetaching($request->Seminar);
            }
        } else {
            // Handle case if professional information is not found
            return response()->json(['error' => 'Professional information not found'], 404);
        }
        return $professionalInfo;
    }

    public function SuperAdminUpdateSpritualInfoThree($request)
    {
        $user = Auth::user();
        $professionalInfo = ProfessionalInformation::where('id', $request->profileId)->first();

        if ($professionalInfo) {
            // Update professional info fields
            $professionalInfo->since_when_you_attending_ashray_classes = $request['since_when_you_attending_ashray_classes'];
            $professionalInfo->spiritual_master_you_aspiring = $request['spiritual_master_you_aspiring'];
            $professionalInfo->seminar = 'Y';
            if ($professionalInfo->status_code != 'A') {
                $professionalInfo->status_code = 'S';
            }
            $professionalInfo->save();

            // Update or create Ashray Leader assignment for the user
            $leader = UserAssignAshrayLeader::updateOrCreate(
                ['user_id' => $request->userId],
                [
                    'ashray_leader_code' => $request['ashray_leader_code'],
                    'Bhakti_Bhekshuk' => $request['Bhakti_BhikshukId'] ?? 0
                ]
            );
        } else {
            return response()->json(['error' => 'Professional information not found'], 404);
        }
    }

    public function PartiallyDevoteeSuperAdminList()
    {
        $PartiallyDevoteeSuperAdminList = User::leftJoin('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->where(function ($query) {
                $query->whereNull('professional_information.user_id'); // No professional information
                //->orWhere('professional_information.status_code', 'N'); // Status code is 'N'
            })
            ->where('users.devotee_type', 'AD') // Filter by devotee type
            ->select('users.*', 'professional_information.status_code') // Optionally include status_code
            ->get()
            ->toArray();

        return [
            'PartiallyDevoteeSuperAdminList' => $PartiallyDevoteeSuperAdminList,
        ];
    }

    public function PreviewDevoteeList($userId)
    {

        // $MatchedDevoteeSuperAdminList = User::Join('professional_information', 'users.id', '=', 'professional_information.user_id')
        //     ->where('users.devotee_type', 'AD')
        //     ->where('users.id', $userId)
        //     ->select('users.*', 'professional_information.*')
        //     ->get()
        //     ->toArray();

        $MatchedDevoteeSuperAdminList = User::join('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('merital_status', 'professional_information.marital_status', '=', 'merital_status.id') // Adjust column names if necessary
            ->join('education', 'professional_information.education', '=', 'education.id')
            ->join('profession', 'professional_information.profession', '=', 'profession.id')
            ->join('state', 'professional_information.state_code', '=', 'state.id')
            ->join('district', 'professional_information.district_code', '=', 'district.id')
            ->join('user_have_ashray_leader', 'professional_information.user_id', '=', 'user_have_ashray_leader.user_id')
            ->join('ashery_leader', 'user_have_ashray_leader.ashray_leader_code', '=', 'ashery_leader.code')

            ->where('users.devotee_type', 'AD')
            ->where('users.id', $userId)
            ->where('professional_information.user_id', $userId)
            ->select(
                'users.*',
                'professional_information.*',
                'merital_status.merital_status_name as merital_status_name', // Fetch the marital status name
                'education.eduction_name as eduction_name', // Fetch the marital status name
                'profession.profession_name as profession',
                'state.state_name as state_code',
                'district.district_name as district_code',
                'ashery_leader.ashery_leader_name as ashery_leader_name',
            )
            ->get()
            ->toArray();

        $dBook = User::join('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('devotee_book', 'professional_information.id', '=', 'devotee_book.personal_info_id')
            ->join('book', 'devotee_book.book_id', '=', 'book.id')
            ->where('users.id', $userId)
            ->select(
                'book.book_name_english as book_name_english',
                'book.book_name_hindi as book_name_hindi',
            )
            ->distinct()
            ->get()
            ->toArray();

        $dPrayer = User::join('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('devotee_memorised_prayers', 'professional_information.id', '=', 'devotee_memorised_prayers.personal_info_id')
            ->join('prayer', 'devotee_memorised_prayers.prayer_id', '=', 'prayer.id')
            ->where('users.id', $userId)
            ->select(
                'prayer.prayer_name_english as prayer_name_english',
                'prayer.prayer_name_hindi as prayer_name_hindi',
            )
            ->distinct()
            ->get()
            ->toArray();

        $dPrincipal = User::join('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('devotee_principles', 'professional_information.id', '=', 'devotee_principles.personal_info_id')
            ->join('regulative_principle', 'devotee_principles.principle_id', '=', 'regulative_principle.id')
            ->where('users.id', $userId)
            ->select(
                'regulative_principle.principle_name_eglish as principle_name_eglish',
                'regulative_principle.principle_name_hindi as principle_name_hindi',
            )
            ->distinct()
            ->get()
            ->toArray();

        $dSeminar = User::join('professional_information', 'users.id', '=', 'professional_information.user_id')
            ->join('devotee_attended_seminar', 'professional_information.id', '=', 'devotee_attended_seminar.personal_info_id')
            ->join('seminar', 'devotee_attended_seminar.seminar_id', '=', 'seminar.id')

            ->where('users.id', $userId)
            ->select(
                'seminar.seminar_name_english as seminar_name_english',
                'seminar.seminar_name_hindi as seminar_name_hindi',
            )
            ->distinct()
            ->get()
            ->toArray();

        $mappedData = [
            'Dbook' => $dBook,
            'Dprayer' => $dPrayer,
            'Dprincipal' => $dPrincipal,
            'Dseminar' => $dSeminar,
        ];

        return [
            'MatchedDevoteeSuperAdminList' => $MatchedDevoteeSuperAdminList,
            ...$mappedData

        ];
    }

    public function deletepartiallydevoteelist($id)
    {
        $partiallydevoteelist = User::find($id);

        return $partiallydevoteelist->delete();
        //dd($id);
        //return false;
    }
    public function createRaiseQuery($request): RaiseQuery
    {
        $queryId = 'QRY-' . time() . '-' . rand(1000, 9999);
        return RaiseQuery::Create(
            [

                'subject' => $request['subject'],
                'description' => $request['description'],
                'from_id' => $request['from_id'],
                'to_id' => 'SuperAdmin',
                'query_id' => $queryId,
                'is_viewed' => false
            ]

        );
    }
    public function deleteDevotee($id)
    {
        $user = User::find($id);
        if ($user) {
            $professional=ProfessionalInformation::where('user_id', $id)->first();
            if($professional){
                if(DevoteeRegistraionRejected::where('profile_id', $professional->id)->exists())
                {
                    DevoteeRegistraionRejected::where('profile_id', $professional->id)->delete();
                }
                if(DevoteePrinciples::where('personal_info_id', $professional->id)->exists())
                {
                    DevoteePrinciples::where('personal_info_id', $professional->id)->delete();
                }
                if(DevoteeBookRead::where('personal_info_id', $professional->id)->exists())
                {
                    DevoteeBookRead::where('personal_info_id', $professional->id)->delete();
                }
                if(DevoteeMemoriesPrayer::where('personal_info_id', $professional->id)->exists())
                {
                    DevoteeMemoriesPrayer::where('personal_info_id', $professional->id)->delete();
                }
                if(DevoteeAttendedSeminar::where('personal_info_id', $professional->id)->exists())
                {               
                    DevoteeAttendedSeminar::where('personal_info_id', $professional->id)->delete();
                }
            }   
            
            UserAssignAshrayLeader::where('user_id', $id)->delete();
            $user->delete(); // This will soft delete if SoftDeletes trait is used, or hard delete otherwise.
            return true;
        }
        return false;
    }
}
