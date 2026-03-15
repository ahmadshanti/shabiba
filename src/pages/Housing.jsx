import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function Badge({ gender }) {
  const isMale = gender === "male";
  return (
    <span
      className={[
        "text-xs font-extrabold px-2.5 py-1 rounded-full border",
        isMale
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-pink-50 border-pink-200 text-pink-700",
      ].join(" ")}
    >
      {isMale ? "ذكور" : "إناث"}
    </span>
  );
}

function HousingCard({ item }) {
  const phoneClean = (item.phone || "").replace(/\s+/g, "");
  const hasImg = !!item.image_url;

  return (
    <div className="card overflow-hidden">
      {/* Image */}
      <div className="relative h-44 bg-brand-50 border-b border-brand-100">
        {hasImg ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm">
            لا توجد صورة
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge gender={item.gender} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold">{item.title}</h3>
        </div>

        <div className="mt-2 grid gap-2 text-sm text-slate-700">
          {item.location && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">الموقع</span>
              <span className="font-semibold">{item.location}</span>
            </div>
          )}

          {Number.isFinite(item.rooms_count) && item.rooms_count !== null && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">عدد الغرف</span>
              <span className="font-semibold">{item.rooms_count}</span>
            </div>
          )}

          {item.description && (
            <p className="mt-2 text-slate-600 leading-7">
              {item.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.phone ? (
            <>
              <a
                href={`tel:${phoneClean}`}
                className="btn-primary"
              >
                اتصال
              </a>

              <button
                onClick={() => navigator.clipboard.writeText(item.phone)}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-brand-200 font-semibold hover:bg-brand-100 transition"
              >
                نسخ الرقم
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-500">
              لا يوجد رقم تواصل
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Housing() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [genderFilter, setGenderFilter] = useState("all"); // all | male | female
  const [q, setQ] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("housing")
        .select("id,title,gender,description,location,rooms_count,phone,image_url,is_active,created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (ignore) return;

      if (error) setErr(error.message);
      setRows(data ?? []);
      setLoading(false);
    })();

    return () => (ignore = true);
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    return rows.filter((r) => {
      const genderOk = genderFilter === "all" ? true : r.gender === genderFilter;

      if (!text) return genderOk;

      const hay =
        `${r.title ?? ""} ${r.location ?? ""} ${r.description ?? ""}`.toLowerCase();

      return genderOk && hay.includes(text);
    });
  }, [rows, genderFilter, q]);

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold">السكنات</h1>
        <p className="mt-2 text-slate-600 text-sm">
          إعلانات سكنات للطلاب (بدون حجز). تواصل مباشرة مع الرقم الموجود.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setGenderFilter("all")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "all"
                ? "bg-brand-200 border-brand-300"
                : "bg-white border-brand-200 hover:bg-brand-50",
            ].join(" ")}
          >
            الكل
          </button>
          <button
            onClick={() => setGenderFilter("male")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "male"
                ? "bg-brand-200 border-brand-300"
                : "bg-white border-brand-200 hover:bg-brand-50",
            ].join(" ")}
          >
            ذكور
          </button>
          <button
            onClick={() => setGenderFilter("female")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "female"
                ? "bg-brand-200 border-brand-300"
                : "bg-white border-brand-200 hover:bg-brand-50",
            ].join(" ")}
          >
            إناث
          </button>

          <div className="flex-1" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم السكن أو الموقع…"
            className="w-full sm:w-80 rounded-xl border border-brand-200 bg-white px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      {err && (
        <div className="card p-5 border-red-200">
          <div className="font-bold text-red-600">صار خطأ</div>
          <div className="mt-2 text-sm">{err}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-40 bg-slate-100 rounded-xl" />
                <div className="mt-4 h-5 w-2/3 bg-slate-100 rounded" />
                <div className="mt-2 h-4 w-full bg-slate-100 rounded" />
              </div>
            ))
          : filtered.map((item) => <HousingCard key={item.id} item={item} />)}
      </div>

      {!loading && !err && filtered.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">لا يوجد سكنات مطابقة</div>
          <div className="mt-2 text-sm text-slate-600">
            جرّب تغيير الفلتر أو البحث.
          </div>
        </div>
      )}
    </div>
  );
}
