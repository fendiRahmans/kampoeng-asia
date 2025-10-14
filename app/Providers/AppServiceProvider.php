<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\GeneralSetting;
use Illuminate\Support\Facades\Cache;

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
        // Share general settings as a keyed map (['site_title' => '...']) and cache the result.
        // Returning a keyed object makes it easier and more reliable to access in frontend.
        Inertia::share([
            'settings' => function () {
                return Cache::remember('general_settings_keyed', 3600, function () {
                    return GeneralSetting::all()->pluck('value', 'key')->toArray();
                });
            },
        ]);
    }
}
