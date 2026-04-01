<?php
namespace App\Services;

use App\Application\Registration\DTOs\CompleteRegistrationData;
use App\Application\Registration\Mappers\RegistrationRequestMapper;
use App\Application\Registration\Transformers\RegistrationMasterDataTransformer;
use App\Application\Registration\UseCases\GetRegistrationMasterDataUseCase;
use App\Application\Registration\UseCases\RegisterCompleteDevoteeUseCase;
use App\Models\User;

class RegistrationService
{
    public function __construct(
        private readonly RegisterCompleteDevoteeUseCase $registerCompleteDevoteeUseCase,
        private readonly GetRegistrationMasterDataUseCase $getRegistrationMasterDataUseCase,
        private readonly RegistrationRequestMapper $registrationRequestMapper,
        private readonly RegistrationMasterDataTransformer $registrationMasterDataTransformer
    ) {
    }

    public function getRegistrationMasterData(): array
    {
        return $this->registrationMasterDataTransformer->transform(
            $this->getRegistrationMasterDataUseCase->execute()
        );
    }

    public function createUser(CompleteRegistrationData $registrationData): User
    {
        return $this->registerCompleteDevoteeUseCase->execute($registrationData);
    }

    public function mapRequestToRegistrationData(array $validated): CompleteRegistrationData
    {
        return $this->registrationRequestMapper->toCompleteRegistrationData($validated);
    }
}