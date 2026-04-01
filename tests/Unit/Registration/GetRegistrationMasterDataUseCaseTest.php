<?php

use App\Application\Registration\UseCases\GetRegistrationMasterDataUseCase;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;

it('returns registration master data from repository', function () {
    $expected = [
        'Education' => [['id' => 1, 'eduction_name' => 'Graduate']],
        'State' => [['lg_code' => '07', 'state_name' => 'Delhi']],
    ];

    $repo = Mockery::mock(RegistrationRepositoryInterface::class);
    $repo->shouldReceive('getRegistrationMasterData')
        ->once()
        ->andReturn($expected);

    $useCase = new GetRegistrationMasterDataUseCase($repo);
    $result = $useCase->execute();

    expect($result)->toBe($expected);
});

