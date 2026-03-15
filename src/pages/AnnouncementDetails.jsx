import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AnnouncementDetails() {
  const { id } = useParams();

  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("announcements")
        .select("id,title,body,content,image_url,is_important,publish_date,created_at")
        .eq("id", id)
        .single();

      if (ignore) return;

      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      setRow(data);
      setLoading(false);
    })();

    return () => (ignore = true);
  }, [id]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Link
          to="/announcements"
          className="inline-flex items-center gap-2 font-semibold hover:bg-brand-100 rounded-xl px-3 py-2 transition"
        >
          ← رجوع للإعلانات
        </Link>
      </div>

      <div className="card p-6 md:p-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 w-2/3 bg-slate-100 rounded" />
            <div className="mt-4 h-48 bg-slate-100 rounded-2xl" />
            <div className="mt-4 h-4 w-full bg-slate-100 rounded" />
            <div className="mt-2 h-4 w-5/6 bg-slate-100 rounded" />
          </div>
        ) : err ? (
          <div>
            <div className="font-bold text-red-600">صار خطأ</div>
            <div className="mt-2 text-sm text-slate-700">{err}</div>
          </div>
        ) : !row ? (
          <div className="font-bold">الإعلان غير موجود</div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {row.is_important && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-100 border border-brand-200">
                  إعلان مهم
                </span>
              )}
              {(row.publish_date || row.created_at) && (
                <span className="text-xs text-slate-500">
                  {row.publish_date || row.created_at?.slice(0, 10)}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold">
              {row.title}
            </h1>

            {/* صورة الإعلان (اختيارية) */}
            {row.image_url && (
         <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-white">
  <img
    src={row.image_url}
    alt={row.title}
    className="w-full h-auto object-contain"
    loading="lazy"
  />
</div>

            )}

            {/* نص الإعلان */}
            <div className="mt-6 text-slate-700 leading-8 whitespace-pre-line">
              {row.content || row.body || "لا يوجد تفاصيل إضافية."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
