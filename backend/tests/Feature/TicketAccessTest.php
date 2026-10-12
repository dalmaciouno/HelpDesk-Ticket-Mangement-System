<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketAccessTest extends TestCase
{
    use RefreshDatabase;

    private function makeTicket(User $owner): Ticket
    {
        return $owner->tickets()->create([
            'title'       => 'Broken monitor',
            'description' => 'Screen flickers constantly.',
            'priority'    => 'High',
            'status'      => 'Open',
            'category'    => 'Hardware',
        ]);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/tickets')->assertRedirect('/login');
        $this->get('/tickets/create')->assertRedirect('/login');
    }

    public function test_owner_can_view_and_delete_their_ticket(): void
    {
        $user   = User::factory()->create();
        $ticket = $this->makeTicket($user);

        $this->actingAs($user)->get("/tickets/{$ticket->id}")->assertOk();
        $this->actingAs($user)->delete("/tickets/{$ticket->id}")->assertRedirect('/tickets');
        $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    }

    public function test_another_user_gets_403_on_view_edit_update_delete(): void
    {
        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $ticket   = $this->makeTicket($owner);

        $this->actingAs($intruder)->get("/tickets/{$ticket->id}")->assertForbidden();
        $this->actingAs($intruder)->get("/tickets/{$ticket->id}/edit")->assertForbidden();
        $this->actingAs($intruder)->put("/tickets/{$ticket->id}", [
            'title'       => 'Hacked title',
            'description' => 'Trying to overwrite it.',
            'priority'    => 'Low',
            'status'      => 'Open',
            'category'    => 'Other',
        ])->assertForbidden();
        $this->actingAs($intruder)->delete("/tickets/{$ticket->id}")->assertForbidden();
    }

    public function test_validation_rejects_invalid_values(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/tickets', [
            'title'       => 'abc',
            'description' => 'short',
            'priority'    => 'Critical',
            'status'      => 'Done',
            'category'    => 'Magic',
        ])->assertSessionHasErrors(['title', 'description', 'priority', 'status', 'category']);
    }
}