<?php

namespace App\Application\ShikshaLevel\Validators;

use App\Application\ShikshaLevel\DTOs\UpdateShikshaLevelData;
use Illuminate\Support\Facades\Validator;

class UpdateShikshaLevelValidator
{
    public function validate(UpdateShikshaLevelData $data): void
    {
        Validator::make($data->toArray(), [
            'id' => 'required|integer',
            'exam_level' => 'required|string|max:255',
            'is_active' => 'required|string|in:Y,N',
        ])->validate();
    }
}
