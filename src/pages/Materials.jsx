export default function Materials() {
  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-yellow-100/10 dark:border dark:border-yellow-700 px-3 py-1 text-sm font-semibold">
          قريبًا
        </div>

        <h1 className="mt-4 text-2xl font-extrabold">
          المواد والملخصات
        </h1>

        <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
          هون رح نعمل فلترة حسب كلية / تخصص / سنة + ملفات PDF وروابط.
        </p>
      </div>
    </div>
  );
}