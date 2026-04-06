<?php

namespace App\Http\Controllers\Auth;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoOneData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoThreeData;
use App\Application\DevoteeProfileAdmin\DTOs\UpdateSpiritualInfoTwoData;
use App\Http\Requests\Devotee\StoreCompleteRegistraionRequest;
use App\Http\Requests\Devotee\StoreSuperAdminDevoteeRegisration;
use App\Http\Requests\Devotee\StoreProfessionalInfo;
use App\Http\Requests\Devotee\StoreHearingReading;
use App\Http\Requests\Devotee\StoreDevoteeSeminar;
use App\Services\DevoteeApprovalService;
use App\Services\DevoteeProfileAdminApplicationService;
use App\Services\PostRegistraion\PostRegistraionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\DevoteeRegistrationCompletedJob;
use App\Jobs\DevoteeApprovedJob;
use App\Jobs\DevoteeRejectedJob;
use Illuminate\Support\Facades\Auth;
use App\Models\ProfessionalInformation;
use App\Models\RaiseQuery\RaiseQuery;
use App\Http\Requests\DevoteeRaiseQuery\RaiseQueryRequest;
use App\Http\Requests\DevoteeRaiseQuery\Devoteeraisequeryrequest;
use Carbon\Carbon;

class PostRegistrationUserController extends Controller
{
    protected $postRegistrationService;
    protected $devoteeApprovalService;
    public function __construct(
        PostRegistraionService $postRegistrationService,
        DevoteeApprovalService $devoteeApprovalService,
        private readonly DevoteeProfileAdminApplicationService $devoteeProfileAdminApplicationService
    )
    {
        $this->postRegistrationService = $postRegistrationService;
        $this->devoteeApprovalService = $devoteeApprovalService;
    }
    /**
     * Store a newly created resource in storage.
     */
    public function storePersonalInfo(StoreCompleteRegistraionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $personalinfo = $this->postRegistrationService->SavePersonalInfo($request);

        session()->put('notification', "Personal Information has been saved successfully!");
        return redirect()->back()->with('success', 'Personal Information has been saved successfully!');
    }

    public function StoreProfessionalInfo(StoreProfessionalInfo $request): RedirectResponse
    {
        $perInfo = $request->validated();
        $Professional = $this->postRegistrationService->SaveProfessionalInfo($request);
        session()->put('notification', "Spritual Information 1 has been saved successfully!");
        return redirect()->back()->with('success', 'Spritual Information 1 has been saved successfully!');
    }

    public function StoreHearingReading(StoreHearingReading $request)
    {
        $hr = $request->validated();
        $hearingReading = $this->postRegistrationService->SaveHearingReading($request);
        session()->put('notification', "Spritual Information 2 has been saved successfully!");
        return redirect()->back()->with('success', 'Spritual Information 2 has been saved successfully!');
    }

    public function StoreDevoteeSeminar(StoreDevoteeSeminar $request): RedirectResponse
    {
        //dd($request );
        $hr = $request->validated();
        $user = Auth::user();
        $professionalInfo = ProfessionalInformation::where('user_id', $user->id)->first();
        if ($professionalInfo->status_code == 'N') {
            $hearingReading = $this->postRegistrationService->SaveDevoteeSeminar($request);
            $EmailID = Auth::user()->email;
            $sendEmail = dispatch(new DevoteeRegistrationCompletedJob(["email" => $EmailID]));
            session()->put('notification', "Your registration request has been successfully submitted to your Ashray Leader!");
            return redirect()->back()->with('success', 'Your registration request has been successfully submitted to your Ashray Leader!');
        } else {
            $hearingReading = $this->postRegistrationService->SaveDevoteeSeminar($request);
            session()->put('notification', "Except Ashray Leader details has been successfully updated!");
            return redirect()->back()->with('success', 'Except Ashray Leader details has been successfully updated!');
        }
    }

