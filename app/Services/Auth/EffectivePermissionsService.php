<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Support\Auth\UserEffectivePermissionsCache;
use Illuminate\Support\Facades\Cache;

/**
 * Resolves permission names for Inertia / UI checks (includes permissions granted via roles).
 */
class EffectivePermissionsService
{
    /**
     * @return list<string>
     */
    public function namesFor(User $user): array
    {
        $ttl = (int) config('permission.inertia_effective_permissions_ttl', 0);
        if ($ttl <= 0) {
            return $this->resolveNames($user);
        }

        return Cache::remember(
            UserEffectivePermissionsCache::key($user->id),
            $ttl,
            fn () => $this->resolveNames($user)
        );
    }

    /**
     * @return list<string>
     */
    private function resolveNames(User $user): array
    {
        return $user->getAllPermissions()
            ->pluck('name')
            ->unique()
            ->values()
            ->all();
    }
}
