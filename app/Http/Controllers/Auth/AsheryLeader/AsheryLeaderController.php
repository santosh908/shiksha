<?php

namespace App\Http\Controllers\Auth\AsheryLeader;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\AsheryLeader\AsheryLeaderRequest;
use App\Services\AdminCatalogApplicationService;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsheryLeaderController extends Controller
{
    public function __construct(
        private readonly AdminCatalogApplicationService $adminCatalogApplicationService
    ) {
    }

    public function asheryleader()
    {
        $list = $this->adminCatalogApplicationService->listAsheryLeaders();
        return Inertia::render('SuperAdmin/asheryleader', $list);
    }

    public function asheryleaderStore(AsheryLeaderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $asheryleaderinfo = $this->adminCatalogApplicationService->createAsheryLeader($request);
        return redirect()->route('Action.AsheryLeaderStore')
            ->with('success', 'Ashery Leader Details Saved Successfully!')
            ->with('savedData', $asheryleaderinfo);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = User::findOrFail($request->id);
        // Dynamic validation rules
        $rules = [
            'email' => [
                'required',
                'email',
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
                $request->input('email') !== $user->email ? 'unique:users,email' : '',
            ],
            'contact_number' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^[1-9][0-9]{9,14}$/',
                $request->input('contact_number') !== $user->contact_number ? 'unique:users,contact_number' : '',
            ],
            'name' => 'required|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
            'is_active' => 'required',
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
        $asheryleaderinfo = $this->adminCatalogApplicationService->updateAsheryLeader($request);
        return redirect()->route('Action.asheryleader')
            ->with('success', 'Ashery Leader Details Updated Successfully!')
            ->with('savedData', $asheryleaderinfo);
    }

    public function destroy($id)
    {
        $asheryleaderinfoinfo = $this->adminCatalogApplicationService->deleteAsheryLeader($id);
        if ($asheryleaderinfoinfo) {
            return redirect()->back()->with('success', 'AsheryLeader deleted successfully');
        } else {
            return redirect()->back()->with('error', 'AsheryLeader not found or could not be deleted');
        }
    }

}
