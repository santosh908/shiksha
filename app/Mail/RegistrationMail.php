<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFullName, $email,$LoginID;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email,$LoginID)
    {
        $this->userFullName = $name;
        $this->email = $email;
        $this->LoginID = $LoginID;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Shiksha App: Your User Id Has Been Created',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.register_confirmation',
            with: [
                'name' => $this->userFullName,
                'email' => $this->email,
                'loginID' => $this->LoginID,
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
