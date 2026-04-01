<?php

use App\Jobs\DevoteeApprovedJob;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Jobs\DevoteeRejectedJob;
use App\Jobs\DevoteeRegistrationCompletedJob;
use App\Jobs\SendResetPasswordJob;

Route::get("/sendMail",function (){

    // $ashrayLeader = User::join('user_have_ashray_leader','user_have_ashray_leader.user_id','=','users.id')
    // ->join('ashery_leader','user_have_ashray_leader.ashray_leader_code','=','ashery_leader.code')
    // ->select('ashery_leader.ashery_leader_name')
    // ->where('users.email','=', 'santosh.nit09@gmail.com')
    // ->get()
    // ->toArray();

   // dd($ashrayLeader[0]['ashery_leader_name']); DevoteeRegistrationCompletedJob
    //dispatch(new SendResetPasswordJob(["email"=> "project.nit09@gmail.com"]));

    //dispatch(new DevoteeRegistrationCompletedJob(["email"=> "santosh.nit09@gmail.com"]));

    dispatch(new SendResetPasswordJob(["email"=> "santosh.nit09@gmail.com"]));
});