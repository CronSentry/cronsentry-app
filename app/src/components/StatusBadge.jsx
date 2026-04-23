function StatusBadge({ status }) {
    const styles = {
        HEALTHY: "bg-green-50 text-green-800 border border-green-200",
        DOWN: "bg-red-50 text-red-800 border border-red-200",
        WAITING: "bg-gray-100 text-gray-600 border border-gray-200",
        LATE: "bg-amber-50 text-amber-800 border border-amber-200",
    };

    const labels = {
        HEALTHY: "Healthy",
        DOWN: "Down",
        WAITING: "Waiting",
        LATE: "Late",
    };

    const style = styles[status] || styles.WAITING;
    const label = labels[status] || status;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {label}
        </span>
    );
}

export default StatusBadge;