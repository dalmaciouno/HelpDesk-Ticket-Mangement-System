<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // The User model casts 'password' => 'hashed', so pass plain text here.
        $demo = User::updateOrCreate(
            ['email' => 'demo@helpdesk.test'],
            ['name' => 'Demo User', 'password' => 'Demo@12345']
        );

        if ($demo->tickets()->count() === 0) {
            $samples = [
                ['Printer on 2nd floor offline', 'The shared printer shows offline for everyone since morning.', 'High', 'Open', 'Hardware'],
                ['Cannot access VPN', 'VPN client throws a timeout error when connecting from home.', 'Urgent', 'In Progress', 'Network'],
                ['Install Adobe Reader', 'Need Adobe Reader installed on the accounting workstation.', 'Low', 'Resolved', 'Software'],
            ];

            foreach ($samples as [$title, $desc, $priority, $status, $category]) {
                $demo->tickets()->create([
                    'title' => $title, 'description' => $desc,
                    'priority' => $priority, 'status' => $status, 'category' => $category,
                ]);
            }
        }
    }
}