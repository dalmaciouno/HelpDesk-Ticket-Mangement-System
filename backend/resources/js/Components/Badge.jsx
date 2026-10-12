const PRIORITY = {
    Low: 'bg-gray-100 text-gray-700 ring-gray-500/20',
    Medium: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    High: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    Urgent: 'bg-red-50 text-red-700 ring-red-600/20',
};

const STATUS = {
    Open: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    'In Progress': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    Resolved: 'bg-green-50 text-green-700 ring-green-600/20',
    Closed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

function Pill({ classes, children }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}>
            {children}
        </span>
    );
}

export function PriorityBadge({ value }) {
    return <Pill classes={PRIORITY[value] ?? PRIORITY.Low}>{value}</Pill>;
}

export function StatusBadge({ value }) {
    return <Pill classes={STATUS[value] ?? STATUS.Closed}>{value}</Pill>;
}