<?php

namespace App\Services\DevoteeDashboard;
use App\Models\User;
use App\Models\RaiseQuery\RaiseQuery;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DevoteeDashboardService
{
    public function showmessage($request, $loginId)
    {
        if ($request->has('query_id')) {
            // Get complete chat history for the query_id including both user and SuperAdmin messages
            $chatHistory = RaiseQuery::where('raise_queries.query_id', '=', $request->query_id)
                ->leftJoin('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'raise_queries.id',
                    'raise_queries.description as content',
                    DB::raw('CASE 
                        WHEN raise_queries.from_id = "SuperAdmin" THEN "SuperAdmin"
                        ELSE users.name 
                    END as sender'),
                    'raise_queries.from_id as senderId',
                    'raise_queries.created_at as timestamp',
                    DB::raw('CASE WHEN raise_queries.from_id = ? THEN true ELSE false END as isOutgoing'),
                    'raise_queries.query_id'
                )
                ->addBinding($loginId, 'select')
                ->orderBy('raise_queries.created_at', 'asc')
                ->get();

            // Get all messages for the table view
            $messages = RaiseQuery::join('users', 'users.login_id', '=', 'raise_queries.from_id')
                ->select(
                    'users.name',
                    'users.devotee_type',
                    'raise_queries.*'
                )
                ->where(function ($query) use ($loginId) {
                    $query->where('raise_queries.from_id', $loginId)
                        ->orWhere('raise_queries.to_id', $loginId);
                })
                ->orderBy('raise_queries.id', 'desc')
                ->get();

            return [
                'messages' => $messages,
                'chatHistory' => $chatHistory
            ];
        }

        // If no query_id, just return initial messages for the table
        return RaiseQuery::join('users', 'users.login_id', '=', 'raise_queries.from_id')
            ->select(
                'users.name',
                'users.devotee_type',
                'raise_queries.*'
            )
            ->where(function ($query) use ($loginId) {
                $query->where('raise_queries.from_id', $loginId)
                    ->orWhere('raise_queries.to_id', $loginId);
            })
            ->orderBy('raise_queries.id', 'desc')
            ->get();
    }

    public function storemessage($request)
    {
        $qID=0;
        if ($request->has('query_id'))
        {
            $qID=$request->query_id;
        }
        else{
            $qID='QRY-' . time() . '-' . rand(1000, 9999);
        }
        $messageData = [
            'subject' => $request->subject,
            'description' => $request->description,
            'from_id' => $request->from_id,
            'to_id' => 'SuperAdmin',
            'query_id' => $qID,
            'is_viewed' => false
        ];
        
        $message = RaiseQuery::create($messageData);

        // Return complete updated chat history
        $queryList = RaiseQuery::where('raise_queries.query_id', '=', $qID)
            ->leftJoin('users', 'users.login_id', '=', 'raise_queries.from_id')
            ->select(
                'raise_queries.id',
                'raise_queries.description as content',
                DB::raw('CASE 
                    WHEN raise_queries.from_id = "SuperAdmin" THEN "SuperAdmin"
                    ELSE users.name 
                END as sender'),
                'raise_queries.from_id as senderId',
                'raise_queries.created_at as timestamp',
                DB::raw('CASE WHEN raise_queries.from_id = ? THEN true ELSE false END as isOutgoing'),
                'raise_queries.query_id'
            )
            ->addBinding($request->from_id, 'select')
            ->orderBy('raise_queries.created_at', 'asc')
            ->get();
            return  $queryList;
    }
}