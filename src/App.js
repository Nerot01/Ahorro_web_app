const App = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [transactions, setTransactions] = React.useState([]);
    const [goals, setGoals] = React.useState([]);
    const [pockets, setPockets] = React.useState({ me: 0, her: 0, us: 0 });

    const ALLOWED_EMAILS = [
        'usuario1@gmail.com',
        'usuario2@gmail.com'
    ];

    // Auth Listener
    React.useEffect(() => {
        const initAuth = () => {
            const auth = window.auth;
            if (!auth) return false;

            const unsubscribe = auth.onAuthStateChanged((u) => {
                setUser(u);
                setLoading(false);
            });
            return unsubscribe;
        };

        let cleanup = initAuth();
        let interval;
        if (!cleanup) {
            interval = setInterval(() => {
                cleanup = initAuth();
                if (cleanup) clearInterval(interval);
            }, 500);
        }

        return () => {
            if (cleanup && typeof cleanup === 'function') cleanup();
            if (interval) clearInterval(interval);
        };
    }, []);

    // Data Listener
    React.useEffect(() => {
        if (!user || !ALLOWED_EMAILS.includes(user.email)) return;
        const db = window.db;
        if (!db) return;

        // 1. Transactions Listener
        const unsubTx = db.collection('transactions').onSnapshot(snapshot => {
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })); // Include ID for deletion

            let newPockets = { me: 0, her: 0, us: 0 };
            docs.forEach(tx => {
                const val = parseInt(tx.amount) || 0;
                const p = ['me', 'her', 'us'].includes(tx.pocket) ? tx.pocket : 'us';
                if (tx.type === 'income') newPockets[p] += val;
                else newPockets[p] -= val;
            });

            setPockets(newPockets);
            setTransactions(docs.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)));
        });

        // 2. Goals Listener
        const unsubGoals = db.collection('goals').onSnapshot(snapshot => {
            const goalsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setGoals(goalsData);
        });

        return () => {
            unsubTx();
            unsubGoals();
        };
    }, [user]);

    // Handlers
    const handleLogin = async () => {
        try {
            await window.auth.signInWithPopup(window.googleProvider);
        } catch (e) {
            alert(e.message);
        }
    };

    // --- Transaction Handlers ---
    const handleAddTransaction = (newTx) => {
        const db = window.db;
        if (!db) return;

        const txWithUser = {
            ...newTx,
            createdBy: user.email,
            createdAt: new Date()
        };

        db.collection('transactions').add(txWithUser)
            .catch((error) => alert(`Error: ${error.message}`));
    };

    const handleDeleteTransaction = (id) => {
        if (!window.confirm("¿Eliminar este movimiento?")) return;
        const db = window.db;
        db.collection('transactions').doc(id).delete()
            .catch(err => alert("Error al eliminar: " + err.message));
    };

    // --- Goal Handlers ---
    const handleAddGoal = (goalData) => {
        const db = window.db;
        db.collection('goals').add({
            ...goalData,
            createdAt: new Date(),
            createdBy: user.email
        });
    };

    const handleDeleteGoal = (id) => {
        const db = window.db;
        db.collection('goals').doc(id).delete();
    };

    const handleEditGoal = (id, updates) => {
        const db = window.db;
        db.collection('goals').doc(id).update(updates);
    };

    const handleDepositToGoal = (goalId, amount) => {
        const db = window.db;
        const goalRef = db.collection('goals').doc(goalId);

        db.runTransaction((transaction) => {
            return transaction.get(goalRef).then((sfDoc) => {
                if (!sfDoc.exists) throw "Meta no existe";
                const newCurrent = (sfDoc.data().current || 0) + amount;
                transaction.update(goalRef, { current: newCurrent });
            });
        }).catch((err) => console.error("Error deposit", err));
    };

    // Render
    if (loading) return <div className="min-h-screen grid place-items-center bg-cream">Cargando... 🐣</div>;

    if (!user) {
        return (
            <div className="min-h-screen grid place-items-center bg-cream px-4">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm w-full">
                    <div className="text-6xl mb-4">🔐</div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-2">Acceso Privado</h1>
                    <button onClick={handleLogin} className="w-full py-3 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700 transition-all">Entrar con Google</button>
                </div>
            </div>
        );
    }

    if (!ALLOWED_EMAILS.includes(user.email)) {
        return (
            <div className="min-h-screen grid place-items-center bg-cream px-4">
                <div className="text-center p-8 bg-white border-2 border-red-100 rounded-3xl">
                    <h1 className="text-xl font-bold text-red-500">Acceso Denegado</h1>
                    <p className="mb-4">{user.email}</p>
                    <button onClick={() => { window.auth.signOut(); window.location.reload(); }} className="text-sm underline">Salir</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-sans pb-12">
            <header className="px-6 pt-8 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">Hola, {user.displayName?.split(' ')[0]} 👋 <span className="text-xs text-stone-400">(v2.4)</span></h1>
                        <p className="text-stone-500 text-sm">Ahorro para nuestro futuro 🌌</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.auth.signOut()}
                            className="text-xs bg-stone-200 hover:bg-red-100 hover:text-red-600 px-3 py-1 rounded-full font-bold transition-all"
                        >
                            Salir
                        </button>
                        <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                    </div>
                </div>
                <div className="bg-stone-800 rounded-3xl p-6 text-white shadow-lg shadow-stone-200 mb-8 relative overflow-hidden">
                    <p className="text-stone-400 text-sm mb-1 uppercase tracking-wider">Total Ahorrado</p>
                    <h2 className="text-4xl font-bold">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(pockets.me + pockets.her + pockets.us)}
                    </h2>
                </div>
            </header>

            <main className="px-6 space-y-8">
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <PocketCard title="Ahorro [tu nombre]" amount={pockets.me} color="mint" icon="🐈‍⬛" description="Personal" />
                        <PocketCard title="Ahorro [su nombre]" amount={pockets.her} color="soft-pink" icon="🐈" description="Personal" />
                        <PocketCard title="Nosotros" amount={pockets.us} color="lilac" icon="🏠" description="Gastos y Citas" />
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GoalTracker
                        goals={goals}
                        onAddGoal={handleAddGoal}
                        onDeposit={handleDepositToGoal}
                        onDeleteGoal={handleDeleteGoal}
                        onEditGoal={handleEditGoal}
                    />
                    <AddTransaction onAddTransaction={handleAddTransaction} />
                </div>

                {transactions.length > 0 && (
                    <section>
                        <h3 className="font-bold text-stone-700 mb-4 px-2">Últimos Movimientos</h3>
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100">
                            {transactions.map((tx, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border-b border-stone-50 last:border-0 group">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl bg-stone-50 w-10 h-10 rounded-full flex items-center justify-center">{tx.emoji}</div>
                                        <div>
                                            <p className="font-bold text-sm text-stone-700">{tx.description}</p>
                                            <p className="text-xs text-stone-400 capitalize">{tx.pocket === 'me' ? '[tu nombre]' : tx.pocket === 'her' ? '[su nombre]' : 'Nuestro'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteTransaction(tx.id)}
                                            className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-opacity"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
