<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DevoteeRegCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userFullName, $email,$ashrayLeader;

    /**
     * Create a new message instance. 
     */
    public function __construct($name, $email,$ashrayLeader)
    {
        $this->userFullName = $name;
        $this->email = $email;
        $this->ashrayLeader = $ashrayLeader;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Shiksha App: Acknowledgment of Siksha Level Program Application',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.FinalRegistrationSubmited',
            with: [
                'name' => $this->userFullName,
                'email' => $this->email,
                'ashrayLeader' => $this->ashrayLeader,
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
