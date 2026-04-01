<?php

namespace App\Http\Middleware;

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
        $userPermissions = $user ? $user->permissions->pluck('name') : [];

        $notification = session()->pull('notification');
        $successMessage = session()->pull('success');  // Use pull instead of session()
        $errorMessage = session()->pull('error'); 

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
            ...($notification != null ? ['notification' => $notification] : []),
            ...($successMessage != null ? ['flash' => ['success' => $successMessage]] : []),
            ...($errorMessage != null ? ['flash' => ['error' => $errorMessage]] : []),  // Add this line
        ];
    }
}
