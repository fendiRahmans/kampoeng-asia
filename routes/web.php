<?php

use App\Http\Controllers\GeneralSettingController;
use App\Http\Controllers\HighlightSettingController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
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

    // General Settings
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

    // User Settings
    Route::get('user-settings', [
        UserController::class,
        'index'
    ])->name('user-settings');
    Route::post('user-settings', [
        UserController::class,
        'store'
    ])->name('user-settings.store');
    Route::put('user-settings/{user}', [
        UserController::class,
        'update'
    ])->name('user-settings.update');
    Route::delete('user-settings/{user}', [
        UserController::class,
        'destroy'
    ])->name('user-settings.destroy');

    // Highlight Settings
    Route::get('highlight-settings', [
        HighlightSettingController::class,
        'index'
    ])->name('highlight-settings');
    Route::post('highlight-settings', [
        HighlightSettingController::class,
        'store'
    ])->name('highlight-settings.store');
    // Pin a specific highlight (include id for route-model binding)
    Route::post('highlight-settings/{highlight}/pin', [
        HighlightSettingController::class,
        'pin'
    ])->name('highlight-settings.pin');

    // Update / Delete (use {highlight} so implicit binding matches controller param)
    Route::put('highlight-settings/{highlight}', [
        HighlightSettingController::class,
        'update'
    ])->name('highlight-settings.update');
    Route::delete('highlight-settings/{highlight}', [
        HighlightSettingController::class,
        'destroy'
    ])->name('highlight-settings.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
