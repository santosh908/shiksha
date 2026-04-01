<?php

namespace App\Jobs;

use App\Mail\DevoteeRegCompletedMail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Fluent;


class DevoteeRegistrationCompletedJob implements ShouldQueue, ShouldBeUnique
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

        $ashrayLeader = User::join('user_have_ashray_leader','user_have_ashray_leader.user_id','=','users.id')
        ->join('ashery_leader','user_have_ashray_leader.ashray_leader_code','=','ashery_leader.code')
        ->select('ashery_leader.ashery_leader_name')
        ->where('users.email','=', $this->payload['email'])
        ->get()
        ->toArray();

        if (!empty($ashrayLeader) && isset($ashrayLeader[0])) {
            $leaderName = $ashrayLeader[0]['ashery_leader_name'];
            // send email
            $this->sendEmail(['ashrayLeader' =>  $leaderName]);
        } 
    }
 
 
    private function sendEmail($data)
    {
        $name =  $this->user->name;        
        $email = $this->user->email;
        $ashrayLeader=$data['ashrayLeader'];
        Mail::to($email)->send(new DevoteeRegCompletedMail($name, $email,$ashrayLeader));
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
