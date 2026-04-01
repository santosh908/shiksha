<?php
namespace App\Services;
use App\Models\ResetPasswordLinkModel;

class ResetPasswordLinkServices
{
   public function getResetPasswordLinkList()
   {
      return ResetPasswordLinkModel::all();
   }

   public function getResetLinkByToken($token)
   {
      $list = ResetPasswordLinkModel::where("token", $token)->where('IsValid', 'Y')->first();
      return $list;
   }

   public function ValidateUserByLink($token)
   {
      $list = ResetPasswordLinkModel::join('users','users.email','=','password_resets.email')
               ->where('password_resets.token', '=', $token) 
               ->select('users.*')
                ->get()
                ->toArray();
      return $list;
   }

   public function createResetPasswordLink($email, $token): ResetPasswordLinkModel
   {
      $this->UpdateLinkFalse($email);
      $resetPass = new ResetPasswordLinkModel();
      $resetPass->email = $email;
      $resetPass->token = $token;
      $resetPass->IsValid = "Y";
      $resetPass->save();
      return $resetPass;
   }

   public function UpdateLinkFalse($email)
   {
      $link = ResetPasswordLinkModel::where('email', $email)->where('IsValid', "Y")->first();
      if ($link) {
         $link->IsValid = "N";
         $link->save();
      }
   }

   public function updateSeminar($request): ResetPasswordLinkModel
   {
      $link = ResetPasswordLinkModel::where('email', $request->email)->first();
      $link->IsValid = $request['N'];
      $link->save();
      return $link;
   }
}