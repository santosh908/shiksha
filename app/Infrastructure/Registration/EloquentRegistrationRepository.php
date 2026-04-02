<?php

namespace App\Infrastructure\Registration;

use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Models\AsheryLeader;
use App\Models\Book;
use App\Models\DevoteeAttendedSeminar;
use App\Models\DevoteeBookRead;
use App\Models\DevoteeMemoriesPrayer;
use App\Models\DevoteePrinciples;
use App\Models\District;
use App\Models\Education;
use App\Models\MeritalStatus;
use App\Models\Prayer;
use App\Models\Principle;
use App\Models\Profession;
use App\Models\ProfessionalInformation;
use App\Models\Seminar;
use App\Models\State;
use App\Models\User;
use App\Models\UserAssignAshrayLeader;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EloquentRegistrationRepository implements RegistrationRepositoryInterface
{
    public function getRegistrationMasterData(): array
    {
        return [
            'Education' => Education::orderBy('eduction_name')->get(['id', 'eduction_name'])->toArray(),
            'MeritalStatus' => MeritalStatus::orderBy('merital_status_name')->get(['id', 'merital_status_name'])->toArray(),
            'Profession' => Profession::orderBy('profession_name')->get(['id', 'profession_name'])->toArray(),
            'State' => State::orderBy('state_name')->get(['lg_code', 'state_name'])->toArray(),
            'District' => District::orderBy('district_name')->get(['district_lg_code', 'district_name', 'state_code'])->toArray(),
            'Book' => Book::orderBy('book_name_english')->get(['id', 'book_name_english'])->toArray(),
            'Principle' => Principle::orderBy('principle_name_eglish')->get(['id', 'principle_name_eglish'])->toArray(),
            'Prayers' => Prayer::orderBy('prayer_name_english')->get(['id', 'prayer_name_english'])->toArray(),
            'Seminar' => Seminar::orderBy('seminar_name_english')->get(['id', 'seminar_name_english'])->toArray(),
            'AshreyLeader' => AsheryLeader::with([
                'bhaktiBhikshuks' => function ($query) {
                    $query->select('id', 'ashray_leader_code', 'bhakti_bhikshuk_name')
                        ->orderBy('bhakti_bhikshuk_name');
                }
            ])->orderBy('ashery_leader_name')->get(['id', 'code', 'ashery_leader_name'])->toArray(),
        ];
    }

    public function createCompleteRegistration(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $initiatedName = !empty($data['Initiated_name']) ? $data['Initiated_name'] : 'NA';
            $existingUser = User::where('email', $data['email'])
                ->where('contact_number', $data['contact_number'])
                ->where('devotee_type', 'AD')
                ->where(function ($q) {
                    $q->whereNull('profile_submitted')
                        ->orWhere('profile_submitted', '!=', 'Y');
                })
                ->where(function ($q) {
                    $q->whereNull('account_approved')
                        ->orWhereIn('account_approved', ['N', 'R']);
                })
                ->lockForUpdate()
                ->first();

            if ($existingUser) {
                $existingUser->update([
                    'email' => $data['email'],
                    'name' => $data['name'],
                    'Initiated_name' => $initiatedName,
                    'dob' => $data['dob'],
                    'contact_number' => $data['contact_number'],
                    'have_you_applied_before' => $data['have_you_applied_before'],
                    'devotee_type' => $data['devotee_type'],
                    'password' => Hash::make($data['password']),
                    'm_relation_type' => $data['relation_type'],
                    'relative_login_id' => $data['relation_type'] === 'relative' ? $data['relative_login_id'] : null,
                    'account_approved' => 'N',
                    'profile_submitted' => 'Y',
                ]);
                $user = $existingUser->fresh();
            } else {
                $userNo = User::where('devotee_type', 'AD')->count() + 1;
                $paddedUserNo = str_pad((string) $userNo, 3, '0', STR_PAD_LEFT);
                $user = User::create([
                    'email' => $data['email'],
                    'name' => $data['name'],
                    'Initiated_name' => $initiatedName,
                    'dob' => $data['dob'],
                    'contact_number' => $data['contact_number'],
                    'have_you_applied_before' => $data['have_you_applied_before'],
                    'devotee_type' => $data['devotee_type'],
                    'password' => Hash::make($data['password']),
                    'login_id' => $this->generateUserId($data['name'], $paddedUserNo, $data['dob']),
                    'm_relation_type' => $data['relation_type'],
                    'relative_login_id' => $data['relation_type'] === 'relative' ? $data['relative_login_id'] : null,
                    'account_approved' => 'N',
                    'profile_submitted' => 'Y',
                ]);
            }

            $professional = ProfessionalInformation::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'education' => $data['Educational'],
                    'marital_status' => $data['MaritalStatus'],
                    'profession' => $data['Profession'],
                    'spiritual_master' => $data['SpiritualMaster'],
                    'join_askcon' => $data['JoinedSckon'],
                    'current_address' => $data['CurrentAddress'],
                    'Socity_Name' => $data['Socity_Name'] ?? null,
                    'Sector_Area' => $data['Sector_Area'] ?? null,
                    'pincode' => $data['Pincode'],
                    'state_code' => $data['State'],
                    'district_code' => $data['District'],
                    'how_many_rounds_you_chant' => $data['NoOfChant'] ?? null,
                    'when_are_you_chantin' => $data['ChantingStartDate'] ?? null,
                    'spend_everyday_hearing_lectures' => $data['SpendTimeHearingLecture'] ?? null,
                    'bakti_shastri_degree' => $data['ShastriDegree'] ?? null,
                    'since_when_you_attending_ashray_classes' => $data['since_when_you_attending_ashray_classes'] ?? null,
                    'spiritual_master_you_aspiring' => $data['spiritual_master_you_aspiring'] ?? null,
                    'personal_info' => 'Y',
                    'professional_info' => 'Y',
                    'hearing_reading' => 'Y',
                    'seminar' => 'Y',
                    'status_code' => 'S',
                ]
            );

            UserAssignAshrayLeader::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'ashray_leader_code' => $data['ashray_leader_code'],
                    'Bhakti_Bhekshuk' => $data['Bhakti_BhikshukId'] ?? 0,
                    'is_active' => 'Y',
                ]
            );

            DevoteePrinciples::where('personal_info_id', $professional->id)->delete();
            foreach (($data['RegulativePrinciples'] ?? []) as $principleId) {
                DevoteePrinciples::create([
                    'personal_info_id' => $professional->id,
                    'principle_id' => $principleId,
                    'is_active' => 'Y',
                ]);
            }
            DevoteeBookRead::where('personal_info_id', $professional->id)->delete();
            foreach (($data['BooksRead'] ?? []) as $bookId) {
                DevoteeBookRead::create([
                    'personal_info_id' => $professional->id,
                    'book_id' => $bookId,
                    'is_active' => 'Y',
                ]);
            }
            DevoteeMemoriesPrayer::where('personal_info_id', $professional->id)->delete();
            foreach (($data['MemorisedPrayers'] ?? []) as $prayerId) {
                DevoteeMemoriesPrayer::create([
                    'personal_info_id' => $professional->id,
                    'prayer_id' => $prayerId,
                ]);
            }
            DevoteeAttendedSeminar::where('personal_info_id', $professional->id)->delete();
            foreach (($data['Seminar'] ?? []) as $seminarId) {
                DevoteeAttendedSeminar::create([
                    'personal_info_id' => $professional->id,
                    'seminar_id' => $seminarId,
                ]);
            }

            return $user;
        });
    }

    private function generateUserId(string $name, string $userNo, string $dob): string
    {
        $namePart = substr($name, 0, 3);
        $dobFormatted = date('dmy', strtotime($dob));
        return strtoupper($namePart . $userNo . $dobFormatted);
    }
}