    public function GetRegistrationRequest()
    {
        $RegistrationRequestList = $this->postRegistrationService->GetDevoteeRegistrationList();
        //return Inertia::render('AsheryLeader/devoteeRegistrationList', $RegistrationRequestList);
        return Inertia::render('AsheryLeader/devoteeRegistrationList', ['devotees' => $RegistrationRequestList['RegistrationRequest']]);
    }

    public function AshrayLeaderGetBhaktiBhikshukList()
    {
        $devoteeList = $this->postRegistrationService->AshrayLeaderGetBhaktiBhikshukDevoteeList();
        return Inertia::render('AsheryLeader/bhaktibhikshukDevoteeList', $devoteeList);
    }

    public function getBhaktiBhikshukList()
    {
        $devoteeList = $this->postRegistrationService->GetBhaktiBhikshukDevoteeList();
        return Inertia::render('AsheryLeader/bhaktibhikshukDevoteeList', $devoteeList);
    }

    public function GetSuperAdminDevoteeList(Request $request)
    {
        if ($request->boolean('export')) {
            $rows = $this->postRegistrationService->DevoteeSuperAdminListForExport();

            return response()->streamDownload(function () use ($rows) {
                $output = fopen('php://output', 'w');
                fputcsv($output, [
                    'Login ID',
                    'Name',
                    'Initiated Name',
                    'Email',
                    'Contact Number',
                    'DOB',
                    'Submitted Date',
                    'Status',
                    'Ashray Leader',
                    'Bhakti Vriksha Leader',
                ]);

                foreach ($rows as $row) {
                    $statusCode = strtoupper((string) ($row['status_code'] ?? 'P'));
                    if (in_array($statusCode, ['N', 'S'], true)) {
                        $statusCode = 'P';
                    }
                    $statusLabel = match ($statusCode) {
                        'A' => 'Approved',
                        'R' => 'Rejected',
                        'D' => 'Deleted',
                        'S' => 'Submitted',
                        default => 'Partially Submitted',
                    };

                    $dobIst = !empty($row['dob'])
                        ? Carbon::parse($row['dob'])->timezone('Asia/Kolkata')->format('d/m/Y')
                        : '';
                    $submittedIst = !empty($row['created_at'])
                        ? Carbon::parse($row['created_at'])->timezone('Asia/Kolkata')->format('d/m/Y h:i A')
                        : '';

                    fputcsv($output, [
                        $row['login_id'] ?? '',
                        $row['name'] ?? '',
                        $row['Initiated_name'] ?? '',
                        $row['email'] ?? '',
                        $row['contact_number'] ?? '',
                        $dobIst,
                        $submittedIst,
                        $statusLabel,
                        $row['ashray_leader_initiated_name'] ?? ($row['ashery_leader_name'] ?? ''),
                        $row['bhakti_leader_initiated_name'] ?? ($row['bhakti_bhikshuk_name'] ?? ''),
                    ]);
                }
                fclose($output);
            }, 'devotee-list.csv', [
                'Content-Type' => 'text/csv; charset=UTF-8',
            ]);
        }

        $DevoteeList = $this->devoteeApprovalService->getSuperAdminDevoteeList();
        //return Inertia::render('SuperAdmin/DevoteeList', $DevoteeList); 
        return Inertia::render('SuperAdmin/DevoteeList', ['devotees' => $DevoteeList['RegistrationRequest']]);
    }

    public function SuperAdminGetBhaktiBhikshukDevoteeList()
    {
        $DevoteeList = $this->postRegistrationService->SuperAdminGetBhaktiBhikshukDevoteeList();
        return Inertia::render('SuperAdmin/BhaktiBhikshukDevoteeList', $DevoteeList);
    }
    public function ApproveDevotee($id)
    {
        $decodedId = base64_decode($id);
        $updateStatus = $this->devoteeApprovalService->approveDevotee((int) $decodedId);
        $email = $this->devoteeApprovalService->getEmailByProfessionalId((int) $decodedId);
        if ($email) {
            $sendEmail = dispatch(new DevoteeApprovedJob(["email" => $email]));
        }
        return redirect()->back()->with('success', 'Devotee has been approved!');
    }

