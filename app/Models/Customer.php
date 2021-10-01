<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\HttpFoundation\Request;

class Customer extends Model
{
    use HasFactory;
    // public $timestamps = false;
    protected $fillable = [
        'name_customer', 'phone_customer', 'email_customer', 'address_customer', 'city_customer'
    ];
    protected $primaryKey = 'id_customer';
    protected $table = 'customer';


}
