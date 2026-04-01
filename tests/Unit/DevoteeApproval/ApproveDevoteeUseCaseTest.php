<?php

use App\Application\DevoteeApproval\UseCases\ApproveDevoteeUseCase;
use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

it('approves devotee through repository', function () {
    $repo = Mockery::mock(DevoteeApprovalRepositoryInterface::class);
    $repo->shouldReceive('approveDevoteeByProfileId')->once()->with(12)->andReturn(['ok' => true]);

    $useCase = new ApproveDevoteeUseCase($repo);
    expect($useCase->execute(12))->toBe(['ok' => true]);
});

