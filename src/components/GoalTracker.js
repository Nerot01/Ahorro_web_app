const GoalTracker = ({ goals, onAddGoal, onDeposit, onDeleteGoal, onEditGoal }) => {
    const [isAdding, setIsAdding] = React.useState(false);

    // Add State
    const [newGoalName, setNewGoalName] = React.useState('');
    const [newGoalTarget, setNewGoalTarget] = React.useState('');
    const [newGoalEmoji, setNewGoalEmoji] = React.useState('🎯');

    // Edit State
    const [editingGoal, setEditingGoal] = React.useState(null);
    const [editName, setEditName] = React.useState('');
    const [editTarget, setEditTarget] = React.useState('');

    // Deposit Modal State
    const [depositGoal, setDepositGoal] = React.useState(null);
    const [depositAmount, setDepositAmount] = React.useState('');

    const formatMoney = (val) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        onAddGoal({
            name: newGoalName,
            target: parseInt(newGoalTarget),
            current: 0,
            emoji: newGoalEmoji
        });
        setIsAdding(false);
        setNewGoalName('');
        setNewGoalTarget('');
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingGoal) return;

        onEditGoal(editingGoal.id, {
            name: editName,
            target: parseInt(editTarget)
        });
        setEditingGoal(null);
    };

    const startEditing = (e, goal) => {
        e.stopPropagation(); // Stop click from triggering deposit
        setEditingGoal(goal);
        setEditName(goal.name);
        setEditTarget(goal.target);
    };

    const handleDelete = (e, goalId) => {
        e.stopPropagation();
        if (window.confirm("¿Seguro que quieres eliminar esta meta?")) {
            onDeleteGoal(goalId);
        }
    };

    const handleDepositSubmit = (e) => {
        e.preventDefault();
        if (!depositGoal || !depositAmount) return;
        onDeposit(depositGoal.id, parseInt(depositAmount));
        setDepositGoal(null);
        setDepositAmount('');
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-stone-700 flex items-center gap-2">
                    <span>🎯</span> Metas de Ahorro
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs bg-stone-100 hover:bg-lilac hover:text-indigo-900 px-3 py-1 rounded-full font-bold transition-all"
                >
                    {isAdding ? 'Cancelar' : '+ Nueva'}
                </button>
            </div>

            {/* Add Goal Form */}
            {isAdding && (
                <form onSubmit={handleAddSubmit} className="mb-6 bg-stone-50 p-4 rounded-2xl animate-fade-in">
                    <div className="flex gap-2 mb-2">
                        <select
                            value={newGoalEmoji}
                            onChange={e => setNewGoalEmoji(e.target.value)}
                            className="bg-white p-2 rounded-xl text-xl w-14"
                        >
                            {['🎯', '🚗', '🏖️', '🏠', '💍', '💻', '🎮'].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Nombre (ej: Auto)"
                            value={newGoalName}
                            onChange={e => setNewGoalName(e.target.value)}
                            className="flex-1 p-2 rounded-xl border-none outline-none"
                            required
                        />
                    </div>
                    <input
                        type="number"
                        placeholder="Monto Objetivo ($)"
                        value={newGoalTarget}
                        onChange={e => setNewGoalTarget(e.target.value)}
                        className="w-full p-2 rounded-xl border-none outline-none mb-2"
                        required
                    />
                    <button type="submit" className="w-full bg-stone-800 text-white font-bold py-2 rounded-xl text-sm">Crear Meta</button>
                </form>
            )}

            {/* Edit Goal Form (Modal-ish) */}
            {editingGoal && (
                <div className="mb-6 bg-orange-50 p-4 rounded-2xl border border-orange-100 animate-fade-in">
                    <p className="text-xs font-bold text-orange-800 mb-2">Editar: {editingGoal.name}</p>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full p-2 rounded-xl border-none outline-none mb-2 text-sm"
                            placeholder="Nombre"
                        />
                        <input
                            type="number"
                            value={editTarget}
                            onChange={e => setEditTarget(e.target.value)}
                            className="w-full p-2 rounded-xl border-none outline-none mb-2 text-sm"
                            placeholder="Monto"
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="bg-orange-400 text-white font-bold px-4 py-1 rounded-xl text-sm">Guardar</button>
                            <button type="button" onClick={() => setEditingGoal(null)} className="bg-stone-200 text-stone-500 font-bold px-3 py-1 rounded-xl text-sm">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Deposit Modal (Inline) */}
            {depositGoal && (
                <div className="mb-6 bg-green-50 p-4 rounded-2xl border border-green-100 animate-fade-in">
                    <p className="text-xs font-bold text-green-800 mb-2">Abonar a: {depositGoal.name}</p>
                    <form onSubmit={handleDepositSubmit} className="flex gap-2">
                        <input
                            type="number"
                            autoFocus
                            placeholder="Monto a abonar"
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            className="flex-1 p-2 rounded-xl border-none outline-none text-sm"
                            required
                        />
                        <button type="submit" className="bg-green-500 text-white font-bold px-4 rounded-xl text-sm">✓</button>
                        <button type="button" onClick={() => setDepositGoal(null)} className="bg-stone-200 text-stone-500 font-bold px-3 rounded-xl text-sm">✕</button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {goals.map((goal) => {
                    const progress = Math.min(100, (goal.current / goal.target) * 100);

                    return (
                        <div key={goal.id || Math.random()} className="cursor-pointer group relative" onClick={() => setDepositGoal(goal)}>
                            <div className="flex justify-between items-end mb-1">
                                <span className="font-medium text-stone-600 flex items-center gap-1">
                                    {goal.emoji} {goal.name}
                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-green-100 text-green-800 px-1 rounded ml-1 transition-opacity">Abonar</span>
                                </span>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-stone-400">
                                        {formatMoney(goal.current)} / {formatMoney(goal.target)}
                                    </span>
                                    {/* Action Buttons */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => startEditing(e, goal)} className="text-xs p-1 hover:bg-orange-100 rounded text-orange-400">✏️</button>
                                        <button onClick={(e) => handleDelete(e, goal.id)} className="text-xs p-1 hover:bg-red-100 rounded text-red-400">🗑️</button>
                                    </div>
                                </div>
                            </div>

                            <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-gradient-to-r from-soft-pink to-lilac rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            {/* Encouragement Text */}
                            <p className="text-xs text-right mt-1 text-stone-400 font-medium">
                                {progress >= 100 ? '¡Completada! 🎉' : `${progress.toFixed(0)}% listo`}
                            </p>
                        </div>
                    );
                })}

                {goals.length === 0 && !isAdding && (
                    <p className="text-center text-stone-400 py-4 text-sm italic">
                        No hay metas. ¡Crea una arriba! 👆
                    </p>
                )}
            </div>
        </div>
    );
};

window.GoalTracker = GoalTracker;
