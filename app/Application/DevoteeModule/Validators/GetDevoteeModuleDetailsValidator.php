<?php

namespace App\Application\DevoteeModule\Validators;

use App\Application\DevoteeModule\DTOs\GetDevoteeModuleDetailsData;
use Illuminate\Support\Facades\Validator;

class GetDevoteeModuleDetailsValidator
{
    public function validate(GetDevoteeModuleDetailsData $data): void
    {
        Validator::make(['id' => $data->id], [
            'id' => 'required|integer|min:1',
        ])->validate();
    }
}
