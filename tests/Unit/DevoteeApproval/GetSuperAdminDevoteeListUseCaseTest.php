<?php

use App\Application\DevoteeApproval\UseCases\GetSuperAdminDevoteeListUseCase;
use App\Domain\DevoteeApproval\Contracts\DevoteeApprovalRepositoryInterface;

it('gets super admin devotee list from repository', function () {
    $expected = ['RegistrationRequest' => [['user_id' => 1]]];
    $repo = Mockery::mock(DevoteeApprovalRepositoryInterface::class);
    $repo->shouldReceive('getSuperAdminDevoteeList')->once()->andReturn($expected);

    $useCase = new GetSuperAdminDevoteeListUseCase($repo);
    expect($useCase->execute())->toBe($expected);
});

