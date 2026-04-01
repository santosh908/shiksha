<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
             \App\Http\Middleware\SanitizeInputMiddleware::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'checkPermission' => \App\Http\Middleware\CheckPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (UnauthorizedException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'You don\'t have permission to access this action'
                ], 403);
            }

            return back()->with('error', 'You don\'t have permission to access this action');
        });

        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'You don\'t have permission to access this action'
                ], 403);
            }

            return back()->with('error', 'You don\'t have permission to access this action');
        });
    })
    ->create();
