<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Book = Book::create([
            'book_name_english'=>'Beyond Birth and Death',
            'book_name_hindi'=>'जन्म और मृत्यु से परे',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Raja Vidya',
            'book_name_hindi'=>'राज विद्या',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Matchless Gift',
            'book_name_hindi'=>'अतुलनीय उपहार',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Krishna Book',
            'book_name_hindi'=>'कृष्णा पुस्तक',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Bhagvat Gita As It Is',
            'book_name_hindi'=>'',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Srilla Prabhupada',
            'book_name_hindi'=>'श्रीला प्रभुपाद',
        ]);
        $Book = Book::create([
            'book_name_english'=>'SB Canto 1',
            'book_name_hindi'=>'',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Teaching of Lord Chaitanya',
            'book_name_hindi'=>'भगवान चैतन्य की शिक्षा',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Nectar of Instruction',
            'book_name_hindi'=>'उपदेश का अमृत',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Sri Isopanisad',
            'book_name_hindi'=>'श्री इसोपनिषद्',
        ]);
        $Book = Book::create([
            'book_name_english'=>'Science of Self Realization',
            'book_name_hindi'=>'आत्मबोध का विज्ञान',
        ]);
        $Book = Book::create([
            'book_name_english'=>'None',
            'book_name_hindi'=>'',
        ]);
    }
}
