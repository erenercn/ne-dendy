export function UploadScreen({ t, lang, onToggleLang, onFileChange }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-slate-100">
      <div className="text-center max-w-sm px-8">
        <p className="text-[11px] tracking-[0.2em] text-neutral-600 uppercase font-semibold mb-4">
          {t.brand}
        </p>
        <h1 className="text-4xl font-extrabold mb-3">{t.title}</h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-9">{t.uploadDesc}</p>

        <label
          htmlFor="csv-upload"
          className="inline-block cursor-pointer bg-slate-100 text-[#0a0a0a] px-7 py-3 rounded-lg text-[13px] font-bold hover:bg-white transition-colors"
        >
          {t.upload}
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="hidden"
        />

        <div className="mt-5">
          <button
            onClick={onToggleLang}
            className="bg-transparent border border-neutral-800 text-neutral-600 px-4 py-1.5 rounded-md text-xs cursor-pointer hover:border-neutral-600 hover:text-neutral-400 transition-colors"
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </div>
    </main>
  );
}
