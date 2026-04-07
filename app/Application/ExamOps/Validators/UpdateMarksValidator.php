<?php

namespace App\Application\ExamOps\Validators;

use App\Application\ExamOps\DTOs\UpdateMarksData;
use Illuminate\Support\Facades\Validator;

class UpdateMarksValidator
{
    public function validate(UpdateMarksData $data): void
    {
        Validator::make($data->toArray(), [
            'login_id' => 'required|string',
            'exam_id' => 'required|numeric',
            'exam_level' => 'required',
            'total_obtain' => 'required|numeric',
        ])->validate();
    }
}
