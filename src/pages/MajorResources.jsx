import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function MajorResources() {
  const { majorId } = useParams();
  const [major, setMajor] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr("");

      const [majRes, matRes] = await Promise.all([
        supabase.from("majors").select("id,name,college_id,description").eq("id", majorId).single(),
        supabase
          .from("materials")
          .select("id,course_name,course_code,year_level,description,created_at")
          .eq("major_id", majorId)
          .order("created_at", { ascending: false }),
      ]);

      if (ignore) return;

      if (majRes.error) return finish(majRes.error.message);
      if (matRes.error) return finish(matRes.error.message);

      setMajor(majRes.data);
      setMaterials(matRes.data ?? []);
      setLoading(false);
    })();

    function finish(msg) {
      setErr(msg);
      setLoading(false);
    }

    return () => (ignore = true);
  }, [majorId]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition"
        >
          ← الموارد
        </Link>

        {major?.college_id && (
          <Link
            to={`/resources/colleges/${major.college_id}`}
            className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition"
          >
            ← رجوع لتخصصات الكلية
          </Link>
        )}
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
            <div className="text-sm text-slate-500">التخصص</div>
            <h1 className="mt-2 text-2xl font-extrabold">{major?.name}</h1>
            {major?.description && (
              <p className="mt-2 text-slate-600 text-sm">{major.description}</p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold">
              اختر مادة لعرض الملفات
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((m) => (
          <Link
            key={m.id}
            to={`/materials/${m.id}`}
            className="card p-5 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {m.course_code ? `كود: ${m.course_code}` : "بدون كود"}
              </div>
              {m.year_level ? (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200">
                  سنة {m.year_level}
                </span>
              ) : null}
            </div>

            <div className="mt-2 text-lg font-extrabold">{m.course_name}</div>

            {m.description && (
              <p className="mt-2 text-sm text-slate-600">{m.description}</p>
            )}

            <div className="mt-4 inline-flex font-semibold text-ink underline decoration-brand-300">
              عرض الملفات →
            </div>
          </Link>
        ))}
      </div>

      {!loading && !err && materials.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">لا يوجد مواد لهذا التخصص بعد</div>
        </div>
      )}
    </div>
  );
}
