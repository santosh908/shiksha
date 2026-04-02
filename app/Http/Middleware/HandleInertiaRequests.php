<?php

namespace App\Http\Middleware;

use App\Services\Auth\EffectivePermissionsService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userRoles = $user ? $user->roles->pluck('name') : [];
        $initiated_name = $user ? $user->Initiated_name : '';
        $userPermissions = $user
            ? app(EffectivePermissionsService::class)->namesFor($user)
            : [];

        $flash = array_filter(
            [
                'success' => session()->pull('success'),
                'error' => session()->pull('error'),
                'info' => session()->pull('info'),
            ],
            static fn ($value) => $value !== null && $value !== ''
        );

        return [
            ...parent::share($request),
            'user' => $user
                ? array_merge(
                    $request->user()->toArray(),
                    [
                        'roles' => $userRoles,
                        'permissions' => $userPermissions,
                        'initiated_name' => $initiated_name,
                    ]
                )
                : null,
            ...($flash !== [] ? ['flash' => $flash] : []),
        ];
    }
}
