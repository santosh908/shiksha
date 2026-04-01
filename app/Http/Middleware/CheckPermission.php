<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        $user = Auth::user();
        if ($user && $user->id === 1) {
            return $next($request);
        }

        if (!$user || !$user->can($permission)) {  // Using 'can' instead of 'hasPermissionTo'
            return redirect()->back()->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
