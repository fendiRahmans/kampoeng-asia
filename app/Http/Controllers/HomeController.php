<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    // index
    public function index()
    {
        $settings = GeneralSetting::all();
        return Inertia::render('home', [
            'settings' => $settings
        ]);
    }
}
