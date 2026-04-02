<?php

namespace App\Services\AshreyLeader;

use App\Models\AsheryLeader;
use App\Models\User;
use App\Support\Auth\UserEffectivePermissionsCache;
class AshreyLeadeServices
{
   public function createAsheryLeader($request)
   {
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
                'devotee_type' => 'AL',
                'login_id' => $request['email'],
                'password' => bcrypt($request['email']),
            ]);
        }

      $crUser->assignRole('AsheryLeader');
      UserEffectivePermissionsCache::forget($crUser->id);

      // Check if user already has an AsheryLeader record
      $asheryLeader = AsheryLeader::where('user_id', $crUser->id)->first();
      if ($asheryLeader) {
         // Update existing AsheryLeader
         $asheryLeader->ashery_leader_name = $request['Initiated_name'];
         $asheryLeader->is_active = 'Y';
         $asheryLeader->save();
      } else {
         // Create new AsheryLeader
         $AshrayCode = AsheryLeader::orderBy('code', 'desc')
            ->skip(1)
            ->take(1)
            ->value('code'); 
         AsheryLeader::create([
            'ashery_leader_name' => $request['Initiated_name'],
            'code' => ($AshrayCode + 1),
            'user_id' => $crUser->id,
            'is_active' => 'Y',
         ]);
      }
      return $crUser;
   }

   public function AsheryLeaderList()
   {
      $AsheryLeaderList = [
         'AsheryLeaderList' => User::join('ashery_leader', 'ashery_leader.user_id', 'users.id')
            ->select('users.*', 'ashery_leader.is_active', 'ashery_leader.code as ashery_leader_code')
            ->orderBy('ashery_leader_code', 'asc')
            ->get()
            ->toArray()
      ];

      return $AsheryLeaderList;
   }

   public function updateAsheryLeader($request): AsheryLeader
   {
      $user = User::where('id', $request->id)->first();
      $user->name = $request['name'];
      $user->email = $request['email'];
      $user->Initiated_name = $request['Initiated_name'];
      $user->dob = $request['dob'];
      $user->contact_number = $request['contact_number'];
      $user->devotee_type = $request['devotee_type'];
      $user->save();

      $asheryleader = AsheryLeader::where('user_id', $request->id)->first();
      if (!$asheryleader) {
        // return 'AsheryLeader not found';
      } else {
         $asheryleader->ashery_leader_name =$request['Initiated_name'];
         $asheryleader->is_active = $request['is_active'];
         $asheryleader->save();
      }
      return $asheryleader;
   }

   public function deleteAsheryLeader($id)
   {
      // Find the AsheryLeader record by ID
      $asheryleader = AsheryLeader::where('user_id', $id)->first();
      if (!$asheryleader) {
         return response()->json(['message' => 'AsheryLeader not found'], 404);
      }
      // Get the associated user_id
      $userId = $asheryleader->user_id;
      // Delete the user record from the users table
      User::destroy($userId);
      // Delete the AsheryLeader record
      $asheryleader->delete();
      return $asheryleader;
   }
}