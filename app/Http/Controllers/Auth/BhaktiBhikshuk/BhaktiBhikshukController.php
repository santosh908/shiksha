<?php

namespace App\Http\Controllers\Auth\BhaktiBhikshuk;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\AsheryLeader;
use App\Services\BhaktiBhikshukApplicationService;
use App\Http\Requests\BhaktiVrikshukRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use App\Models\BhaktiBhekshuk;
use App\Services\BhaktiBhikshukDashboard\BhaktiBhikshukDashboardService;

class BhaktiBhikshukController extends Controller
{
    public function __construct(
        private readonly BhaktiBhikshukApplicationService $bhaktiBhikshukApplicationService,
        private readonly BhaktiBhikshukDashboardService $bhaktiBhikshukDashboardService
    ) {
    }

    public function bhaktibhikshukdashboard()
    {
        $user = Auth::user();
        $counts = $this->bhaktiBhikshukDashboardService->getScopedCountsByUserId((int) ($user->id ?? 0));

        return Inertia::render('BhaktiBhekshuk/dashboard', [
            'userName' => $user->name ?? 'BhaktiBhikshuk',
            'assignedDevoteeCount' => $counts['assignedDevoteeCount'] ?? 0,
            'approvedCount' => $counts['approvedCount'] ?? 0,
            'rejectedCount' => $counts['rejectedCount'] ?? 0,
            'pendingCount' => $counts['pendingCount'] ?? 0,
        ]);
    }

    public function bhaktibhikshuk()
    {
        $list = $this->bhaktiBhikshukApplicationService->list();
        $user = Auth::user();
        if($user->devotee_type=="AL")
        {
            $asheryleader = AsheryLeader::where("ashery_leader.user_id",$user->id)->orderBy('ashery_leader_name', 'asc')->get();
        }
        else{
            $asheryleader = AsheryLeader::orderBy('ashery_leader_name', 'asc')->get();
        }
        return Inertia::render('SuperAdmin/bhaktibhikshuk', [
            'BhaktiBhikshukList' => $list,
            'AsheryLeader' => $asheryleader,
        ]);
    }

    public function bhaktibhikshukStore(BhaktiVrikshukRequest $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user && $user->devotee_type === "AL") {
            $leader = AsheryLeader::where('user_id', $user->id)->first();
            if (! $leader) {
                return redirect()->back()->with('error', 'Ashray Leader mapping not found.');
            }
            // Force AL to create only under own leader code.
            $request->merge(['code' => $leader->code]);
        }

        $bhaktibhikshukinfo = $this->bhaktiBhikshukApplicationService->create($request);
        return redirect()->route('Action.BhaktiBhikshukStore')
            ->with('success', 'Bhakti Bhikshuk Details Saved Successfully!')
            ->with('savedData', $bhaktibhikshukinfo);
    }

    public function update(Request $request)
    {
        $authUser = Auth::user();
        $bhaktiVrikshuk = BhaktiBhekshuk::where('user_id', $request->id)->first();
        if (! $bhaktiVrikshuk) {
            return redirect()->back()->with('error', 'Bhakti Vrikshuk not found.');
        }

        if ($authUser && $authUser->devotee_type === "AL") {
            $leader = AsheryLeader::where('user_id', $authUser->id)->first();
            if (! $leader) {
                return redirect()->back()->with('error', 'Ashray Leader mapping not found.');
            }

            // Block AL from updating records outside their own assignment.
            if ((string) $bhaktiVrikshuk->ashray_leader_code !== (string) $leader->code) {
                if (Schema::hasColumn('bhakti_bhekshuk', 'rejected_by')) {
                    $bhaktiVrikshuk->rejected_by = $authUser->id;
                    $bhaktiVrikshuk->save();
                }
                return redirect()->back()->with('error', 'Update rejected: this record is not assigned to you.');
            }

            // Prevent AL from reassigning to another leader by payload tampering.
            $request->merge(['code' => $leader->code, 'updated_by_actor_id' => $authUser->id]);
        }

        $user = User::findOrFail($request->id);
        // Dynamic validation rules
        $rules = [
            'email' => [
                'required',
                'email',
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
                // Add unique rule only if the email has changed
                $request->input('email') !== $user->email ? 'unique:users,email' : '',
            ],
            'contact_number' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^[1-9][0-9]{9,14}$/',
                // Add unique rule only if the contact number has changed
                $request->input('contact_number') !== $user->contact_number ? 'unique:users,contact_number' : '',
            ],
            'name' => 'required|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            'is_active' => 'required',
            'code' => 'required|string|max:255',
        ];

        // Filter out empty rules
        foreach ($rules as $field => &$fieldRules) {
            if (is_array($fieldRules)) {
                $fieldRules = array_filter($fieldRules); // Remove empty strings
            }
        }

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        // Handle validation failures
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $bhaktibhikshukinfo = $this->bhaktiBhikshukApplicationService->update($request);
        return redirect()->route('Action.BhaktiBhikshukStore')
            ->with('success', 'Bhakti Bhikshuk Details Updated Successfully!')
            ->with('savedData', $bhaktibhikshukinfo);
    }

    public function destroy($id)
    {
        $authUser = Auth::user();
        $bhaktiVrikshuk = BhaktiBhekshuk::where('user_id', $id)->first();
        if (! $bhaktiVrikshuk) {
            return redirect()->back()->with('error', 'Bhakti Vrikshuk not found or could not be deleted');
        }

        if ($authUser && $authUser->devotee_type === "AL") {
            $leader = AsheryLeader::where('user_id', $authUser->id)->first();
            if (! $leader) {
                return redirect()->back()->with('error', 'Ashray Leader mapping not found.');
            }

            if ((string) $bhaktiVrikshuk->ashray_leader_code !== (string) $leader->code) {
                if (Schema::hasColumn('bhakti_bhekshuk', 'rejected_by')) {
                    $bhaktiVrikshuk->rejected_by = $authUser->id;
                    $bhaktiVrikshuk->save();
                }
                return redirect()->back()->with('error', 'Delete rejected: this record is not assigned to you.');
            }
        }

        $bhaktiVrikshuk = $this->bhaktiBhikshukApplicationService->delete($id);
        if ($bhaktiVrikshuk) {
            return redirect()->back()->with('success', 'Bhakti Vrikshuk deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Bhakti Vrikshuk not found or could not be deleted');
        }
    }
}
