<?php

namespace App\Http\Controllers\Auth\ShikshaAppUser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\UserRegistrationRequest;
use App\Services\ShikshaAppUser\ShikshaAppUserServices;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\models\Permission;
use App\Models\AsheryLeader;
use App\Models\Role;
use App\Http\Requests\AllUserRequest\AllUserRequest;

class ShikshaAppUserController extends Controller
{
    protected $ShikshaAppUserServices;

    public function __construct()
    {
        $this->ShikshaAppUserServices = new ShikshaAppUserServices();
    }

    public function shikshappuser()
    {
        $adminUserList = $this->ShikshaAppUserServices->ShikshAppUserList();
        $permissionList = $this->ShikshaAppUserServices->getPermissionList();
        // $permissionList = Permission::all();
        $roleList = Role::whereNotIn('name', ['Devotee', 'CoOrdinator'])->get();
        $asheryleader = AsheryLeader::orderBy('ashery_leader_name', 'asc')->get();
        $list = Inertia::render('SuperAdmin/shikshappuser', [
            'AdminUserList' => $adminUserList,
            'Permission' => $permissionList,
            'roleList' => $roleList,
            'AsheryLeader' => $asheryleader,
        ]);
        return $list;
    }

    public function shikshappuserStore(AllUserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $shikhaappuserinfo = $this->ShikshaAppUserServices->createShikshAppUser($request);
        return redirect()->route('Action.ShikshAppUserStore')
            ->with('success', 'Details Saved Successfully!')
            ->with('savedData', $shikhaappuserinfo);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = User::findOrFail($request->id);

        $rules = [
            'email' => [
                'required',
                'email',
                'regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            ],
            'contact_number' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^[1-9][0-9]{9,14}$/',
            ],
            'name' => 'required|string|max:255',
            'dob'  => 'required|date|before:today|after_or_equal:1900-01-01',
        ];

        // Add unique rules only if values changed
        if ($request->input('email') !== $user->email) {
            $rules['email'][] = 'unique:users,email';
        }

        if ($request->input('contact_number') !== $user->contact_number) {
            $rules['contact_number'][] = 'unique:users,contact_number';
        }

        // ✅ Validate request
        $validated = $request->validate($rules);

        // Update service withd validated data
        $shikhaappuserinfo = $this->ShikshaAppUserServices->updateShikshAppUser($request);

        return redirect()->route('Action.shikshappuser')
            ->with('success', 'Details Updated Successfully!')
            ->with('savedData', $shikhaappuserinfo);
    }

    public function destroy($id)
    {
        $shikhaappuserinfo = $this->ShikshaAppUserServices->deleteShikshAppUser($id);

        if ($shikhaappuserinfo) {
            return redirect()->back()->with('success', 'deleted successfully');
        } else {
            return redirect()->back()->with('error', 'AsheryLeader not found or could not be deleted');
        }
    }
}
