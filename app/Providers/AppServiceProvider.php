<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\GeneralSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share general settings with all Inertia responses. Use a closure so it's resolved per request.
        Inertia::share([
            'settings' => function () {
                return GeneralSetting::all();
            },
        ]);
    }
}
