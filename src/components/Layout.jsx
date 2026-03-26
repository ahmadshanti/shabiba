import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/colleges", label: "الكليات" },
  { to: "/announcements", label: "إعلانات مهمة" },
  { to: "/chat", label: "شات بوت" },
  { to: "/housing", label: "السكنات" },
  { to: "/resources", label: "المواد والملخصات" },
];

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl text-sm font-semibold transition",
          isActive
            ? "bg-brand-200 text-ink dark:bg-yellow-400 dark:text-black"
            : "hover:bg-brand-100 text-slate-700 dark:text-yellow-50 dark:hover:bg-[#2a220a]",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-brand-50 text-ink dark:bg-[#181203] dark:text-[#fff7cc] transition-colors duration-300"
    >
      <header className="sticky top-0 z-50 border-b border-brand-100 bg-brand-50/75 backdrop-blur-md supports-[backdrop-filter]:bg-brand-50/65 dark:bg-[#1a1405]/80 dark:border-yellow-700">
        <div className="container-app py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="شعار حركة الشبيبة الطلابية"
              className="h-11 w-11 object-contain"
            />

            <div className="leading-5">
              <div className="font-extrabold">حركة الشبيبة الطلابية</div>
              <div className="text-sm text-slate-600 dark:text-yellow-100/80">
                معكم من التسجيل حتى التخرج
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-300 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-400 transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </nav>

          <div className="md:hidden relative" ref={menuRef}>
            <div className="flex items-center gap-2">
          <button
  onClick={() => setDarkMode((prev) => !prev)}
  className="
    h-11 w-11
    rounded-full
    border border-brand-300
    bg-brand-200
    flex items-center justify-center
    text-slate-800
    hover:bg-brand-300 hover:scale-105
    dark:bg-[#221c08] dark:text-yellow-100 dark:border-yellow-600
    dark:hover:bg-[#2a220a]
    shadow-sm hover:shadow-[0_0_18px_rgba(251,191,36,0.18)]
    transition-all duration-300
  "
  aria-label="تبديل الوضع"
>
  {darkMode ? (
    // ☀️ Sun SVG
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  ) : (
    // 🌙 Moon SVG
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
    </svg>
  )}
</button>

              <button
                type="button"
                className="px-4 py-2 rounded-xl font-bold bg-yellow-500 text-black shadow-sm border border-yellow-600 active:scale-95 transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
              >
                القائمة
              </button>
            </div>

            {menuOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setMenuOpen(false)}
              />
            )}

            <div
              className={[
                "absolute mt-3 left-0 z-50 w-72 max-w-[85vw]",
                "bg-white border border-brand-100 rounded-2xl shadow-xl p-2",
                "dark:bg-[#221c08] dark:border-yellow-700",
                "origin-top-left transition duration-200",
                menuOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0",
              ].join(" ")}
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-yellow-100/70">
                التنقل
              </div>

              <div className="space-y-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block w-full px-4 py-3 rounded-xl text-sm font-semibold",
                        "transition flex items-center justify-between",
                        isActive
                          ? "bg-brand-200 text-ink dark:bg-yellow-400 dark:text-black"
                          : "hover:bg-brand-50 text-slate-800 dark:text-yellow-50 dark:hover:bg-[#2a220a]",
                      ].join(" ")
                    }
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-slate-400 dark:text-yellow-200/50">›</span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-brand-100 dark:border-yellow-700 px-3 pb-1 text-[11px] text-slate-500 dark:text-yellow-100/70">
                اضغط خارج القائمة للإغلاق
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <Outlet />
      </main>

      <footer className="border-t border-brand-100 bg-white dark:bg-[#120f05] dark:border-yellow-700">
  <div className="container-app py-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-600 dark:text-yellow-100/80">
        © {new Date().getFullYear()} — حركة الشبيبة الطلابية
      </div>

<div className="flex items-center gap-3 flex-wrap justify-center">
  <a
    href="https://facebook.com/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="Facebook"
    title="Facebook"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.6-1.6H16V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V11H7.5v3H10v7h3.5z" />
    </svg>
  </a>

  <a
    href="https://instagram.com/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="Instagram"
    title="Instagram"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4A4.8 4.8 0 0 1 16.2 21H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8zm8.9 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
    </svg>
  </a>

  <a
    href="https://tiktok.com/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="TikTok"
    title="TikTok"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M14.7 3c.4 2 1.6 3.3 3.5 3.7v2.5c-1.2 0-2.4-.4-3.4-1.1v6.1c0 3.2-2.3 5.3-5.2 5.3-3 0-5.1-2.3-5.1-5 0-3.2 2.5-5.4 5.7-5.1v2.6c-1.6-.2-3 .9-3 2.5 0 1.4 1.1 2.4 2.4 2.4 1.4 0 2.4-1 2.4-2.8V3h2.7z" />
    </svg>
  </a>

  <a
    href="https://x.com/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="X"
    title="X"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M18.9 3H21l-6.5 7.4L22 21h-5.8l-4.5-5.9L6.5 21H4.4l6.9-7.9L2 3h5.9l4 5.4L18.9 3zm-1 16.2h1.2L7.4 4.7H6.1l11.8 14.5z" />
    </svg>
  </a>

  <a
    href="https://youtube.com/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="YouTube"
    title="YouTube"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.2 30.2 0 0 0 2 12a30.2 30.2 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.2 30.2 0 0 0 22 12a30.2 30.2 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  </a>

  <a
    href="https://t.me/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="Telegram"
    title="Telegram"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M21.9 4.6c.3-1.3-.5-1.8-1.6-1.4L3.1 9.8c-1.2.5-1.2 1.1-.2 1.4l4.4 1.4 1.7 5.1c.2.7.1 1 .8 1 .5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.1-14.1zM9 12.2l9.1-5.7c.4-.2.8-.1.5.2l-7.5 6.8-.3 3.3-1.8-4.6z" />
    </svg>
  </a>

  <a
    href="https://wa.me/"
    target="_blank"
    rel="noreferrer"
    className="h-11 w-11 rounded-full border border-brand-200 dark:border-yellow-700 bg-white/90 dark:bg-[#221c08] flex items-center justify-center text-slate-700 dark:text-yellow-100 shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:border-brand-300 dark:hover:border-yellow-500 hover:-translate-y-0.5 dark:hover:bg-[#2a220a] transition-all duration-300"
    aria-label="WhatsApp"
    title="WhatsApp"
  >
    <svg
  viewBox="0 0 24 24"
  className="h-5 w-5 fill-current"
>
  <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.41 0 .04 5.37.04 12c0 2.11.55 4.17 1.59 5.99L0 24l6.2-1.62A11.94 11.94 0 0 0 12.04 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.52-8.52zM12.04 21.8c-1.84 0-3.63-.49-5.2-1.42l-.37-.22-3.68.96.98-3.59-.24-.37A9.73 9.73 0 0 1 2.3 12c0-5.38 4.37-9.74 9.74-9.74 2.6 0 5.04 1.01 6.88 2.85A9.7 9.7 0 0 1 21.78 12c0 5.37-4.37 9.8-9.74 9.8zm5.34-7.29c-.29-.15-1.7-.84-1.97-.93-.27-.1-.47-.15-.66.15-.2.3-.76.93-.93 1.12-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.3-.02-.46.13-.6.14-.14.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.46 1.08 2.88 1.23 3.08.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.35z"/>
</svg>
  </a>
</div>
    </div>
  </div>
</footer>
    </div>
  );
}