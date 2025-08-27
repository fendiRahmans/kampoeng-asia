<?php

namespace App\Http\Controllers;

use App\Models\VisionMission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class VisionMissionSettingController extends Controller
{
    //index
    public function index()
    {
        $data = VisionMission::orderBy('created_at', 'asc')->get();
        return Inertia::render('settings/vision-mission-setting', [
            'visionMissions' => $data
        ]);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('images', 'public');
            $validated['icon'] = $path;
        }

        $validated['created_by'] = $request->user()?->id ?? null;
        $validated['updated_by'] = $request->user()?->id ?? null;

        VisionMission::create($validated);

        return redirect()->back()->with('success', 'Vision/Mission created successfully.');
    }

    // update
    public function update(Request $request, VisionMission $visionMission)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            // delete old icon if exists
            if ($visionMission->icon && Storage::disk('public')->exists($visionMission->icon)) {
                Storage::disk('public')->delete($visionMission->icon);
            }

            $path = $request->file('icon')->store('images', 'public');
            $validated['icon'] = $path;
        } else {
            unset($validated['icon']);
        }

        $validated['updated_by'] = $request->user()?->id ?? null;

        $visionMission->update($validated);

        return redirect()->back()->with('success', 'Vision/Mission updated successfully.');
    }

    // destroy
    public function destroy(VisionMission $visionMission)
    {
        // delete icon file if exists
        if ($visionMission->icon && Storage::disk('public')->exists($visionMission->icon)) {
            Storage::disk('public')->delete($visionMission->icon);
        }

        $visionMission->delete();

        return redirect()->back()->with('success', 'Vision/Mission deleted successfully.');
    }
}
