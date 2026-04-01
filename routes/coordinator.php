<?php
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('CoOrdinator/dashboard');
});