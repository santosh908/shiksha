<?php

use App\Application\Registration\DTOs\CompleteRegistrationData;
use App\Application\Registration\UseCases\RegisterCompleteDevoteeUseCase;
use App\Domain\Registration\Contracts\RegistrationRepositoryInterface;
use App\Models\User;

it('delegates complete registration to repository', function () {
    $payload = ['name' => 'Test Devotee', 'email' => 'test@gmail.com'];
    $expectedUser = new User(['name' => 'Test Devotee', 'email' => 'test@gmail.com']);

    $repo = Mockery::mock(RegistrationRepositoryInterface::class);
    $repo->shouldReceive('createCompleteRegistration')
        ->once()
        ->with($payload)
        ->andReturn($expectedUser);

    $useCase = new RegisterCompleteDevoteeUseCase($repo);
    $result = $useCase->execute(CompleteRegistrationData::fromArray($payload));

    expect($result)->toBe($expectedUser);
});

