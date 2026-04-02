<?php

namespace App\Support\Auth;

use Illuminate\Support\Facades\Cache;

final class UserEffectivePermissionsCache
{
    public static function key(int $userId): string
    {
        return 'auth.user.'.$userId.'.effective_permission_names';
    }

    public static function forget(int $userId): void
    {
        Cache::forget(self::key($userId));
    }
}
