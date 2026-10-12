import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TicketForm from '@/Components/TicketForm';

export default function Create({ options }) {
    return (
        <AuthenticatedLayout header={<h1 className="text-xl font-semibold text-gray-800">New Ticket</h1>}>
            <Head title="New Ticket" />
            <div className="mx-auto max-w-3xl">
                <TicketForm options={options} />
            </div>
        </AuthenticatedLayout>
    );
}