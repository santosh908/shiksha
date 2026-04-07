<?php

namespace App\Application\ShikshaLevel\Validators;

use App\Application\ShikshaLevel\DTOs\SaveShikshaLevelData;
use Illuminate\Support\Facades\Validator;

class SaveShikshaLevelValidator
{
    public function validate(SaveShikshaLevelData $data): void
    {
        Validator::make($data->toArray(), [
            'exam_level' => 'required|string|max:255',
            'is_active' => 'required|string|in:Y,N',
        ])->validate();
    }
}
