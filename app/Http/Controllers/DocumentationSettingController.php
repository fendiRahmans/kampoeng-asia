<?php

namespace App\Http\Controllers;

use App\Models\Documentation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationSettingController extends Controller
{
    //index
    public function index(Request $request)
    {
        $documentations = Documentation::orderBy('created_at', 'asc')
            ->paginate(10); // 10 items per page

        return Inertia::render('settings/documentation-setting', [
            'documentations' => $documentations
        ]);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url',
        ]);

        // set created_by and updated_by from the authenticated user (null-safe)
        $validated['created_by'] = $request->user()?->id ?? null;
        $validated['updated_by'] = $request->user()?->id ?? null;

        Documentation::create($validated);

        return redirect()->back()->with('success', 'Documentation created successfully.');
    }

    // update
    public function update(Request $request, Documentation $documentation)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url',
        ]);

        // always set/overwrite updated_by with the current user (null-safe)
        $validated['updated_by'] = $request->user()?->id ?? null;

        $documentation->update($validated);

        return redirect()->back()->with('success', 'Documentation updated successfully.');
    }

    // destroy
    public function destroy(Documentation $documentation)
    {
        $documentation->delete();

        return redirect()->back()->with('success', 'Documentation deleted successfully.');
    }
}
