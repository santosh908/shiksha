<?php

namespace App\Application\ExamOps\Validators;

use App\Application\ExamOps\DTOs\VerifyExamListFilterData;
use Illuminate\Support\Facades\Validator;

class VerifyExamListFilterValidator
{
    public function validate(VerifyExamListFilterData $data): void
    {
        Validator::make($data->toArray(), [
            'level' => 'required|integer',
            'session' => 'required|integer',
        ])->validate();
    }
}
