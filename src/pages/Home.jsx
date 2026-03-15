import { Link } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";

console.log(import.meta.env.VITE_SUPABASE_URL);

function StatCard({ title, desc, to }) {
  return (
    <Link to={to} className="card p-5 hover:-translate-y-0.5 transition">
      <div className="text-sm text-slate-500">قسم</div>
      <div className="mt-1 text-lg font-extrabold">{title}</div>
      <div className="mt-2 text-slate-600 text-sm">{desc}</div>
      <div className="mt-4 h-1 w-16 bg-brand-400 rounded-full" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="grid gap-6">
      {/* ✅ السلايدر بين النافبار والسكشنات + بعرض الشاشة */}
      <div className="relative -mx-[calc((100vw-100%)/2)]">
  <HomeSlider />
</div>


      <section className="card p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold">
         — نسخة تجريبية
        </div>

        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
          كل شي للجامعة… بمكان واحد
        </h1>

        <p className="mt-3 text-slate-600 max-w-2xl">
          استعرض الكليات والتخصصات والدكاترة، تابع الإعلانات الهامة، اسأل الشات بوت، وشوف السكنات والملخصات.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/announcements">
            آخر الإعلانات
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-brand-200 font-semibold hover:bg-brand-100 transition"
            to="/colleges"
          >
            استعرض الكليات
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard title="الكليات" desc="تخصصات + دكاترة لكل كلية" to="/colleges" />
        <StatCard title="إعلانات مهمة" desc="آخر الأخبار والتنبيهات الرسمية" to="/announcements" />
        {/* ✅ خليها تروح على الموارد بدل materials حسب اللي سويناه */}
        <StatCard title="المواد والملخصات" desc="ملخصات وملفات للمواد" to="/resources" />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="text-sm text-slate-500">ميزة</div>
          <div className="mt-1 text-xl font-extrabold">شات بوت أسئلة جاهزة</div>
          <p className="mt-2 text-slate-600 text-sm">
            أسئلة شائعة وإجابات جاهزة وسريعة.
          </p>
          <Link className="mt-4 inline-flex font-semibold text-ink underline decoration-brand-300" to="/chat">
            افتح الشات →
          </Link>
        </div>

        <div className="card p-6">
          <div className="text-sm text-slate-500">ميزة</div>
          <div className="mt-1 text-xl font-extrabold">السكنات</div>
          <p className="mt-2 text-slate-600 text-sm">
            إعلانات سكنات للطلاب (بدون حجز).
          </p>
          <Link className="mt-4 inline-flex font-semibold text-ink underline decoration-brand-300" to="/housing">
            استعرض السكنات →
          </Link>
        </div>
      </section>
    </div>
  );
}
