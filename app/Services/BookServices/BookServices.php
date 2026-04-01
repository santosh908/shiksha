<?php

namespace App\Services\BookServices;
use App\Models\Book;

class BookServices
{
    public function createBook($request): Book
    {
        return Book::Create( 
            [
                'book_name_english' => $request['book_name_english'],
                'book_name_hindi' => $request['book_name_hindi'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function BookList():Array
   {
     $BookList = [
         'BookList' => Book::all()->toArray(),
     ];

     return $BookList;
   }

   public function updateBook($request)
   {
        //dd($request);
        $book=Book::where('id', $request->id)->first();

        $book->book_name_english = $request['book_name_english'];
        $book->book_name_hindi = $request['book_name_hindi'];
        $book->is_active = $request['is_active'];
        $book->save(); // Save changes to the database

        return $book;
   }

   public function deleteBook($id)
   {
     $book = Book::find($id);
     
     return $book->delete();
     //dd($id);
     //return false;
   }
}