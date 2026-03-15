import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function CollegeResources() {
  const { collegeId } = useParams();
  const [college, setCollege] = useState(null);
  const [majors, setMajors] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr("");

      const [cRes, mRes] = await Promise.all([
        supabase.from("colleges").select("id,name,description").eq("id", collegeId).single(),
        supabase.from("majors").select("id,name,description").eq("college_id", collegeId).order("name"),
      ]);

      if (ignore) return;

      if (cRes.error) return finish(cRes.error.message);
      if (mRes.error) return finish(mRes.error.message);

      setCollege(cRes.data);
      setMajors(mRes.data ?? []);
      setLoading(false);
    })();

    function finish(msg) {
      setErr(msg);
      setLoading(false);
    }

    return () => (ignore = true);
  }, [collegeId]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition"
        >
          ← رجوع للكليات
        </Link>
      </div>

      <div className="card p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 w-2/3 bg-slate-100 rounded" />
            <div className="mt-2 h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        ) : err ? (
          <div>
            <div className="font-bold text-red-600">صار خطأ</div>
            <div className="mt-2 text-sm">{err}</div>
          </div>
        ) : (
          <>
            <div className="text-sm text-slate-500">الكلية</div>
            <h1 className="mt-2 text-2xl font-extrabold">{college?.name}</h1>
            {college?.description && (
              <p className="mt-2 text-slate-600 text-sm">{college.description}</p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold">
              اختر تخصص لعرض المواد
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {majors.map((m) => (
          <Link
            key={m.id}
            to={`/resources/majors/${m.id}`}
            className="card p-5 hover:-translate-y-0.5 transition"
          >
            <div className="text-sm text-slate-500">تخصص</div>
            <div className="mt-2 text-lg font-extrabold">{m.name}</div>
            {m.description && (
              <p className="mt-2 text-sm text-slate-600">{m.description}</p>
            )}
            <div className="mt-4 inline-flex font-semibold text-ink underline decoration-brand-300">
              عرض المواد →
            </div>
          </Link>
        ))}
      </div>

      {!loading && !err && majors.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">لا يوجد تخصصات لهذه الكلية بعد</div>
        </div>
      )}
    </div>
  );
}
