<?php

namespace App\Providers;

use App\Models\ProfessionalInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string 
     */

    public const HOME = 'logout';

    public const ROUTE_LIST = [
        "Devotee"=>[
            'HOME' => '/Devotee/Registration',
            'PRIORITY' => 1
        ],
        "AsheryLeader"=>[
            'HOME' => '/AsheryLeader/dashboard',
            'PRIORITY' => 2
        ],
        "CoOrdinator"=>[
            'HOME' => '/CoOrdinator/dashboard',
            'PRIORITY' => 3
        ],
        "SuperAdmin"=>[
            'HOME' => '/SuperAdmin/dashboard',
            'PRIORITY' => 4
        ],
        "Admin"=>[
            'HOME' => '/SuperAdmin/dashboard',
            'PRIORITY' => 6
        ],
        "BhaktiBhekshuk"=>[
            'HOME' => '/BhaktiBhekshuk/dashboard',
            'PRIORITY' => 5
        ],
    ];

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        $this->configureHomePath();

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    public function getHomePath()
    {
        $user = Auth::user();
        if (!$user) {
            return self::HOME;
        }

        foreach (self::ROUTE_LIST as $role => $routes) {
            if ($user->hasRole($role)) {
                if ($role === 'Devotee' && ($user->profile_submitted == 'N' || $user->profile_submitted == "")) {
                    return '/Devotee/Registration';
                }
                return $routes['HOME'];
            }
        }

        return self::HOME;
    }
}
