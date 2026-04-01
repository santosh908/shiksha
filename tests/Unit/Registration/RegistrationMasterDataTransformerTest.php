<?php

use App\Application\Registration\Transformers\RegistrationMasterDataTransformer;

it('transforms registration master data payload', function () {
    $input = ['Education' => [['id' => 1, 'eduction_name' => 'Graduate']]];
    $transformer = new RegistrationMasterDataTransformer();

    $result = $transformer->transform($input);

    expect($result)->toBe($input);
});

