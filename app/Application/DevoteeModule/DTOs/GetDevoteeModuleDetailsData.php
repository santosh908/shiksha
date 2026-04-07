<?php

namespace App\Application\DevoteeModule\DTOs;

final class GetDevoteeModuleDetailsData
{
    public function __construct(
        public readonly int $id
    ) {
    }
}
