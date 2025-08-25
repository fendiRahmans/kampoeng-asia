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

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:100',
            'value' => 'required|string|max:100',
        ]);

        GeneralSetting::create($validated);

        return redirect()->back()->with('success', 'Setting created successfully.');
    }

    // update
    public function update(Request $request, GeneralSetting $generalSetting)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:100',
            'value' => 'required|string|max:100',
        ]);

        $generalSetting->update($validated);

        return redirect()->back()->with('success', 'Setting updated successfully.');
    }

    // destroy
    public function destroy(GeneralSetting $generalSetting)
    {
        $generalSetting->delete();

        return redirect()->back()->with('success', 'Setting deleted successfully.');
    }
}
