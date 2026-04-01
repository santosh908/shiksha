<?php

namespace App\Services\DevoteeRegistrationStatus;

use App\Models\DevoteeRegistrationStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DevoteeRegistrationStatusService
{

    public function registrationIsOpen()
    {
        $today = now()->format('Y-m-d');
        $openRegistration = DevoteeRegistrationStatus::where('is_open', 'Open')
            ->whereDate('registration_start_date', '<=', $today)
            ->whereDate('registration_end_date', '>=', $today)
            ->first();
          //  dd($openRegistration,$today );
        return $openRegistration !== null;
    }

    /**
     * Get the current devotee registration status
     */
    public function getRegistrationStatus()
    {
        try {
            $registrationList = [
                'registrationList' => DevoteeRegistrationStatus::orderByDesc('id')
                    ->get()
                    ->map(function ($status) {
                        return [
                            'id' => $status->id,
                            'registration_start_date' => $status->registration_start_date ? $status->registration_start_date->format('Y-m-d') : null,
                            'registration_end_date' => $status->registration_end_date ? $status->registration_end_date->format('Y-m-d') : null,
                            'is_open' => $status->is_open,
                            'is_registration_open' => method_exists($status, 'isRegistrationOpen') ? $status->isRegistrationOpen() : null,
                            'is_within_date_range' => method_exists($status, 'isWithinDateRange') ? $status->isWithinDateRange() : null,
                            'created_at' => $status->created_at,
                            'updated_at' => $status->updated_at,
                        ];
                    })
                    ->toArray()
            ];
            return $registrationList;
        } catch (\Exception $e) {
            Log::error('Error getting registration statuses: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error retrieving registration statuses.',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Start a new registration period
     */
    public function startRegistration(array $data)
    {
        DB::beginTransaction();
        try {
            // Close any existing open registrations
            DevoteeRegistrationStatus::where('is_open', 'Open')->update(['is_open' => 'Close']);

            // Create new registration status
            $registrationStatus = DevoteeRegistrationStatus::create([
                'registration_start_date' => $data['registration_start_date'],
                'registration_end_date' => $data['registration_end_date'],
                'is_open' => $data['is_open'],
            ]);

            DB::commit();

            return [
                'registration' => [
                    'id' => $registrationStatus->id,
                    'registration_start_date' => $registrationStatus->registration_start_date->format('Y-m-d'),
                    'registration_end_date' => $registrationStatus->registration_end_date->format('Y-m-d'),
                    'is_open' => $registrationStatus->is_open,
                    'created_at' => $registrationStatus->created_at,
                    'updated_at' => $registrationStatus->updated_at,
                ]
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error starting registration: ' . $e->getMessage());
            return [
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update existing registration status
     */
    public function updateRegistrationStatus(int $id, array $data)
    {
        DB::beginTransaction();
        try {
            $registrationStatus = DevoteeRegistrationStatus::findOrFail($id);

            // If setting to Open, close other open registrations
            if (isset($data['is_open']) && $data['is_open'] === 'Open') {
                DevoteeRegistrationStatus::where('id', '!=', $id)
                    ->where('is_open', 'Open')
                    ->update(['is_open' => 'Close']);
            }

            $registrationStatus->update($data);

            DB::commit();

            return [
                'registration' => [
                    'id' => $registrationStatus->id,
                    'registration_start_date' => $registrationStatus->registration_start_date->format('Y-m-d'),
                    'registration_end_date' => $registrationStatus->registration_end_date->format('Y-m-d'),
                    'is_open' => $registrationStatus->is_open,
                    'updated_at' => $registrationStatus->updated_at,
                ]
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating registration status: ' . $e->getMessage());
            return [
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Close registration
     */
    public function closeRegistration(int $id)
    {
        try {
            $registrationStatus = DevoteeRegistrationStatus::findOrFail($id);
            $registrationStatus->update(['is_open' => 'Close']);

            return [
                'registration' => [
                    'id' => $registrationStatus->id,
                    'registration_start_date' => $registrationStatus->registration_start_date ? $registrationStatus->registration_start_date->format('Y-m-d') : null,
                    'registration_end_date' => $registrationStatus->registration_end_date ? $registrationStatus->registration_end_date->format('Y-m-d') : null,
                    'is_open' => $registrationStatus->is_open,
                    'created_at' => $registrationStatus->created_at,
                    'updated_at' => $registrationStatus->updated_at,
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error closing registration: ' . $e->getMessage());
            return [
                'error' => $e->getMessage(),
            ];
        }
    }
    /**
     * Delete a registration status
     */
    public function deleteRegistrationStatus(int $id)
    {
        try {
            $registrationStatus = DevoteeRegistrationStatus::findOrFail($id);
            $registrationStatus->delete();
            return [
                'registration' => null,
                'message' => 'Registration status deleted successfully.'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting registration status: ' . $e->getMessage());
            return [
                'error' => $e->getMessage(),
            ];
        }
    }
}
