<?php

namespace App\Services\EncryptionService;
use Illuminate\Support\Facades\Crypt;
class EncryptionServices
{
    public static function encrypt($value)
    {
        if (!$value)
            return null;
        //$paddedValue = str_pad($value, 8, '0', STR_PAD_LEFT);

        // Generate a unique identifier
        $uniqueId = uniqid(rand(), true);
        // Create a unique string by combining value with unique identifier
        $uniqueValue = $value . '_' . $uniqueId;
        
        return base64_encode($value);
    }

    public static function decrypt($value)
    {
        if (!$value)
            return null;
        try {
            return base64_decode($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
