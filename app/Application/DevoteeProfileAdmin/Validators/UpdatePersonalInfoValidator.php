<?php

namespace App\Application\DevoteeProfileAdmin\Validators;

use App\Application\DevoteeProfileAdmin\DTOs\UpdatePersonalInfoData;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UpdatePersonalInfoValidator
{
    /**
     * @throws ValidationException
     */
    public function validate(UpdatePersonalInfoData $data): void
    {
        $payload = $data->toArray();
        $userId = (int) ($payload['userId'] ?? 0);
        $relationType = (string) ($payload['relation_type'] ?? 'self');
        $email = (string) ($payload['email'] ?? '');
        $contactNumber = (string) ($payload['contact_number'] ?? '');

        $rules = [
            'userId' => 'required|integer|exists:users,id',
            'email' => 'required|email|regex:/^[A-Za-z0-9._%+-]+@gmail\.com$/i',
            'contact_number' => 'required|string|min:10|max:15|regex:/^[1-9][0-9]{9,14}$/',
            'relation_type' => 'required|in:self,relative',
            'relative_login_id' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'dob' => 'required|date|before:today|after_or_equal:1900-01-01',
        ];

        $validator = Validator::make($payload, $rules);

        $validator->after(function ($validator) use ($userId, $relationType, $email, $contactNumber, $payload) {
            $currentUser = User::find($userId);
            if (! $currentUser) {
                return;
            }

            if ($email !== '' && $email !== (string) $currentUser->email) {
                $emailExists = User::where('email', $email)->where('id', '!=', $userId)->exists();
                if ($emailExists) {
                    $validator->errors()->add('email', 'This email address is already registered.');
                }
            }

            $contactOwner = null;
            if ($contactNumber !== '') {
                $contactOwner = User::where('contact_number', $contactNumber)
                    ->where('id', '!=', $userId)
                    ->first();
            }

            if ($relationType === 'self' && $contactOwner) {
                $validator->errors()->add(
                    'contact_number',
                    'This mobile number already exists. Please select "Relative" in "Given number is self/relative?".'
                );
            }

            if ($relationType === 'relative') {
                $relativeLoginId = (string) ($payload['relative_login_id'] ?? '');
                if ($relativeLoginId === '') {
                    $validator->errors()->add('relative_login_id', 'No such loign id exists.');
                    return;
                }

                $relativeUser = User::where('login_id', $relativeLoginId)->first();
                if (! $relativeUser) {
                    $validator->errors()->add('relative_login_id', 'No such loign id exists.');
                    return;
                }

                if ($contactOwner && $contactOwner->login_id !== $relativeLoginId) {
                    $validator->errors()->add(
                        'relative_login_id',
                        'Relative Login ID must match the existing account of the given mobile number.'
                    );
                }
            }
        });

        $validator->validate();
    }
}
