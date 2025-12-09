const AddTransaction = ({ onAddTransaction }) => {
    const [amount, setAmount] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [pocket, setPocket] = React.useState('us');
    const [type, setType] = React.useState('expense'); // expense | income
    const [emoji, setEmoji] = React.useState('🍔');

    const emojis = ['🍔', '🛒', '🎬', '⛽', '🏠', '🎁', '💊', '✈️', '💰', '💼'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        onAddTransaction({
            amount: parseInt(amount),
            description,
            pocket,
            type,
            emoji,
            date: new Date()
        });

        // Reset form
        setAmount('');
        setDescription('');
        // Keep pocket/emoji for convenience or reset? Let's keep.
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h2 className="text-xl font-bold text-stone-700 mb-6">Nuevo Movimiento 📝</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Type Toggle */}
                <div className="flex bg-stone-100 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === 'expense' ? 'bg-white text-red-400 shadow-sm' : 'text-stone-400'}`}
                    >
                        Gasto 💸
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === 'income' ? 'bg-white text-green-400 shadow-sm' : 'text-stone-400'}`}
                    >
                        Ingreso 💵
                    </button>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Monto</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full text-2xl font-bold p-3 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-lilac text-stone-700 placeholder-stone-300 outline-none"
                    />
                </div>

                {/* Pocket Selector */}
                <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Bolsillo</label>
                    <div className="flex gap-2">
                        {[
                            { id: 'me', label: '[tu nombre]', color: 'bg-mint' },
                            { id: 'her', label: '[su nombre]', color: 'bg-soft-pink' },
                            { id: 'us', label: 'Nosotros', color: 'bg-lilac' }
                        ].map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setPocket(p.id)}
                                className={`flex-1 py-2 rounded-xl text-sm transition-all border-2 ${pocket === p.id ? `border-stone-800 font-bold opacity-100` : 'border-transparent opacity-50 bg-stone-100'}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description & Emoji */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Detalle</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Sushi"
                            className="w-full p-3 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-lilac text-stone-700 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1 ml-1">Icono</label>
                        <select
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            className="p-3 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-lilac text-2xl appearance-none outline-none cursor-pointer hover:bg-stone-100"
                        >
                            {emojis.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold hover:bg-stone-700 transform active:scale-95 transition-all mt-4"
                >
                    {type === 'expense' ? 'Registrar Gasto' : 'Agregar Ingreso'}
                </button>
            </form>
        </div>
    );
};

window.AddTransaction = AddTransaction;