    public function ApproveBulkDevotee($devoteeList)
    {
        $decodedId = base64_decode($devoteeList);
        $devoteeIds = explode(',', $decodedId);

        foreach ($devoteeIds as $devoteeId) {
            $updateStatus = $this->postRegistrationService->ApproveDevoteeByLeader($devoteeId);

            // Get email and dispatch job for each devotee
            $email = $this->postRegistrationService->getEmailByProfessionalId($devoteeId);
            if ($email) {
                dispatch(new DevoteeApprovedJob(["email" => $email]));
            }
        }

        return redirect()->back()->with('success', count($devoteeIds) > 1
            ? 'Multiple devotees have been approved!'
            : 'Devotee has been approved!');
    }

    public function RejectDevotee(Request $request, $id)
    {
        $decodedId = base64_decode($id);
        $updateStatus = $this->devoteeApprovalService->rejectDevotee((string) $request['remarks'], (int) $decodedId);
        $email = $this->devoteeApprovalService->getEmailByProfessionalId((int) $decodedId);
        if ($email) {
            $sendEmail = dispatch(new DevoteeRejectedJob(["email" => $email]));
        }
        return redirect()->back()->with('success', 'Devotee has been rejected!');
    }

    public function RejectBulkDevotee(Request $request, $id)
    {
        $decodedId = base64_decode($id);
        $devoteeIds = explode(',', $decodedId);
        $updatedCount = 0;

        foreach ($devoteeIds as $devoteeId) {
            $updateStatus = $this->postRegistrationService->RejectedDevotee($request['remarks'], $devoteeId);
            if ($updateStatus) {
                $updatedCount++;
            }

            // Get email and dispatch job for each devotee
            $email = $this->postRegistrationService->getEmailByProfessionalId($devoteeId);
            if ($email) {
                dispatch(new DevoteeRejectedJob(["email" => $email]));
            }
        }

        if ($updatedCount === 0) {
            return redirect()->back()->with('error', 'No devotee status was updated. Please refresh and try again.');
        }

        return redirect()->back()->with('success', $updatedCount > 1
            ? 'Multiple devotees have been rejected!'
            : 'Devotee has been rejected!');
    }

    public function SuperAdminGetDevoteeDetails($id)
    {
        $decodedId = base64_decode($id);
        $masterData = $this->devoteeProfileAdminApplicationService->getDevoteeDetails((int) $decodedId);
        return Inertia::render('SuperAdmin/DevoteeRegisrationPage', [
            'masterData' => $masterData,
        ]);
    }

    public function SuperAdminGetPartiallDevoteeDetails($id)
    {
        $decodedId = base64_decode($id);
        $masterData = $this->devoteeProfileAdminApplicationService->getPartialDevoteeDetails((int) $decodedId);
        //dd($masterData);
        return Inertia::render('SuperAdmin/DevoteeRegisrationPage', [
            'masterData' => $masterData,
        ]);
    }

    public function SuperAdminUpdatePersonalInfo(StoreSuperAdminDevoteeRegisration $request)
    {
        $dto = UpdatePersonalInfoData::fromArray($request->all());
        $this->devoteeProfileAdminApplicationService->updatePersonalInfo($dto);
        session()->put('notification', "Personal Information has been updated successfully!");
        return redirect()->back()->with('success', 'Personal Information has been updated successfully!');
    }

    public function SuperAdminUpdateSpritualInfoOne(StoreProfessionalInfo $request)
    {
        $payload = array_merge($request->validated(), [
            'profileId' => $request->input('profileId'),
            'userId' => $request->input('userId'),
        ]);
        $dto = UpdateSpiritualInfoOneData::fromArray($payload);
        $this->devoteeProfileAdminApplicationService->updateSpiritualInfoOne($dto);
        session()->put('notification', "Spritual Information 1 has been updated successfully!");
        return redirect()->back()->with('success', 'Spritual Information 1 has been updated successfully!');
    }

