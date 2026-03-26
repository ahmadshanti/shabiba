import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);

      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsNearFooter(rect.top < window.innerHeight - 80);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className={[
        "fixed left-1/2 -translate-x-1/2 z-50",
        isNearFooter ? "bottom-32" : "bottom-20",
        "h-11 w-11 rounded-full",
        "bg-yellow-400 text-black",
        "shadow-lg border border-yellow-600",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-[0_0_25px_rgba(251,191,36,0.35)]",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none",
      ].join(" ")}
    >
      ↑
    </button>
  );
}