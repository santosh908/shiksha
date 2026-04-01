<?php

namespace App\Services\ShikshaAppUser;
use App\Models\User;
use App\Models\Permission;
use App\Models\Role;
use App\Models\BhaktiBhekshuk;
use App\Models\AsheryLeader;
use App\Models\UserAssignAshrayLeader;
use App\Services\UserQueryHandler;
use Illuminate\Support\Facades\DB;

class ShikshaAppUserServices
{
    public function ShikshAppUserList()
    {
        // return User::whereIn('devotee_type', ['SA', 'AL', 'CA', 'BB'])
        //     ->get()
        //     ->toArray();

        $query = User::join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftjoin('bhakti_bhekshuk', 'bhakti_bhekshuk.user_id', '=', 'users.id')
            ->leftjoin('ashery_leader', 'bhakti_bhekshuk.ashray_leader_code', '=', 'ashery_leader.code')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role_name', 'ashery_leader.ashery_leader_name','ashery_leader.code as code')
            ->where('roles.id', '!=', 1) // Exclude Devotee role
            //->with(['permissions', 'roles'])
            ->get();

        $query->each(function ($user) {
            $user->permissions = $user->permissions->pluck('id')->toArray();
        });

        return $query->toArray();
    }

    public function createShikshAppUser($request)
    {
        $devoteeType = match ($request['role_name']) {
            'AsheryLeader' => 'AL',
            'BhaktiVriksha' => 'BB',
            'CoOrdinator' => 'CA',
            'SuperAdmin' => 'SA',
            'Admin' => 'AU',
        };

       $existing = User::where('email', $request['email'])->first();
        if ($existing) {
            $existing->name = $request['name'];
            $existing->Initiated_name = $request['Initiated_name'];
              $existing->dob = $request['dob'];
            if (!empty($request['contact_number'])) {
                $existing->contact_number = $request['contact_number'];
            }
            $existing->save();
            $crUser = $existing;
        } else {
            $userNo = User::where('devotee_type', 'AD')->count() + 1; // Increment by 1 for the next user number
            $paddedUserNo = str_pad($userNo, 3, '0', STR_PAD_LEFT); // Pad the user number to be 3 digits
            $crUser = User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'Initiated_name' => $request['Initiated_name'],
                'dob' => $request['dob'],
                'contact_number' => $request['contact_number'],
                'have_you_applied_before' => 'N',
                'email_verified_at' => now(),
                'account_approved' => 'Y',
                'profile_submitted' => 'Y',
                'devotee_type' => $devoteeType,
                'login_id' => $this->generateUserId($request['name'],$paddedUserNo,$request['dob']), 
                'password' => bcrypt($request['email']),
            ]);
        }

        $crUser->assignRole($request['role_name']);

        // Assign permissions if provided in the request
        if ($request->has('permissions')) {
            $crUser->permissions()->attach($request['permissions']);
        }

        if ($request['role_name'] === 'AsheryLeader') {
            $AshrayCode = AsheryLeader::orderBy('code', 'desc')->value('code'); // Fetch the latest code directly

            $AshrayLeaderMaster = AsheryLeader::create([
                'ashery_leader_name' => $request['Initiated_name'],
                'code' => ($AshrayCode + 1),
                'user_id' => $crUser->id,
                'is_active' => 'Y',
            ]);
        } elseif ($request['role_name'] === 'BhaktiVriksha') {
             $crUser->assignRole("Devotee");
            BhaktiBhekshuk::create([
                'bhakti_bhikshuk_name' => $request['Initiated_name'],
                'ashray_leader_code' => $request['code'],
                'user_id' => $crUser->id,
                'is_active' => 'Y',
            ]);
        }

        return $crUser;
    }

    public function getPermissionList()
    {
        $permissions = Permission::all()->toArray();

        return $permissions;
    }

    public function generateUserId($name,$userNo, $dob)
    {
       // Extract the first 3 characters of the name
       $namePart = substr($name, 0, 3);
       // Convert the DOB to the ddmmyy format (no special characters)
       $dobFormatted = date('dmy', strtotime($dob)); // Format: ddmmyy
       // Concatenate parts to form the unique ID
       return strtoupper($namePart . $userNo.$dobFormatted);
    }

    public function getRoleList()
    {
        $role = Role::all()->toArray();

        return $role;
    }

    public function updateShikshAppUser($request)
    {
       // dd($request->all());
        $user = User::where('id', $request->id)->first();

        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->Initiated_name = $request['Initiated_name'];
        $user->dob = $request['dob'];
        $user->contact_number = $request['contact_number'];
        $user->save();

        // Update permissions
        if ($request->has('permissions')) {
            $user->permissions()->sync($request['permissions']); // Sync permissions
        }

        // Check user role to determine which model to update
        if ($user->hasRole('AsheryLeader')) {
            $asheryleader = AsheryLeader::where('user_id', $request->id)->first();
            if ($asheryleader) {
                $asheryleader->ashery_leader_name =  $request['Initiated_name'];
                $asheryleader->save();
            }
        } elseif ($user->hasRole('BhaktiVriksha')) {
            $bhaktibhikshu = BhaktiBhekshuk::where('user_id', $request->id)->first();
            if ($bhaktibhikshu) {
                $bhaktibhikshu->bhakti_bhikshuk_name =  $request['Initiated_name'];
                $bhaktibhikshu->ashray_leader_code = $request['code'];
                $bhaktibhikshu->save();

                UserAssignAshrayLeader::where('Bhakti_Bhekshuk', $bhaktibhikshu->id)
                    ->update(['ashray_leader_code' => $request['code']]);
            }
        }

        $query = User::where('id', $request->id)
            ->with(['permissions', 'roles'])
            ->get();

        $query->each(function ($user) {
            $user->permissions = $user->permissions->pluck('id')->toArray();
        });

        return $query->toArray();
    }


    public function deleteShikshAppUser($id)
    {
        // Delete Bhakti Vrikshuk
        $Vrikshuk = BhaktiBhekshuk::where('user_id', $id)->first();
        if ($Vrikshuk) {
            $userId = $Vrikshuk->user_id;
            User::destroy($userId);
            $Vrikshuk->delete();
        }

        // Delete Ashery Leader
        $asheryleader = AsheryLeader::where('user_id', $id)->first();
        if ($asheryleader) {
            $userId = $asheryleader->user_id;
            User::destroy($userId);
            $asheryleader->delete();
        }

        // Delete Admin User
        $Adminuser = User::find($id);
        if ($Adminuser) {
            $Adminuser->delete();
        }

        return response()->json(['message' => 'User deleted successfully']);
    }
}
