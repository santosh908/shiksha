<?php

namespace App\Jobs;

use App\Mail\SendResetPasswordLink;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Fluent;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Services\ResetPasswordLinkServices;
use GuzzleHttp\Promise\Create;

class SendResetPasswordJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user = null;
    private $payload = null;
    protected $RPasswordLinkServices;
    public function __construct($payload)
    {
        $this->payload = $payload;
        $this->RPasswordLinkServices = new ResetPasswordLinkServices();
    }

    private function setUser($email)
    {
        $user = User::where('email', $email)->first();
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $validation = $this->validate($this->payload);
        if ($validation !== true) return;

        $this->setUser($this->payload['email']);
       // Generate a new token
       $token = Str::random(60);
        // send email
        $this->sendEmail(['token' => $token]);

    }
 

    private function sendEmail($data)
    {
        $name =  $this->user->name;        
        $email = $this->user->email;
        $token = $data['token'];

        $this->RPasswordLinkServices->createResetPasswordLink($email,$token);
        Mail::to($email)->send(new SendResetPasswordLink($name, $email, $token));
        return;
    }

    private function validate($payload)
    {
        $payload_bucket = new Fluent($payload);

        // validate data format 
        $validator  = Validator::make($payload_bucket->toArray(), [
            'email' => 'required|exists:users,email',
        ]);

        if ($validator->fails()) return $validator->errors();
        return true;
    }
}
