<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $tickets = $request->user()->tickets()
            ->when($request->filled('search'), fn ($q) =>
                $q->where('title', 'like', '%' . $request->input('search') . '%'))
            ->when(in_array($request->input('status'), Ticket::STATUSES, true), fn ($q) =>
                $q->where('status', $request->input('status')))
            ->when(in_array($request->input('priority'), Ticket::PRIORITIES, true), fn ($q) =>
                $q->where('priority', $request->input('priority')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only('search', 'status', 'priority'),
            'options' => Ticket::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Tickets/Create', ['options' => Ticket::options()]);
    }

    public function store(StoreTicketRequest $request): RedirectResponse
    {
        // user_id is set by the relationship from the authenticated user, never from the form.
        $ticket = $request->user()->tickets()->create($request->validated());

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket created.');
    }

    public function show(Ticket $ticket): Response
    {
        Gate::authorize('view', $ticket);

        return Inertia::render('Tickets/Show', ['ticket' => $ticket]);
    }

    public function edit(Ticket $ticket): Response
    {
        Gate::authorize('update', $ticket);

        return Inertia::render('Tickets/Edit', [
            'ticket'  => $ticket,
            'options' => Ticket::options(),
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $ticket->update($request->validated());

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket updated.');
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        Gate::authorize('delete', $ticket);

        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted.');
    }
}