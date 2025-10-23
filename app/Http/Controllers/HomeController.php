<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\GeneralSetting;
use App\Models\Highlight;
use App\Models\VisionMission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    // index
    public function index()
    {
        // $settings = GeneralSetting::all();
        $settings = Cache::remember('general_settings', 60, function () {
            return GeneralSetting::all();
        });
        $highlights = Highlight::where('pinned', true)->get();
        $achievements = Achievement::orderBy('created_at', 'desc')->take(5)->get();
        $visionMissions = VisionMission::orderBy('created_at', 'asc')->get();
        return Inertia::render('home', [
            'settings' => $settings,
            'highlights' => $highlights,
            'achievements' => $achievements,
            'visionMissions' => $visionMissions
        ]);
    }
}
