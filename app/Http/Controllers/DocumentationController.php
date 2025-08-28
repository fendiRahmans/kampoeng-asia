<?php

namespace App\Http\Controllers;

use App\Models\Documentation;
use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    //index
    public function index()
    {
        $settings = GeneralSetting::all();
        $documentations = Documentation::orderBy('created_at', 'desc')
            ->paginate(9); // 10 items per page
        return Inertia::render('documentation', [
            'settings' => $settings,
            'documentations' => $documentations
        ]);
    }
}
