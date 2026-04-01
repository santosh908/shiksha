<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DevoteeApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFullName, $email,$LoginID;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email,$loginId)
    {
        $this->userFullName = $name;
        $this->email = $email;
        $this->LoginID = $loginId;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Shiksha App: Shiksha level Program Registration approval by Ashraya leader',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.devoteeApproved',
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
