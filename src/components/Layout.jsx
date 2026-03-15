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
            ? "bg-brand-200 text-ink"
            : "hover:bg-brand-100 text-slate-700",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ✅ سكّر المنيو لما تكبس برا
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

  // ✅ سكّر المنيو عند ضغط ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen">
      {/* ===== Header / Navbar ===== */}
      <header className="sticky top-0 z-50 bg-brand-50/80 backdrop-blur border-b border-brand-100">
        <div className="container-app py-3 flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="شعار حركة الشبيبة الطلابية"
              className="h-11 w-11 object-contain"
            />

            <div className="leading-5">
              <div className="font-extrabold">حركة الشبيبة الطلابية</div>
              <div className="text-sm text-slate-600">
                معكم من التسجيل حتى التخرج
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* ===== Mobile menu ===== */}
          <div className="md:hidden relative" ref={menuRef}>
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

            {/* Overlay */}
            {menuOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setMenuOpen(false)}
              />
            )}

            {/* Menu dropdown */}
            <div
              className={[
                "absolute mt-3 right-0 z-50 w-72 max-w-[85vw]",
                "bg-white border border-brand-100 rounded-2xl shadow-xl p-2",
                "origin-top-right transition duration-200",
                menuOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0",
              ].join(" ")}
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">
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
                          ? "bg-brand-200 text-ink"
                          : "hover:bg-brand-50 text-slate-800",
                      ].join(" ")
                    }
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-slate-400">›</span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-brand-100 px-3 pb-1 text-[11px] text-slate-500">
                اضغط خارج القائمة للإغلاق
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="container-app py-8">
        <Outlet />
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-brand-100 bg-white">
        <div className="container-app py-6 text-sm text-slate-600">
          © {new Date().getFullYear()} — حركة الشبيبة الطلابية
        </div>
      </footer>
    </div>
  );
}
