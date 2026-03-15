import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CollegeCard({ c }) {
  return (
    <Link to={`/colleges/${c.id}`} className="card p-5 hover:-translate-y-0.5 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">كلية</div>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200">
          عرض التفاصيل
        </span>
      </div>

      <div className="mt-2 text-xl font-extrabold">{c.name}</div>
      {c.description && (
        <p className="mt-2 text-slate-600 text-sm">{c.description}</p>
      )}

      <div className="mt-4 h-1 w-20 bg-brand-400 rounded-full" />
    </Link>
  );
}

export default function Colleges() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("colleges")
        .select("id,name,description,image_url,created_at")
        .order("created_at", { ascending: false });

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
        <h1 className="text-2xl font-extrabold">الكليات</h1>
        <p className="mt-2 text-slate-600 text-sm">
          استعرض الكليات، وداخل كل كلية التخصصات والدكاترة.
        </p>
      </div>

      {err && (
        <div className="card p-5 border-red-200">
          <div className="font-bold text-red-600">صار خطأ</div>
          <div className="mt-2 text-sm text-slate-700">{err}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 w-20 bg-brand-100 rounded" />
                <div className="mt-3 h-6 w-3/4 bg-slate-100 rounded" />
                <div className="mt-2 h-4 w-full bg-slate-100 rounded" />
              </div>
            ))
          : rows.map((c) => <CollegeCard key={c.id} c={c} />)}
      </div>

      {!loading && !err && rows.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">ما في كليات لسه</div>
          <div className="mt-2 text-sm text-slate-600">
            أضف كليات من Supabase → Table Editor → colleges
          </div>
        </div>
      )}
    </div>
  );
}
