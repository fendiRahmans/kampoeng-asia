<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneralSettingController extends Controller
{
    // index
    public function index()
    {
        $settings = GeneralSetting::all();
        return Inertia::render('settings/general-setting', [
            'settings' => $settings
        ]);
    }
}
