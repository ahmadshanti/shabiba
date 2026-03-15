import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function FileRow({ f }) {
  const isPdf = (f.file_type || "").toLowerCase() === "pdf";
  return (
    <a
      href={f.file_url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 p-4 hover:bg-brand-50 transition"
    >
      <div>
        <div className="font-extrabold">{f.title}</div>
        <div className="mt-1 text-sm text-slate-600">{isPdf ? "PDF" : "رابط"}</div>
      </div>
      <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200">
        فتح
      </span>
    </a>
  );
}

export default function MaterialDetails() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr("");

      const [mRes, fRes] = await Promise.all([
        supabase.from("materials").select("*").eq("id", id).single(),
        supabase
          .from("material_files")
          .select("*")
          .eq("material_id", id)
          .order("created_at", { ascending: false }),
      ]);

      if (ignore) return;

      if (mRes.error) return finish(mRes.error.message);
      if (fRes.error) return finish(fRes.error.message);

      setMaterial(mRes.data);
      setFiles(fRes.data ?? []);
      setLoading(false);
    })();

    function finish(msg) {
      setErr(msg);
      setLoading(false);
    }

    return () => (ignore = true);
  }, [id]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition"
        >
          ← رجوع للموارد
        </Link>
      </div>

      <div className="card p-6 md:p-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-brand-100 rounded" />
            <div className="mt-4 h-7 w-2/3 bg-slate-100 rounded" />
            <div className="mt-2 h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        ) : err ? (
          <div>
            <div className="font-bold text-red-600">صار خطأ</div>
            <div className="mt-2 text-sm text-slate-700">{err}</div>
          </div>
        ) : !material ? (
          <div className="font-bold">المادة غير موجودة</div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold">
              {material.course_code ? `كود: ${material.course_code}` : "بدون كود"}
              {material.year_level ? ` • سنة ${material.year_level}` : ""}
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold">
              {material.course_name}
            </h1>

            {material.description && (
              <p className="mt-3 text-slate-600 leading-7">{material.description}</p>
            )}
          </div>
        )}
      </div>

      {!loading && !err && material && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">ملفات المادة</h2>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200">
              {files.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {files.length === 0 ? (
              <div className="text-sm text-slate-600">
                لا يوجد ملفات لهذه المادة بعد (أضفها من Supabase فقط).
              </div>
            ) : (
              files.map((f) => <FileRow key={f.id} f={f} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
