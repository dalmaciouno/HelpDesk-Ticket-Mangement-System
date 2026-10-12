<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user   = $request->user();
        $counts = $user->tickets()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $stats = ['Total' => $counts->sum()];
        foreach (Ticket::STATUSES as $status) {
            $stats[$status] = (int) ($counts[$status] ?? 0);
        }

        return Inertia::render('Dashboard', [
            'stats'  => $stats,
            'recent' => $user->tickets()->latest()->limit(5)->get(),
        ]);
    }
}