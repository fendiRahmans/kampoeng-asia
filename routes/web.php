<?php

use App\Http\Controllers\GeneralSettingController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('welcome');

Route::get('/', [
    HomeController::class,
    'index'
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('general-settings', [
        GeneralSettingController::class,
        'index'
    ])->name('general-settings');
    Route::post('general-settings', [
        GeneralSettingController::class,
        'store'
    ])->name('general-settings.store');
    Route::put('general-settings/{generalSetting}', [
        GeneralSettingController::class,
        'update'
    ])->name('general-settings.update');
    Route::delete('general-settings/{generalSetting}', [
        GeneralSettingController::class,
        'destroy'
    ])->name('general-settings.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
