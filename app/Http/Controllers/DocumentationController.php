<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    //index
    public function index()
    {
        $settings = GeneralSetting::all();
        return Inertia::render('documentation', [
            'settings' => $settings
        ]);
    }
}
