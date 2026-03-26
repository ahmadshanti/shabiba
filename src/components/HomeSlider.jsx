import { useEffect, useRef, useState } from "react";

const slides = [
  "/slides/slide1.jpg",
  "/slides/slide2.jpg",
  "/slides/slide3.jpg",
  "/slides/slide4.jpg",
  "/slides/slide5.jpg",
];

export default function HomeSlider() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef(null);

  const clearAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const startAuto = (startFrom = index) => {
    clearAuto();
    timerRef.current = setInterval(() => {
      goTo(startFrom + 1, true);
      startFrom = startFrom + 1;
    }, 5000);
  };

  useEffect(() => {
    startAuto(index);
    return () => clearAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (target, fromAuto = false) => {
    if (isAnimating) return;

    const nextIndex = ((target % slides.length) + slides.length) % slides.length;
    if (nextIndex === index) return;

    setIsAnimating(true);

    const img = new Image();
    img.src = slides[nextIndex];

    img.onload = () => {
      setFade(false);

      setTimeout(() => {
        setIndex(nextIndex);
        setFade(true);

        setTimeout(() => {
          setIsAnimating(false);
        }, 350);
      }, 200);
    };

    if (!fromAuto) startAuto(nextIndex);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="
          relative h-[300px] sm:h-[420px] lg:h-[520px]
          bg-brand-50
          dark:bg-[#120f05]
          transition-colors duration-300
        "
      >
        <div
          className="
            absolute inset-0
            bg-transparent
            dark:bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_45%)]
            pointer-events-none
          "
        />

        <div className="absolute inset-0 flex items-center justify-center px-0 sm:px-3 lg:px-6">
          <div
            className="
              group relative w-full h-full
              rounded-none sm:rounded-2xl
              overflow-hidden
              border-0 sm:border border-transparent
              dark:border-yellow-700/60
              dark:shadow-[0_0_35px_rgba(251,191,36,0.10)]
            "
          >
            <img
              src={slides[index]}
              alt="Home slide"
              className={[
                "absolute inset-0 w-full h-full transition-opacity duration-500",
                "object-contain",
                "p-0 sm:p-2 lg:p-3",
                fade ? "opacity-100" : "opacity-0",
              ].join(" ")}
              draggable="false"
              loading="eager"
              decoding="async"
            />

            <div className="absolute inset-0 bg-transparent dark:bg-black/5 pointer-events-none" />

            <button
              onClick={() => goTo(index - 1)}
              className="
                absolute left-3 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 z-20
                h-10 w-10 sm:h-12 sm:w-12
                grid place-items-center
                rounded-full
                border border-black/10 dark:border-yellow-500/30
                bg-white/85 dark:bg-[#1b1507]/85
                text-slate-900 dark:text-yellow-100
                backdrop-blur-md
                shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                hover:scale-110 hover:bg-white dark:hover:bg-[#2a220a]
                hover:shadow-[0_0_25px_rgba(251,191,36,0.20)]
                transition-all duration-300
                opacity-90 sm:opacity-0 sm:group-hover:opacity-100
              "
              disabled={isAnimating}
              aria-label="السابق"
              title="السابق"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => goTo(index + 1)}
              className="
                absolute right-3 sm:right-5 lg:right-6 top-1/2 -translate-y-1/2 z-20
                h-10 w-10 sm:h-12 sm:w-12
                grid place-items-center
                rounded-full
                border border-black/10 dark:border-yellow-500/30
                bg-white/85 dark:bg-[#1b1507]/85
                text-slate-900 dark:text-yellow-100
                backdrop-blur-md
                shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                hover:scale-110 hover:bg-white dark:hover:bg-[#2a220a]
                hover:shadow-[0_0_25px_rgba(251,191,36,0.20)]
                transition-all duration-300
                opacity-90 sm:opacity-0 sm:group-hover:opacity-100
              "
              disabled={isAnimating}
              aria-label="التالي"
              title="التالي"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-yellow-400"
                      : "w-2.5 bg-white/70 dark:bg-yellow-100/50"
                  }`}
                  disabled={isAnimating}
                  aria-label={`اذهب إلى الشريحة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}