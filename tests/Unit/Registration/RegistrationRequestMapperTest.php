<?php

use App\Application\Registration\DTOs\CompleteRegistrationData;
use App\Application\Registration\Mappers\RegistrationRequestMapper;

it('maps validated payload to complete registration dto', function () {
    $payload = ['name' => 'Ritesh', 'email' => 'ritesh@gmail.com'];
    $mapper = new RegistrationRequestMapper();

    $dto = $mapper->toCompleteRegistrationData($payload);

    expect($dto)->toBeInstanceOf(CompleteRegistrationData::class)
        ->and($dto->payload)->toBe($payload);
});

