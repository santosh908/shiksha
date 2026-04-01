<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\Auth\SendLinkRequest;
use App\Jobs\SendResetPasswordJob;
use App\Services\ResetPasswordLinkServices;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PasswordResetLinkController extends Controller
{
    protected $RPasswordLinkServices;
    public function __construct()
    {
        $this->RPasswordLinkServices = new ResetPasswordLinkServices();
    }
    public function showForgotPasswordForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    // Handle sending of password reset link
    public function sendResetLinkEmail(SendLinkRequest $request)
    {
        $data= $request->validated();
         // Check if the email is registered
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Email not found in the users table, return with an error message
            return redirect()->back()->withErrors([
                'email' => 'The provided email address is not registered in our system.',
            ]);
        }
        $sendEmail = dispatch(new SendResetPasswordJob(["email"=> $request->email]));
        return redirect()->route('password.request'); 
    }


    // Show the Reset Password Form
    public function showResetForm($token)
    {
        $ResetLink = $this->RPasswordLinkServices->getResetLinkByToken($token);
        if ($ResetLink) {
            return Inertia::render('Auth/ResetPassword', [
                'token' => $token,
            ]);
        } else {
            return Inertia::render('Auth/ResetPassword', [
                'token' =>'NA',
            ]);
        }
    }

    // Handle the password reset
    public function resetPassword(Request $request)
    {

        $request->validate([
            'password' => 'required|min:8|confirmed',
            'token' => 'required',
        ]);
        // Look up the token in the password_resets table to find the associated email
        $passwordReset = DB::table('password_resets')->where('token', $request->token)->first();

        if (!$passwordReset) {
            // Token not found or invalid
            return redirect()->back()->withErrors(['token' => 'Invalid token or token has expired.']);
        }

        // Get the user by the email associated with the token
        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            // No user found with the associated email
            return redirect()->back()->withErrors(['email' => 'The provided email address is not registered in our system.']);
        }

        // Reset the user's password
        $user->forceFill([
            'password' => bcrypt($request->password),
        ])->save();

        // Optionally, you can delete the token from the password_resets table to prevent reuse
        DB::table('password_resets')->where('email', $passwordReset->email)->delete();

        // Return success response
        return redirect()->back()->with('status', 'Password has been reset successfully!');
    }
}
