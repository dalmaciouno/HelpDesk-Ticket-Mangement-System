import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { PriorityBadge, StatusBadge } from '@/Components/Badge';

export default function Index({ tickets, filters, options }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [priority, setPriority] = useState(filters.priority ?? '');
    const first = useRef(true);

    // Debounced filtering without a full page reload
    useEffect(() => {
        if (first.current) { first.current = false; return; }
        const t = setTimeout(() => {
            router.get(route('tickets.index'), { search, status, priority }, {
                preserveState: true, replace: true,
            });
        }, 300);
        return () => clearTimeout(t);
    }, [search, status, priority]);

    function destroy(ticket) {
        if (confirm(`Delete "${ticket.title}"? This cannot be undone.`)) {
            router.delete(route('tickets.destroy', ticket.id), { preserveScroll: true });
        }
    }

    const input = 'rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500';
    const hasFilters = search || status || priority;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">My Tickets</h1>
                    <Link href={route('tickets.create')}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                        + New Ticket
                    </Link>
                </div>
            }
        >
            <Head title="Tickets" />

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input type="search" placeholder="Search title…" value={search}
                    onChange={(e) => setSearch(e.target.value)} className={input} />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                    <option value="">All statuses</option>
                    {options.statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={input}>
                    <option value="">All priorities</option>
                    {options.priorities.map((p) => <option key={p}>{p}</option>)}
                </select>
            </div>

            {tickets.data.length === 0 ? (
                <div className="rounded-lg bg-white p-10 text-center shadow">
                    <p className="text-lg font-semibold text-gray-800">
                        {hasFilters ? 'No tickets match your filters.' : 'No tickets yet'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {hasFilters ? 'Try changing or clearing the filters.' : 'Create your first ticket to get started.'}
                    </p>
                    {!hasFilters && (
                        <Link href={route('tickets.create')}
                            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                            Create a ticket
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {tickets.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            <Link href={route('tickets.show', t.id)} className="hover:underline">{t.title}</Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{t.category}</td>
                                        <td className="px-4 py-3"><PriorityBadge value={t.priority} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="space-x-3 px-4 py-3 text-right">
                                            <Link href={route('tickets.show', t.id)} className="text-indigo-600 hover:underline">View</Link>
                                            <Link href={route('tickets.edit', t.id)} className="text-indigo-600 hover:underline">Edit</Link>
                                            <button onClick={() => destroy(t)} className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="space-y-3 md:hidden">
                        {tickets.data.map((t) => (
                            <div key={t.id} className="rounded-lg bg-white p-4 shadow">
                                <Link href={route('tickets.show', t.id)} className="font-semibold text-gray-900">{t.title}</Link>
                                <p className="mt-1 text-xs text-gray-500">
                                    {t.category} · {new Date(t.created_at).toLocaleDateString()}
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <PriorityBadge value={t.priority} />
                                    <StatusBadge value={t.status} />
                                </div>
                                <div className="mt-3 flex gap-4 text-sm">
                                    <Link href={route('tickets.show', t.id)} className="text-indigo-600">View</Link>
                                    <Link href={route('tickets.edit', t.id)} className="text-indigo-600">Edit</Link>
                                    <button onClick={() => destroy(t)} className="text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination paginator={tickets} />
                </>
            )}
        </AuthenticatedLayout>
    );
}