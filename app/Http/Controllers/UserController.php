<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    // index
    public function index()
    {
        $users = User::all();
        return Inertia::render('settings/user-setting', [
            'users' => $users
        ]);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // hash the password before creating the user
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);
        return redirect()->back()->with('success', 'User created successfully.');
    }

    // update
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        // if password is provided, hash it; otherwise, remove it from validated to avoid overwriting
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        return redirect()->back()->with('success', 'User updated successfully.');
    }

    // delete
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
