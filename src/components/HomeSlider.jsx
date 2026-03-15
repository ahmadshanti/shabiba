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

  // ✅ Preload مرة وحدة
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
    if (isAnimating) return; // ✅ امنع ضغطات متتالية

    const nextIndex = ((target % slides.length) + slides.length) % slides.length;
    if (nextIndex === index) return;

    setIsAnimating(true);

    // ✅ حمّل الصورة الجديدة أولًا
    const img = new Image();
    img.src = slides[nextIndex];

    img.onload = () => {
      // بعد ما تجهز، اعمل fade-out سريع
      setFade(false);

      // بدّل index أثناء fade-out
      setTimeout(() => {
        setIndex(nextIndex);
        setFade(true);

        // فك القفل بعد ما تخلص الحركة
        setTimeout(() => {
          setIsAnimating(false);
        }, 350);
      }, 200);
    };

    if (!fromAuto) startAuto(nextIndex);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[300px] sm:h-[420px] lg:h-[520px] bg-brand-50">
        <img
          src={slides[index]}
          alt="Home slide"
          className={[
            "absolute inset-0 w-full h-full transition-opacity duration-500",
            "object-contain",
            fade ? "opacity-100" : "opacity-0",
          ].join(" ")}
          draggable="false"
          loading="eager"
          decoding="async"
        />

        {/* الأسهم */}
        <button
          onClick={() => goTo(index - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white text-5xl font-bold drop-shadow hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={() => goTo(index + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white text-5xl font-bold drop-shadow hover:scale-110 transition"
        >
          ›
        </button>

        {/* النقاط */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-yellow-400" : "w-2.5 bg-slate-300"
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