    public function SuperAdminUpdateSpritualInfoTwo(StoreHearingReading $request)
    {
        $payload = array_merge($request->validated(), [
            'profileId' => $request->input('profileId'),
        ]);
        $dto = UpdateSpiritualInfoTwoData::fromArray($payload);
        $this->devoteeProfileAdminApplicationService->updateSpiritualInfoTwo($dto);
        session()->put('notification', "Spritual Information 2 has been updated successfully!");
        return redirect()->back()->with('success', 'Spritual Information 2 has been updated successfully!');
    }

    public function SuperAdminUpdateSpritualInfoThree(StoreDevoteeSeminar $request)
    {
        $payload = array_merge($request->validated(), [
            'profileId' => $request->input('profileId'),
            'userId' => $request->input('userId'),
            'Bhakti_BhikshukId' => $request->input('Bhakti_BhikshukId'),
        ]);
        $dto = UpdateSpiritualInfoThreeData::fromArray($payload);
        $this->devoteeProfileAdminApplicationService->updateSpiritualInfoThree($dto);
        session()->put('notification', "Spritual Information 3 has been updated successfully!");
        return redirect()->back()->with('success', 'Spritual Information 3 has been updated successfully!');
    }

    public function GetPartiallyDevoteeList()
    {
        $DevoteeList = $this->postRegistrationService->PartiallyDevoteeSuperAdminList();
        // dd($DevoteeList);
        return Inertia::render('SuperAdmin/partiallyfilledList', $DevoteeList);
    }
    public function DeletePartiallyDevotee($id)
    {
        $deletepartiallydevoteelistinfo = $this->postRegistrationService->deletepartiallydevoteelist($id);

        if ($deletepartiallydevoteelistinfo) {
            return redirect()->back()->with('success', 'Partially Devotee deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Partially Devotee not found or could not be deleted');
        }
    }
    public function GetPreviewData()
    {
        $userId = Auth::id();
        if (!$userId) {
            // Handle the case when no user is logged in (optional)
            return redirect()->route('login')->with('error', 'Please log in first.');
        }
        $PreviewList = $this->postRegistrationService->PreviewDevoteeList($userId);
        //dd($PreviewList);
        return Inertia::render('Devotee/Preview', $PreviewList);
    }
    public function DevoteeRaiseQueryStore(RaiseQueryRequest $request)
    {
        //dd($request);

        $data = $request->validated();

        $raisequeryinfo = $this->postRegistrationService->createRaiseQuery($request);

        return redirect()->route('Devotee.RaiseQuerySuccess')
            ->with('success', 'Raise Query Submitted Successfully!')
            ->with('savedData', $raisequeryinfo);
    }
    public function DevoteeRaiseQuery(Devoteeraisequeryrequest $request)
    {
        //dd($request);
        $raisequeryinfo = $this->postRegistrationService->createRaiseQuery($request);

        return redirect()->back()->with('message', 'Query raised successfully');
    }

    // Add method to get all queries for a devotee
    public function getDevoteeQueries(Request $request)
    {
        dd($request);
        $queries = RaiseQuery::where('from_id', $request->user()->login_id)
            ->orWhere('to_id', $request->user()->login_id)
            ->orderBy('created_at', 'desc')
            ->with(['fromUser', 'toUser'])
            ->get();

        return Inertia::render('Devotee/Queries', [
            'queries' => $queries
        ]);
    }
    public function deleteDevotee($id)
    {
        $result = $this->postRegistrationService->deleteDevotee($id);
        if ($result) {
            return redirect()->back()->with('success', 'Devotee has been deleted successfully!');
        }
        return redirect()->back()->with('error', 'Failed to delete devotee.');
    }
}
