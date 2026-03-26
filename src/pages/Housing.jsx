import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function Badge({ gender }) {
  const isMale = gender === "male";
  return (
    <span
      className={[
        "text-xs font-extrabold px-2.5 py-1 rounded-full border",
        isMale
          ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/40 dark:text-blue-300"
          : "bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-500/10 dark:border-pink-500/40 dark:text-pink-300",
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
      <div className="relative h-44 bg-brand-50 border-b border-brand-100 dark:bg-[#1a1405] dark:border-yellow-700">
        {hasImg ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-500 dark:text-yellow-100/60 text-sm">
            لا توجد صورة
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge gender={item.gender} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold">{item.title}</h3>
        </div>

        <div className="mt-2 grid gap-2 text-sm text-slate-700 dark:text-yellow-100/80">
          {item.location && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-yellow-100/60">
                الموقع
              </span>
              <span className="font-semibold">{item.location}</span>
            </div>
          )}

          {Number.isFinite(item.rooms_count) && item.rooms_count !== null && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-yellow-100/60">
                عدد الغرف
              </span>
              <span className="font-semibold">{item.rooms_count}</span>
            </div>
          )}

          {item.description && (
            <p className="mt-2 text-slate-600 dark:text-yellow-100/80 leading-7">
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.phone ? (
            <>
              <a href={`tel:${phoneClean}`} className="btn-primary">
                اتصال
              </a>

              <button
                onClick={() => navigator.clipboard.writeText(item.phone)}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-brand-200 font-semibold hover:bg-brand-100 transition dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-[#2a220a]"
              >
                نسخ الرقم
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-500 dark:text-yellow-100/60">
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

  const [genderFilter, setGenderFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("housing")
        .select(
          "id,title,gender,description,location,rooms_count,phone,image_url,is_active,created_at"
        )
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
      const genderOk =
        genderFilter === "all" ? true : r.gender === genderFilter;

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
        <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
          إعلانات سكنات للطلاب (بدون حجز). تواصل مباشرة مع الرقم الموجود.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setGenderFilter("all")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "all"
                ? "bg-brand-200 border-brand-300 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100"
                : "bg-white border-brand-200 hover:bg-brand-50 dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-[#2a220a]",
            ].join(" ")}
          >
            الكل
          </button>

          <button
            onClick={() => setGenderFilter("male")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "male"
                ? "bg-brand-200 border-brand-300 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100"
                : "bg-white border-brand-200 hover:bg-brand-50 dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-[#2a220a]",
            ].join(" ")}
          >
            ذكور
          </button>

          <button
            onClick={() => setGenderFilter("female")}
            className={[
              "rounded-full px-3 py-2 text-sm font-semibold border transition",
              genderFilter === "female"
                ? "bg-brand-200 border-brand-300 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100"
                : "bg-white border-brand-200 hover:bg-brand-50 dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-[#2a220a]",
            ].join(" ")}
          >
            إناث
          </button>

          <div className="flex-1" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم السكن أو الموقع…"
            className="w-full sm:w-80 rounded-xl border border-brand-200 bg-white dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100 dark:placeholder:text-yellow-100/50 px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-brand-200 dark:focus:ring-yellow-700"
          />
        </div>
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
                <div className="h-40 bg-slate-100 dark:bg-[#2a220a] rounded-xl" />
                <div className="mt-4 h-5 w-2/3 bg-slate-100 dark:bg-[#2a220a] rounded" />
                <div className="mt-2 h-4 w-full bg-slate-100 dark:bg-[#2a220a] rounded" />
              </div>
            ))
          : filtered.map((item) => <HousingCard key={item.id} item={item} />)}
      </div>

      {!loading && !err && filtered.length === 0 && (
        <div className="card p-6">
          <div className="font-bold">لا يوجد سكنات مطابقة</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-yellow-100/80">
            جرّب تغيير الفلتر أو البحث.
          </div>
        </div>
      )}
    </div>
  );
}