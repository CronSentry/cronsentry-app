function StatusBadge({ status }) {
    const styles = {
        Healthy: "bg-green-50 text-green-800 border border-green-200",
        Down: "bg-red-50 text-red-800 border border-red-200",
        Waiting: "bg-gray-100 text-gray-600 border border-gray-200",
        Late: "bg-amber-50 text-amber-800 border border-amber-200",
    };

    const labels = {
        Healthy: "Healthy",
        Down: "Down",
        Waiting: "Waiting",
        Late: "Late",
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