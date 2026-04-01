<?php

namespace App\Jobs;

use App\Mail\RegistrationMail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Fluent;

class SendRegistrationMailJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user = null;
    private $payload = null;
    public function __construct($payload)
    {
        $this->payload = $payload;
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

        // send email LOGID
        $this->sendEmail([]);
    }


    private function sendEmail($data)
    {
        $name =  $this->user->name;        
        $email = $this->user->email;
        $LoginID=$this->user->login_id;
        Mail::to($email)->send(new RegistrationMail($name, $email,$LoginID));
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
