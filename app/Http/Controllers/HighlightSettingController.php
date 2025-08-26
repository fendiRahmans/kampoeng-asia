<?php

namespace App\Http\Controllers;

use App\Models\Highlight;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HighlightSettingController extends Controller
{
    //index
    public function index()
    {
        $highlights = Highlight::all();
        return Inertia::render('settings/highlight-setting', [
            'highlights' => $highlights
        ]);
    }

    //store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $user = $request->user() ?? null;
        // set created_by and updated_by from the authenticated user (null-safe)
        if ($user) {
            $validated['created_by'] = $user->id;
            $validated['updated_by'] = $user->id;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('highlights', 'public');
                $validated['image'] = $path;
            }
        } else {
            return redirect()->back()->with('error', 'User not authenticated.', $user);
        }

        Highlight::create($validated);

        return redirect()->back()->with('success', 'Highlight created successfully.');
    }

    // pinned (toggle between true/false)
    public function pin(Request $request, Highlight $highlight)
    {
        $validated = $request->validate([
            'pinned' => 'required|boolean',
        ]);

        $targetPinned = (bool) $validated['pinned'];

        // if already in requested state, do nothing (idempotent)
        if ($highlight->pinned === $targetPinned) {
            $message = $targetPinned ? 'Highlight already pinned.' : 'Highlight already unpinned.';
            return redirect()->back()->with('info', $message);
        }

        DB::transaction(function () use ($highlight, $targetPinned) {
            if ($targetPinned) {
                // when pinning, ensure max 5 pinned by unpinning the oldest if needed
                $pinnedCount = Highlight::where('pinned', true)->count();

                if ($pinnedCount >= 5) {
                    $oldest = Highlight::where('pinned', true)->orderBy('updated_at', 'asc')->first();
                    if ($oldest) {
                        $oldest->pinned = false;
                        $oldest->save();
                    }
                }

                $highlight->pinned = true;
                $highlight->save();
            } else {
                // unpin the requested highlight
                $highlight->pinned = false;
                $highlight->save();
            }
        });

        $msg = $targetPinned ? 'Highlight pinned successfully.' : 'Highlight unpinned successfully.';
        return redirect()->back()->with('success', $msg);
    }

    // update
    public function update(Request $request, Highlight $highlight)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $user = $request->user() ?? null;
        // set updated_by from the authenticated user (null-safe)
        if ($user) {
            $validated['updated_by'] = $user->id;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('highlights', 'public');
                $validated['image'] = $path;
            }
        } else {
            return redirect()->back()->with('error', 'User not authenticated.', $user);
        }

        $highlight->update($validated);

        return redirect()->back()->with('success', 'Highlight updated successfully.');
    }

    // delete
    public function destroy(Request $request, Highlight $highlight)
    {
        $user = $request->user() ?? null;
        // set deleted_by from the authenticated user (null-safe)
        if ($user) {
            $highlight->delete();
        } else {
            return redirect()->back()->with('error', 'User not authenticated.', $user);
        }


        return redirect()->back()->with('success', 'Highlight deleted successfully.');
    }
}
