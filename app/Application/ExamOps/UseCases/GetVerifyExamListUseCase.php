<?php

namespace App\Application\ExamOps\UseCases;

use App\Application\ExamOps\DTOs\VerifyExamListFilterData;
use App\Application\ExamOps\Validators\VerifyExamListFilterValidator;
use App\Domain\ExamOps\Contracts\ExamOpsRepositoryInterface;

class GetVerifyExamListUseCase
{
    public function __construct(
        private readonly ExamOpsRepositoryInterface $repository,
        private readonly VerifyExamListFilterValidator $validator
    ) {}

    public function execute(VerifyExamListFilterData $filter): array
    {
        $this->validator->validate($filter);
        return $this->repository->getVerifyExamList($filter);
    }
}
