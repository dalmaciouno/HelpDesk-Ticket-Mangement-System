import { Link } from '@inertiajs/react';

export default function Pagination({ paginator }) {
    if (paginator.last_page <= 1) return null;

    const base = 'rounded-md border px-3 py-1.5 text-sm font-medium';
    const active = 'bg-white text-gray-700 hover:bg-gray-50';
    const disabled = 'cursor-not-allowed bg-gray-100 text-gray-400';

    return (
        <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
            {paginator.prev_page_url ? (
                <Link href={paginator.prev_page_url} preserveScroll className={`${base} ${active}`}>Previous</Link>
            ) : (
                <span className={`${base} ${disabled}`}>Previous</span>
            )}

            <span className="text-sm text-gray-600">
                Page {paginator.current_page} of {paginator.last_page}
            </span>

            {paginator.next_page_url ? (
                <Link href={paginator.next_page_url} preserveScroll className={`${base} ${active}`}>Next</Link>
            ) : (
                <span className={`${base} ${disabled}`}>Next</span>
            )}
        </nav>
    );
}