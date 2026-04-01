<?php

namespace App\Http\Controllers\Auth\ShikshaAppUser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\ShikshaAppUser\ShikshaAppUserRequest;
use App\Http\Requests\UserRegistrationRequest;
use App\Services\ShikshaAppUser\ShikshaAppUserServices;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use App\Models\Permission;
use App\Models\AsheryLeader;

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
        $roleList = Role::all();
        $permissionList = Permission::all();
        $asheryleader = AsheryLeader::orderBy('ashery_leader_name', 'asc')->get();
        //dd($adminUserList);

        return Inertia::render('SuperAdmin/shikshappuser', [
            'AdminUser' => ['ShikshAppUserList' => $adminUserList],
            'roleList' => $roleList,
            'premissionList' => $permissionList,
            'AsheryLeader' => $asheryleader,
        ]);

    }

    public function shikshappuserStore(UserRegistrationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $shikhaappuserinfo = $this->ShikshaAppUserServices->createShikshAppUser($request);
        //dd($shikhaappuserinfo);
        return redirect()->route('SuperAdmin.ShikshAppUserStore')
            ->with('success', 'Details Saved Successfully!')
            ->with('savedData', $shikhaappuserinfo);
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

        ];
        $shikhaappuserinfo = $this->ShikshaAppUserServices->updateShikshAppUser($request);
        return redirect()->route('SuperAdmin.shikshappuser')
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
