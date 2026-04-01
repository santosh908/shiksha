<!-- resources/views/emails/SendMail.blade.php -->
@component('mail::message')
# Hello {{ $user['email'] }}

You have requested to reset your password.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
