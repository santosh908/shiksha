<?php

namespace App\Application\Registration\DTOs;

class CompleteRegistrationData
{
    public function __construct(
        public readonly array $payload
    ) {
    }

    public static function fromArray(array $payload): self
    {
        return new self($payload);
    }
}

