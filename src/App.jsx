import { useState } from "react";
import { Search, Building2, FileAudio, Play, Download } from "lucide-react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tenant, setTenant] = useState("meydan"); // NEW
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchRecording = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 🔀 Dynamic backend based on tenant
      const baseUrl =
        tenant === "meydan"
          ? "http://localhost:9014"
          : "http://localhost:9013"; // SPC backend port

      const res = await fetch(
        `${baseUrl}/api/recording?filename=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      const data = await res.json();

      if (data.found) {
        setResult(data);
      } else {
        setError(
          data.message ||
            `Recording not found in ${
              tenant === "meydan" ? "Meydan" : "SPC"
            } servers`
        );
      }
    } catch (err) {
      setError(
        `Backend not running for ${
          tenant === "meydan" ? "Meydan (9012)" : "SPC (9022)"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black mb-2">
              Recording Search
            </h1>
            <p className="text-blue-100 text-sm">
              {tenant === "meydan"
                ? "Searching Meydan (my01 → my04)"
                : "Searching SPC Tenant Servers"}
            </p>
          </div>

          {/* SEARCH */}
          <div className="p-8 bg-slate-50 border-b">
            
            {/* TENANT DROPDOWN */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Select Tenant
              </label>
              <select
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-blue-500 transition-all font-semibold disabled:opacity-60"
              >
                <option value="meydan">🏢 Meydan</option>
                <option value="spc">🏢 SPC</option>
              </select>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter filename like: d9512d73b33ee28ae3320ae0cc39efe7.mp3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchRecording()}
                className="w-full pl-12 p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <button
              onClick={searchRecording}
              disabled={loading || !searchQuery.trim()}
              className="mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching {tenant === "meydan" ? "Meydan" : "SPC"}...
                </span>
              ) : (
                "🔍 Search"
              )}
            </button>
          </div>

          {/* RESULTS */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center font-semibold border-2 border-red-200">
                ❌ {error}
              </div>
            )}

            {result && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200">
                    <FileAudio className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-slate-800 truncate">
                      {searchQuery}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600 font-mono">
                      <span className="bg-white/70 px-2 py-1 rounded-md border border-emerald-100">
                        🏢 {tenant.toUpperCase()}
                      </span>
                      <span className="bg-white/70 px-2 py-1 rounded-md border border-emerald-100">
                        🖥️ {result.server.toUpperCase()}
                      </span>
                      <span className="bg-white/70 px-2 py-1 rounded-md border border-emerald-100 truncate max-w-xs">
                        📁 {result.full_path}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AUDIO PLAYER */}
                <div className="bg-white/70 p-4 rounded-2xl border shadow-lg mb-6">
                  <audio controls className="w-full h-14" src={result.url} />
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl"
                  >
                    <Play className="w-6 h-6" />
                    Play in Tab
                  </a>
                  <a
                    href={result.url}
                    download={searchQuery}
                    className="bg-orange-600 text-white px-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-orange-700 shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                    Download MP3
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
