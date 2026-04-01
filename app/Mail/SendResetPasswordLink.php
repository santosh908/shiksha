<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendResetPasswordLink extends Mailable
{
    use Queueable, SerializesModels;

    public $userFullName, $email,$token;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $token)
    {
        $this->userFullName = $name;
        $this->email = $email;
        $this->token = $token;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Shiksha App: Reset Password Link',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ResetPasswordLink',
            with: [
                'name' => $this->userFullName,
                'email' => $this->email,
                'resetLink' => "reset-password/".$this->token
            ]
        );
    }

    /**
     * Get the attachments for the message. 
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
