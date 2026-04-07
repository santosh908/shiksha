<?php

namespace App\Application\ExamOps\DTOs;

final class VerifyExamListFilterData
{
    /** @param array<string, mixed> $payload */
    public function __construct(public readonly array $payload) {}
    /** @param array<string, mixed> $payload */
    public static function fromArray(array $payload): self { return new self($payload); }
    /** @return array<string, mixed> */
    public function toArray(): array { return $this->payload; }
}
