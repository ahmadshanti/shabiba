import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-24 bg-brand-100 rounded" />
      <div className="mt-3 h-5 w-3/4 bg-slate-100 rounded" />
      <div className="mt-2 h-4 w-full bg-slate-100 rounded" />
      <div className="mt-2 h-4 w-2/3 bg-slate-100 rounded" />
    </div>
  );
}

export default function Announcements() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("announcements")
        .select("id,title,body,is_important,publish_date,created_at")
        .order("publish_date", { ascending: false })
        .limit(20);

      if (!ignore) {
        if (error) setErr(error.message);
        setRows(data ?? []);
        setLoading(false);
      }
    }

    load();
    return () => (ignore = true);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold">الإعلانات الهامة</h1>
        <p className="mt-2 text-slate-600 text-sm">
          آخر التنبيهات والقرارات الرسمية .
        </p>
      </div>

      {err && (
        <div className="card p-5 border-red-200">
          <div className="font-bold text-red-600">صار خطأ</div>
          <div className="mt-2 text-sm text-slate-700">{err}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : rows.map((a) => (
              <Link
                key={a.id}
                to={`/announcements/${a.id}`}
                className="card p-5 hover:-translate-y-0.5 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">{a.publish_date}</div>
                  {a.is_important && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-200">
                      هام
                    </span>
                  )}
                </div>

                <div className="mt-2 text-lg font-extrabold">{a.title}</div>
                <p className="mt-2 text-slate-600 text-sm">{a.body}</p>

                <div className="mt-4 inline-flex font-semibold text-ink underline decoration-brand-300">
                  اقرأ المزيد →
                </div>
              </Link>
            ))}
      </div>

      {!loading && !err && rows.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">ما في إعلانات لسه</div>
        </div>
      )}
    </div>
  );
}
