<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class GeneralSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'created_by',
        'updated_by'
    ];


    static function boot(){
        parent::boot();

        static::created(function($model){
            // delete cache
            cache()->forget('general_settings');
        });

        static::updated(function($model){
            // delete cache
            cache()->forget('general_settings');
        });

        static::deleted(function($model){
            // delete cache
            cache()->forget('general_settings');
        });
    }

    /**
     * Get the user who created this setting.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this setting.
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
