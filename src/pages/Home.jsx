import { Link } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";

console.log(import.meta.env.VITE_SUPABASE_URL);

function StatCard({ title, desc, to }) {
  return (
    <Link
      to={to}
      className="card p-5 hover:-translate-y-0.5 transition"
    >
      <div className="text-sm text-slate-500 dark:text-yellow-100/60">قسم</div>
      <div className="mt-1 text-lg font-extrabold">{title}</div>
      <div className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
        {desc}
      </div>
      <div className="mt-4 h-1 w-16 bg-brand-400 rounded-full dark:bg-yellow-400" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="grid gap-6">
      <div className="relative -mx-[calc((100vw-100%)/2)] bg-brand-50 dark:bg-[#120f05] transition-colors duration-300">
        <HomeSlider />
      </div>

      <section className="card p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold dark:bg-yellow-100/10 dark:text-yellow-100 dark:border dark:border-yellow-700">
          — كتلة الشهداء
        </div>

        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
         .... كل ما يحتاجه الطالب في مكان واحد 
        </h1>

        <p className="mt-3 text-slate-600 dark:text-yellow-100/80 max-w-2xl">
          استعرض الكليات والتخصصات والدكاترة، تابع الإعلانات الهامة، اسأل الشات بوت، وشوف السكنات والملخصات.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/announcements">
            آخر الإعلانات
          </Link>

          <Link
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-brand-200 font-semibold hover:bg-brand-100 transition dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-[#2a220a]"
            to="/colleges"
          >
            استعرض الكليات
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard
          title="الكليات"
          desc="تخصصات + دكاترة لكل كلية"
          to="/colleges"
        />
        <StatCard
          title="إعلانات مهمة"
          desc="آخر الأخبار والتنبيهات الرسمية"
          to="/announcements"
        />
        <StatCard
          title="المواد والملخصات"
          desc="ملخصات وملفات للمواد"
          to="/resources"
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="text-sm text-slate-500 dark:text-yellow-100/60">ميزة</div>
          <div className="mt-1 text-xl font-extrabold">شات بوت أسئلة جاهزة</div>
          <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
            أسئلة شائعة وإجابات جاهزة وسريعة.
          </p>
          <Link
            className="mt-4 inline-flex font-semibold text-brand-800 underline decoration-brand-300 hover:text-brand-900 dark:text-yellow-100 dark:decoration-yellow-400 dark:hover:text-yellow-300"
            to="/chat"
          >
            افتح الشات →
          </Link>
        </div>

        <div className="card p-6">
          <div className="text-sm text-slate-500 dark:text-yellow-100/60">ميزة</div>
          <div className="mt-1 text-xl font-extrabold">السكنات</div>
          <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
            إعلانات سكنات للطلاب (بدون حجز).
          </p>
          <Link
            className="mt-4 inline-flex font-semibold text-brand-800 underline decoration-brand-300 hover:text-brand-900 dark:text-yellow-100 dark:decoration-yellow-400 dark:hover:text-yellow-300"
            to="/housing"
          >
            استعرض السكنات →
          </Link>
        </div>
      </section>
    </div>
  );
}