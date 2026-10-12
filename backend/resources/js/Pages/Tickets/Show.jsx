import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PriorityBadge, StatusBadge } from '@/Components/Badge';

export default function Show({ ticket }) {
    function destroy() {
        if (confirm('Delete this ticket? This cannot be undone.')) {
            router.delete(route('tickets.destroy', ticket.id));
        }
    }

    return (
        <AuthenticatedLayout header={<h1 className="text-xl font-semibold text-gray-800">Ticket #{ticket.id}</h1>}>
            <Head title={ticket.title} />

            <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="break-words text-2xl font-bold text-gray-900">{ticket.title}</h2>
                    <div className="flex shrink-0 gap-2">
                        <PriorityBadge value={ticket.priority} />
                        <StatusBadge value={ticket.status} />
                    </div>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div><dt className="text-gray-500">Category</dt><dd className="font-medium text-gray-900">{ticket.category}</dd></div>
                    <div><dt className="text-gray-500">Created</dt><dd className="font-medium text-gray-900">{new Date(ticket.created_at).toLocaleString()}</dd></div>
                    <div><dt className="text-gray-500">Last updated</dt><dd className="font-medium text-gray-900">{new Date(ticket.updated_at).toLocaleString()}</dd></div>
                </dl>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-500">Description</h3>
                    <p className="mt-1 whitespace-pre-wrap break-words text-gray-800">{ticket.description}</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Link href={route('tickets.index')} className="text-sm text-gray-600 hover:underline">← Back to tickets</Link>
                    <div className="flex gap-3">
                        <Link href={route('tickets.edit', ticket.id)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                            Edit
                        </Link>
                        <button onClick={destroy}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}