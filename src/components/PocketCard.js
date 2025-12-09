const PocketCard = ({ title, amount, color, icon, description }) => {
    // Determine gradient/color classes based on the prop
    const colorClasses = {
        'pink': 'bg-soft-pink text-pink-800',
        'lilac': 'bg-lilac text-indigo-900',
        'mint': 'bg-mint text-green-900',
    };

    const theme = colorClasses[color] || 'bg-white';

    // Helper to format currency
    const formatMoney = (val) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
    };

    return (
        <div className={`p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${theme} flex flex-col justify-between h-48 relative overflow-hidden group`}>
            {/* Decorative circle */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 rounded-full group-hover:scale-125 transition-transform duration-500"></div>

            <div className="z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
                </div>
                <p className="text-xs opacity-70 mb-4">{description}</p>
            </div>

            <div className="z-10">
                <span className="text-3xl font-bold tracking-tight">{formatMoney(amount)}</span>
            </div>
        </div>
    );
};

window.PocketCard = PocketCard; // Expose to global scope for Babel
