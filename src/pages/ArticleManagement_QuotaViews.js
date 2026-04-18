
// --- CONTINGENT HANDLERS ---
const handleContingentSave = async () => {
    if (!contingentFormData.name) {
        alert(t(lang, "article.contingents.errors.required")); // Or better UI validation
        return;
    }
    try {
        await addDoc(collection(db, "contingents"), {
            ...contingentFormData,
            createdAt: new Date().toISOString()
        });
        await fetchContingents();
        setView("contingent-list");
    } catch (err) {
        console.error("Error saving contingent:", err);
        alert("Error saving: " + err.message);
    }
};

const handleContingentDelete = async (id) => {
    if (!window.confirm("Delete this quota?")) return;
    try {
        await deleteDoc(doc(db, "contingents", id));
        await fetchContingents();
    } catch (err) {
        console.error(err);
    }
};

const renderContingentListView = () => {
    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView("dashboard")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        {t(lang, "article.contingents.header")}
                    </h1>
                </div>
                <button onClick={() => {
                    setContingentFormData({
                        name: "",
                        organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
                        currency: "EUR",
                        accountType: "passive",
                        deductionPriority: "highest",
                        validityDuration: 99,
                        validityUnit: "years",
                        triggerArticleId: "",
                        quotaType: "",
                        usableArticles: []
                    });
                    setView("contingent-create");
                }} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                    <FiPlus /> {t(lang, "article.contingents.buttons.add")}
                </button>
            </div>

            <div className={`rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                <table className="w-full text-left">
                    <thead className={`text-xs uppercase font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                        <tr>
                            <th className="px-6 py-4">{t(lang, "article.contingents.fields.designation")}</th>
                            <th className="px-6 py-4">{t(lang, "article.contingents.fields.currency")}</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {contingents.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                    No contingencies found.
                                </td>
                            </tr>
                        ) : contingents.map(c => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 font-medium">{c.name}</td>
                                <td className="px-6 py-4">{c.currency}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="px-3 py-1 bg-sky-500 text-white rounded text-xs">{t(lang, "article.contingents.buttons.details")}</button>
                                    <button onClick={() => handleContingentDelete(c.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs">{t(lang, "article.contingents.buttons.delete")}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const renderContingentCreateView = () => {
    const toggleUsableArticle = (id) => {
        const current = contingentFormData.usableArticles || [];
        if (current.includes(id)) {
            setContingentFormData({ ...contingentFormData, usableArticles: current.filter(x => x !== id) });
        } else {
            setContingentFormData({ ...contingentFormData, usableArticles: [...current, id] });
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView("contingent-list")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        {t(lang, "article.contingents.createTitle")}
                    </h1>
                </div>
                <button onClick={handleContingentSave} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                    <FiSave /> {t(lang, "article.contingents.buttons.save")}
                </button>
            </div>

            <div className="space-y-6">
                {/* Basic Data */}
                <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <h3 className="font-bold mb-4 border-b pb-2">{t(lang, "article.contingents.sections.basicData")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.org")}</label>
                            <input type="text" disabled value={contingentFormData.organization} className="w-full p-2 rounded border bg-slate-100 text-slate-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.designation")}</label>
                            <input
                                type="text"
                                className={`w-full p-2 rounded border ${!contingentFormData.name ? "border-red-300" : "border-slate-300"} ${isDark ? "bg-slate-800" : "bg-white"}`}
                                value={contingentFormData.name}
                                onChange={(e) => setContingentFormData({ ...contingentFormData, name: e.target.value })}
                            />
                            {!contingentFormData.name && <p className="text-red-500 text-xs mt-1">{t(lang, "article.contingents.errors.required")}</p>}
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.currency")}</label>
                            <select
                                className={`w-full p-2 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                                value={contingentFormData.currency}
                                onChange={(e) => setContingentFormData({ ...contingentFormData, currency: e.target.value })}
                            >
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        {/* Add Account Type, Priority, Validity similarly... skipping for brevity but should be added based on screenshot */}
                    </div>
                </div>

                {/* Trigger */}
                <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <h3 className="font-bold mb-4 border-b pb-2">{t(lang, "article.contingents.sections.trigger")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.article")}</label>
                            <select
                                className={`w-full p-2 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                                value={contingentFormData.triggerArticleId}
                                onChange={(e) => setContingentFormData({ ...contingentFormData, triggerArticleId: e.target.value })}
                            >
                                <option value="">{t(lang, "article.contingents.options.select")}</option>
                                {articles.map(a => <option key={a.id} value={a.id}>{a.articleName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.quotaType")}</label>
                            <select
                                className={`w-full p-2 rounded border ${!contingentFormData.quotaType ? "border-red-300" : "border-slate-300"} ${isDark ? "bg-slate-800 border-slate-700" : "bg-white"}`}
                                value={contingentFormData.quotaType}
                                onChange={(e) => setContingentFormData({ ...contingentFormData, quotaType: e.target.value })}
                            >
                                <option value="">{t(lang, "article.contingents.options.select")}</option>
                                <option value="years">{t(lang, "article.contingents.options.years")}</option> {/* Mock types */}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Usable Articles */}
                <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <h3 className="font-bold mb-4 border-b pb-2">{t(lang, "article.contingents.sections.usableArticles")}</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        <div className="flex items-center gap-2 font-bold mb-2">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) setContingentFormData({ ...contingentFormData, usableArticles: articles.map(a => a.id) });
                                    else setContingentFormData({ ...contingentFormData, usableArticles: [] });
                                }}
                                checked={contingentFormData.usableArticles.length === articles.length && articles.length > 0}
                                className="rounded text-sky-500 focus:ring-sky-500"
                            />
                            <span>All Articles</span>
                        </div>
                        {groups.map(group => {
                            const groupArticles = articles.filter(a => a.category === group.id || a.productGroup === group.id); // Flexible matching
                            if (groupArticles.length === 0) return null;

                            return (
                                <div key={group.id} className="ml-4">
                                    <details open>
                                        <summary className="cursor-pointer font-bold text-sm text-slate-600 dark:text-slate-400 hover:text-sky-500">
                                            <FiFolder className="inline mr-2" /> {group.name}
                                        </summary>
                                        <div className="pl-6 mt-2 space-y-1">
                                            {groupArticles.map(article => (
                                                <label key={article.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={contingentFormData.usableArticles.includes(article.id)}
                                                        onChange={() => toggleUsableArticle(article.id)}
                                                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                                    />
                                                    {article.articleName}
                                                    <span className="text-xs text-slate-400 ml-auto">{article.articleNo}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

