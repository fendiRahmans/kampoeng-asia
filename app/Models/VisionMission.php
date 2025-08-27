<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisionMission extends Model
{
    protected $fillable = [
        'title',
        'description',
        'icon',
        'created_by',
        'updated_by',
    ];
}
