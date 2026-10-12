import { Link, useForm } from '@inertiajs/react';

const field = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

function Error({ message }) {
    return message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;
}

export default function TicketForm({ ticket, options }) {
    const isEdit = Boolean(ticket);

    const { data, setData, post, put, processing, errors } = useForm({
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        priority: ticket?.priority ?? 'Medium',
        status: ticket?.status ?? 'Open',
        category: ticket?.category ?? options.categories[0],
    });

    function submit(e) {
        e.preventDefault();
        // useForm keeps the input after a failed submit automatically.
        isEdit ? put(route('tickets.update', ticket.id)) : post(route('tickets.store'));
    }

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form onSubmit={submit} className="space-y-5 rounded-lg bg-white p-4 shadow sm:p-6">
            {hasErrors && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                    Please fix the errors below and try again.
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input id="title" type="text" className={field} value={data.title}
                    onChange={(e) => setData('title', e.target.value)} maxLength={255} />
                <Error message={errors.title} />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={5} className={field} value={data.description}
                    onChange={(e) => setData('description', e.target.value)} />
                <Error message={errors.description} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select id="priority" className={field} value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}>
                        {options.priorities.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <Error message={errors.priority} />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" className={field} value={data.status}
                        onChange={(e) => setData('status', e.target.value)}>
                        {options.statuses.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <Error message={errors.status} />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="category" className={field} value={data.category}
                        onChange={(e) => setData('category', e.target.value)}>
                        {options.categories.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <Error message={errors.category} />
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link href={route('tickets.index')}
                    className="rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <button type="submit" disabled={processing}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                    {processing ? 'Saving…' : isEdit ? 'Update Ticket' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
}