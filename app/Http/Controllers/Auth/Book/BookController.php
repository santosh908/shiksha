<?php

namespace App\Http\Controllers\Auth\Book;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookStore\BookStoreRequest;
use App\Services\BookServices\BookServices;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;

class BookController extends Controller
{
    protected $BookServices;

    public function __construct()
    {
        $this->BookServices = new BookServices();
    }
    
    public function bookList()
    {   
        $list = $this->BookServices->BookList();
        return Inertia::render('SuperAdmin/book', $list);
    }

    public function bookStore(BookStoreRequest $request):RedirectResponse
    {
        $data= $request->validated();
        $bookinfo =  $this->BookServices->createBook($request);
        return redirect()->route('Action.BookStore') 
                     ->with('success', 'Book Details Saved Successfully!')
                     ->with('savedData', $bookinfo);
    }

    public function destroy($id): RedirectResponse
    {
        $bookinfo = $this->BookServices->deleteBook($id);
        if($bookinfo)
        {
            return redirect()->back()->with('success', 'Book deleted successfully');
        }
        else{
            return redirect()->back()->with('error', 'Book not found or could not be deleted');
        }
    }

    public function update(BookStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $bookinfo = $this->BookServices->updateBook($request);
        return redirect()->route('Action.book')->with('success', 'Book updated successfully!');
    }
}
