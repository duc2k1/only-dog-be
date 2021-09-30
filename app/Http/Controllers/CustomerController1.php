<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\User;

class CustomerController1 extends Controller
{
    function Get_Customer($id){
        $user = Customer::where('id_customer',$id)->get();
        // $users = User::all();

       // $category = DB::table('products')->where('type_id', '=', $id)->where('gender', '=', 2)->where('manu_id', '=', $manu_id)->paginate(8);
        // return view('frontend.productbycategory', compact('category'));
        // return response()->json($user);
        return $user;
        

            // $user = User::where('id',$id)->update(array_merge(
            //     ['password' => bcrypt($request->password)]));
    }

    function Update_Customer(Request $request, Customer $customer){
        //$user = Customer::where('id_customer',$customer)->get();
        // $users = User::all();
        $customer->update($request->all());

       // $category = DB::table('products')->where('type_id', '=', $id)->where('gender', '=', 2)->where('manu_id', '=', $manu_id)->paginate(8);
        // return view('frontend.productbycategory', compact('category'));
        // return response()->json($user);
        return $customer;
        

            // $user = User::where('id',$id)->update(array_merge(
            //     ['password' => bcrypt($request->password)]));
    }
}
