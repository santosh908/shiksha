<?php

namespace App\Services\BhaktiBhikshuk;

use App\Models\AsheryLeader;
use App\Models\BhaktiBhekshuk;
use App\Models\User;
use App\Support\Auth\UserEffectivePermissionsCache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class BhaktiBhikshukService
{
    public function createBhaktiBhikshuk($request)
    {
        // If user exists by email, update name and Initiated_name (and contact if provided)
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
                'login_id' => $request['email'],
                'password' => bcrypt($request['email']),
            ]);
        }

        // Ensure role is assigned
        if (method_exists($crUser, 'hasRole')) {
            if (!$crUser->hasRole('BhaktiVriksha')) {
                $crUser->assignRole('BhaktiVriksha');
            }
        } else {
            // fallback: try to assign role
            try {
                $crUser->assignRole('BhaktiVriksha');
            } catch (\Throwable $e) {
                // ignore if roles not setup
            }
        }

        // Create or update BhaktiBhekshuk master record
        BhaktiBhekshuk::updateOrCreate(
            ['user_id' => $crUser->id],
            [
                'bhakti_bhikshuk_name' => $request['Initiated_name'],
                'ashray_leader_code' => $request['code'],
                'is_active' => $request->is_active ?? 'Y',
            ]
        );

        UserEffectivePermissionsCache::forget($crUser->id);

        return $crUser;
    }

    function updateBhaktiVrikshuk($request)
    {
        $user = User::where('id', $request->id)->first();
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->Initiated_name = $request['Initiated_name'];
        $user->dob = $request['dob'];
        $user->contact_number = $request['contact_number'];
        $user->save();

        $baktiVrikshuk = BhaktiBhekshuk::where('user_id', $request->id)->first();
        if (!$baktiVrikshuk) {
            return response()->json(['message' => 'Bhakti Vriksha Leader not found'], 404);
        } else {
            $baktiVrikshuk->bhakti_bhikshuk_name = $request['Initiated_name'];
            $baktiVrikshuk->ashray_leader_code = $request['code'];
            $baktiVrikshuk->is_active = $request['is_active'];
            if (isset($request['updated_by_actor_id']) && Schema::hasColumn('bhakti_bhekshuk', 'updated_by')) {
                $baktiVrikshuk->updated_by = $request['updated_by_actor_id'];
            }
            $baktiVrikshuk->save();
        }
        return $baktiVrikshuk;
    }

    public function delete($id)
    {
        // Find the AsheryLeader record by ID
        $Vrikshuk = BhaktiBhekshuk::where('user_id', $id)->first();
        if (!$Vrikshuk) {
            return response()->json(['message' => 'Bhakti Vrikshuk not found'], 404);
        }
        // Get the associated user_id
        $userId = $Vrikshuk->user_id;
        // Delete the user record from the users table
        User::destroy($userId);
        // Delete the AsheryLeader record
        $Vrikshuk->delete();
        return $Vrikshuk;
    }

    public function BhaktiBhikshukList()
    {
        $user = Auth::user();

       
        $query = User::join('bhakti_bhekshuk', 'users.id', '=', 'bhakti_bhekshuk.user_id')
            ->join('ashery_leader', 'ashery_leader.code', '=', 'bhakti_bhekshuk.ashray_leader_code');

        switch ($user->devotee_type) {
            case "AL":
                $asheryLeader = AsheryLeader::where('user_id', $user->id)->first();
                if ($asheryLeader) {
                    $query->where('bhakti_bhekshuk.ashray_leader_code', '=', $asheryLeader->code);
                }
                break;

            case "BL":

                break;
        }

        return $query->select(
            'users.*',
            'ashery_leader.code as code',
            'ashery_leader.ashery_leader_name',
            'bhakti_bhekshuk.is_active',
            'bhakti_bhekshuk.id as bhakti_bhekshuk_code'
        )
            ->orderBy('ashery_leader.ashery_leader_name')
            ->get()
            ->toArray();
    }
}
