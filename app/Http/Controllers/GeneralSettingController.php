<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GeneralSettingController extends Controller
{
    // index
    public function index(Request $request)
    {
        $settings = GeneralSetting::orderBy('created_at', 'asc')
            ->paginate(10); // 10 items per page

        return Inertia::render('settings/general-setting', [
            'settings' => $settings
        ]);
    }

    // store
    public function store(Request $request)
    {
        $key = $request->input('key');

        if ($key === 'site_logo') {
            $validated = $request->validate([
                'key' => 'required|string|max:100',
                // accept common image types and svg, max size 2048 KB
                'value' => 'required|file|mimes:jpg,jpeg,png,svg|max:2048',
            ]);

            // store uploaded file to storage/app/public/images and save the path
            $path = $request->file('value')->store('images', 'public');
            $validated['value'] = $path;
        } else {
            $validated = $request->validate([
                'key' => 'required|string|max:100',
                'value' => 'required|string|max:100',
            ]);
        }

        // set created_by and updated_by from the authenticated user (null-safe)
        $validated['created_by'] = $request->user()?->id ?? null;
        $validated['updated_by'] = $request->user()?->id ?? null;

        GeneralSetting::create($validated);

        return redirect()->back()->with('success', 'Setting created successfully.');
    }

    // update
    public function update(Request $request, GeneralSetting $generalSetting)
    {
        $key = $request->input('key');

        if ($key === 'site_logo') {
            $validated = $request->validate([
                'key' => 'required|string|max:100',
                // allow nullable on update; only replace if a file is provided
                'value' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
            ]);

            if ($request->hasFile('value')) {
                // delete old file if present on public disk
                if ($generalSetting->value && Storage::disk('public')->exists($generalSetting->value)) {
                    Storage::disk('public')->delete($generalSetting->value);
                }

                $path = $request->file('value')->store('images', 'public');
                $validated['value'] = $path;
            } else {
                // no new file uploaded — don't overwrite existing value
                unset($validated['value']);
            }
        } else {
            $validated = $request->validate([
                'key' => 'required|string|max:100',
                'value' => 'required|string|max:100',
            ]);
        }

        // always set/overwrite updated_by with the current user (null-safe)
        $validated['updated_by'] = $request->user()?->id ?? null;

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
