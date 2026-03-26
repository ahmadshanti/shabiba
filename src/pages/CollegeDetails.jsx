import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SectionTitle({ title, count }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100">
        {count}
      </span>
    </div>
  );
}

export default function CollegeDetails() {
  const { id } = useParams();

  const [college, setCollege] = useState(null);
  const [majors, setMajors] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const majorsCount = majors.length;
  const profCount = professors.length;

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      const [cRes, mRes, pRes] = await Promise.all([
        supabase.from("colleges").select("*").eq("id", id).single(),
        supabase
          .from("majors")
          .select("*")
          .eq("college_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("professors")
          .select("*")
          .eq("college_id", id)
          .order("created_at", { ascending: false }),
      ]);

      if (ignore) return;

      if (cRes.error) return finish(cRes.error.message);
      if (mRes.error) return finish(mRes.error.message);
      if (pRes.error) return finish(pRes.error.message);

      setCollege(cRes.data);
      setMajors(mRes.data ?? []);
      setProfessors(pRes.data ?? []);
      setLoading(false);
    }

    function finish(message) {
      setErr(message);
      setLoading(false);
    }

    load();

    return () => {
      ignore = true;
    };
  }, [id]);

  const subtitle = useMemo(() => {
    if (!college) return "";
    const parts = [];
    parts.push(`${majorsCount} تخصص`);
    parts.push(`${profCount} دكتور/ة`);
    return parts.join(" • ");
  }, [college, majorsCount, profCount]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/colleges"
          className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition dark:hover:bg-[#2a220a] dark:text-yellow-100"
        >
          ← رجوع للكليات
        </Link>
      </div>

      <div className="card p-6 md:p-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 w-28 bg-brand-100 dark:bg-yellow-100/10 rounded" />
            <div className="mt-4 h-7 w-2/3 bg-slate-100 dark:bg-[#2a220a] rounded" />
            <div className="mt-3 h-4 w-1/3 bg-slate-100 dark:bg-[#2a220a] rounded" />
          </div>
        ) : err ? (
          <div>
            <div className="font-bold text-red-600 dark:text-red-400">
              صار خطأ
            </div>
            <div className="mt-2 text-sm text-slate-700 dark:text-yellow-100/80">
              {err}
            </div>
          </div>
        ) : !college ? (
          <div className="font-bold">الكلية غير موجودة</div>
        ) : (
          <div>
            {college.image_url && (
              <img
                src={college.image_url}
                alt={college.name}
                className="w-full h-64 md:h-80 object-cover rounded-2xl mb-4 border border-brand-100 dark:border-yellow-700"
              />
            )}

            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold dark:bg-yellow-100/10 dark:border dark:border-yellow-700 dark:text-yellow-100">
              {subtitle}
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold">
              {college.name}
            </h1>

            {college.description && (
              <p className="mt-3 text-slate-600 dark:text-yellow-100/80 leading-7">
                {college.description}
              </p>
            )}
          </div>
        )}
      </div>

      {!loading && !err && college && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <SectionTitle title="التخصصات" count={majors.length} />
            <div className="mt-4 grid gap-3">
              {majors.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-yellow-100/80">
                  لا يوجد تخصصات لهذه الكلية بعد.
                </div>
              ) : (
                majors.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-brand-100 p-4 hover:bg-brand-50 transition dark:border-yellow-700 dark:hover:bg-[#2a220a]"
                  >
                    <div className="font-extrabold">{m.name}</div>
                    {m.description && (
                      <div className="mt-1 text-sm text-slate-600 dark:text-yellow-100/80">
                        {m.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-6">
            <SectionTitle title="الدكاترة" count={professors.length} />
            <div className="mt-4 grid gap-3">
              {professors.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-yellow-100/80">
                  لا يوجد دكاترة لهذه الكلية بعد.
                </div>
              ) : (
                professors.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-brand-100 p-4 hover:bg-brand-50 transition dark:border-yellow-700 dark:hover:bg-[#2a220a]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-extrabold">{p.name}</div>
                      {p.title && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-100 border border-brand-200 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100">
                          {p.title}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-slate-600 dark:text-yellow-100/80 grid gap-1">
                      {p.email && <div>📧 {p.email}</div>}
                      {p.office && <div>📍 {p.office}</div>}
                    </div>

                    {p.bio && (
                      <div className="mt-2 text-sm text-slate-600 dark:text-yellow-100/80">
                        {p.bio}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}