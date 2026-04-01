<?php

namespace App\Http\Controllers\Auth\BhaktiBhikshuk;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\AsheryLeader;
use App\Services\BhaktiBhikshuk\BhaktiBhikshukService;
use App\Http\Requests\BhaktiVrikshukRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class BhaktiBhikshukController extends Controller
{
    protected $BhaktiBhikshukService;

    public function __construct()
    {
        $this->BhaktiBhikshukService = new BhaktiBhikshukService();
    }

    public function bhaktibhikshukdashboard()
    {
        return Inertia::render('BhaktiBhekshuk/dashboard');
    }

    public function bhaktibhikshuk()
    {
        $list = $this->BhaktiBhikshukService->BhaktiBhikshukList();
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
        $data = $request->validated();
        $bhaktibhikshukinfo = $this->BhaktiBhikshukService->createBhaktiBhikshuk($request);
        return redirect()->route('Action.BhaktiBhikshukStore')
            ->with('success', 'Bhakti Bhikshuk Details Saved Successfully!')
            ->with('savedData', $bhaktibhikshukinfo);
    }

    public function update(Request $request)
    {
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

        $bhaktibhikshukinfo = $this->BhaktiBhikshukService->updateBhaktiVrikshuk($request);
        return redirect()->route('Action.BhaktiBhikshukStore')
            ->with('success', 'Bhakti Bhikshuk Details Updated Successfully!')
            ->with('savedData', $bhaktibhikshukinfo);
    }

    public function destroy($id)
    {
        $bhaktiVrikshuk = $this->BhaktiBhikshukService->delete($id);
        if ($bhaktiVrikshuk) {
            return redirect()->back()->with('success', 'Bhakti Vrikshuk deleted successfully');
        } else {
            return redirect()->back()->with('error', 'Bhakti Vrikshuk not found or could not be deleted');
        }
    }
}
