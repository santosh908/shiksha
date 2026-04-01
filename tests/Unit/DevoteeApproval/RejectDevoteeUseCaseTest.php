<?php

use App\Application\DevoteeApproval\UseCases\RejectDevoteeUseCase;
use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

it('rejects devotee through repository', function () {
    $repo = Mockery::mock(DevoteeApprovalRepositoryInterface::class);
    $repo->shouldReceive('rejectDevoteeByProfileId')
        ->once()
        ->with('Incomplete details', 15)
        ->andReturn(['ok' => true]);

    $useCase = new RejectDevoteeUseCase($repo);
    expect($useCase->execute('Incomplete details', 15))->toBe(['ok' => true]);
});

