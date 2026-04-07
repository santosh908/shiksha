<?php

namespace App\Application\ExamOps\Validators;

use App\Application\ExamOps\DTOs\AllowExamRetakeData;
use Illuminate\Support\Facades\Validator;

class AllowExamRetakeValidator
{
    public function validate(AllowExamRetakeData $data): void
    {
        Validator::make($data->toArray(), [
            'exam_id' => 'required',
            'user_id' => 'required',
        ])->validate();
    }
}
