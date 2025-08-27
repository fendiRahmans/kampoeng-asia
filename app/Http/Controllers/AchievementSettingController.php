<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AchievementSettingController extends Controller
{
    // index
    public function index()
    {
        // ambil 5 achievement terbaru berdasarkan created_at
        $achievements = Achievement::orderBy('created_at', 'desc')->get();
        return Inertia::render('settings/achievement-setting', [
            'achievements' => $achievements
        ]);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'points' => 'required|string|max:255',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,svg,svg+xml|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('images/achievements', 'public');
            $validated['icon'] = $path;
        }

        $validated['created_by'] = $request->user()?->id ?? null;
        $validated['updated_by'] = $request->user()?->id ?? null;

        Achievement::create($validated);

        return redirect()->back()->with('success', 'Achievement created successfully.');
    }

    // update
    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'points' => 'required|integer|min:0',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,svg,svg+xml|max:2048',
        ]);

        if ($request->hasFile('icon')) {
            // delete old icon if exists
            if ($achievement->icon && Storage::disk('public')->exists($achievement->icon)) {
                Storage::disk('public')->delete($achievement->icon);
            }

            $path = $request->file('icon')->store('images/achievements', 'public');
            $validated['icon'] = $path;
        } else {
            // do not overwrite icon when no file provided
            unset($validated['icon']);
        }

        $validated['updated_by'] = $request->user()?->id ?? null;

        $achievement->update($validated);

        return redirect()->back()->with('success', 'Achievement updated successfully.');
    }

    // destroy
    public function destroy(Achievement $achievement)
    {
        // delete icon file if exists
        if ($achievement->icon && Storage::disk('public')->exists($achievement->icon)) {
            Storage::disk('public')->delete($achievement->icon);
        }

        $achievement->delete();

        return redirect()->back()->with('success', 'Achievement deleted successfully.');
    }
}
