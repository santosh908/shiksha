<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class SanitizeInputMiddleware
{
    /**
     * Fields that should not be sanitized (preserve HTML/rich text)
     */
    protected $exceptFields = [
        'description',
        'content',
        'body',
        'message',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       // Log::info('SanitizeInputMiddleware - before', $request->all());
        $input = $request->all();
        $input = $this->sanitizeRecursive($input);
        //Log::info('SanitizeInputMiddleware - after', $input);
        $request->merge($input);
        return $next($request);

    }

    private function sanitizeRecursive($data, $parentKey = '')
    {
        foreach ($data as $key => $value) {
            // Skip sanitization for excepted fields
            if (in_array($key, $this->exceptFields)) {
                continue;
            }
            
            if (is_string($value)) {
                // Allow only English letters, numbers, @ . _ - + : T and space (for datetime)
                $data[$key] = preg_replace('/[^A-Za-z0-9@._\-+:T ]/', '', $value);
            } elseif (is_array($value)) {
                $data[$key] = $this->sanitizeRecursive($value, $key);
            }
        }
        return $data;
    }
}
