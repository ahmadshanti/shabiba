import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Resources() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("colleges")
        .select("id,name,description")
        .order("name", { ascending: true });

      if (ignore) return;
      if (error) setErr(error.message);
      setRows(data ?? []);
      setLoading(false);
    })();

    return () => (ignore = true);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold">المواد والملخصات</h1>
        <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
          اختر كلية → تخصص → مادة → ملفات.
        </p>
      </div>

      {err && (
        <div className="card p-5 border-red-200 dark:border-red-800">
          <div className="font-bold text-red-600 dark:text-red-400">
            صار خطأ
          </div>
          <div className="mt-2 text-sm dark:text-yellow-100/80">{err}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 w-20 bg-brand-100 dark:bg-yellow-100/10 rounded" />
                <div className="mt-3 h-6 w-3/4 bg-slate-100 dark:bg-[#2a220a] rounded" />
                <div className="mt-2 h-4 w-full bg-slate-100 dark:bg-[#2a220a] rounded" />
              </div>
            ))
          : rows.map((c) => (
              <Link
                key={c.id}
                to={`/resources/colleges/${c.id}`}
                className="card p-5 hover:-translate-y-0.5 transition"
              >
                <div className="text-sm text-slate-500 dark:text-yellow-100/60">
                  كلية
                </div>
                <div className="mt-2 text-xl font-extrabold">{c.name}</div>
                {c.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-yellow-100/80">
                    {c.description}
                  </p>
                )}
                <div className="mt-4 h-1 w-16 bg-brand-400 rounded-full dark:bg-yellow-400" />
              </Link>
            ))}
      </div>

      {!loading && !err && rows.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">ما في كليات لسه</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-yellow-100/80">
            
          </div>
        </div>
      )}
    </div>
  );
}