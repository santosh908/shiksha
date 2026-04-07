<?php

namespace App\Http\Controllers\Auth\ChangePassword;

use App\Application\ChangePassword\DTOs\ChangePasswordData;
use App\Http\Controllers\Controller;
use App\Services\ChangePasswordApplicationService;
use Inertia\Inertia;
use App\Http\Requests\ChangePassword\ChangePasswordRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ChangePasswordController extends Controller
{
    public function __construct(
        private readonly ChangePasswordApplicationService $changePasswordApplicationService
    ) {
    }

    public function showChangePasswordForm()
    {
        return Inertia::render('SuperAdmin/changepassword');
    }

    public function changepassword(ChangePasswordRequest $request)
    {
        //dd($request);
        $data = $request->validated();
        $user = User::where('email', $request['email'])->first();
        if ($user) {
            $dto = ChangePasswordData::fromArray($data);
            $updatedUser = $this->changePasswordApplicationService->update($dto);

            // Return success
            return redirect()->route('Action.updatePassword')
                ->with('success', 'Password updated successfully!')
                ->with('savedData', $updatedUser);
        }
        return redirect()->back()->withErrors(['email' => 'Email not found in our records.']);
    }
    public function getLoginId($email)
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            return response()->json(['login_id' => $user->login_id]);
        }

        return response()->json(['error' => 'Email not found'], 404);
    }

    public function userDetailsByEmailID($email)
    {
         $user = User::where('email', $email)->first();
        if ($user) {
            return response()->json($user);
        }
        return response()->json('NA');
    }
}
