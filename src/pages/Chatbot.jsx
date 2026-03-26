import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function Bubble({ role, children }) {
  const isUser = role === "user";

  return (
    <div className={["flex", isUser ? "justify-start" : "justify-end"].join(" ")}>
      <div
        className={[
          "max-w-[680px] rounded-2xl px-4 py-3 leading-7 shadow-soft border",
          isUser
            ? "bg-white border-brand-100 dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100"
            : "bg-brand-100 border-brand-200 dark:bg-yellow-100/10 dark:border-yellow-700 dark:text-yellow-100",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 أهلًا! اختر رقم السؤال من القائمة داخل المربع 👇" },
  ]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("faq")
        .select("id,question,answer,category,created_at")
        .order("created_at", { ascending: false });

      if (ignore) return;

      if (error) setErr(error.message);
      setFaq(data ?? []);
      setLoading(false);
    })();

    return () => (ignore = true);
  }, []);

  const numberedFaq = useMemo(() => {
    return faq.map((item, idx) => ({
      ...item,
      num: idx + 1,
    }));
  }, [faq]);

  function answerByIndex(idxZeroBased) {
    const selected = numberedFaq[idxZeroBased];
    if (!selected) return;

    setMessages((m) => [
      ...m,
      { role: "user", text: `${selected.num}. ${selected.question}` },
    ]);

    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: selected.answer }]);
    }, 180);
  }

  function send() {
    const value = text.trim();
    if (!value) return;

    const n = Number(value);
    if (Number.isInteger(n) && n >= 1 && n <= numberedFaq.length) {
      setText("");
      answerByIndex(n - 1);
      return;
    }

    setMessages((m) => [...m, { role: "user", text: value }]);
    setText("");

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "📌 هذه النسخة تعتمد على أسئلة جاهزة.\n" +
            "اختر رقم من القائمة داخل المربع (مثلاً: 1 أو 2 أو 3).",
        },
      ]);
    }, 180);
  }

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold">— أسئلة جاهزة</h1>
        <p className="mt-2 text-slate-600 dark:text-yellow-100/80 text-sm">
          اختر رقم السؤال من داخل مربع الشات، وسيظهر الجواب مباشرة.
        </p>
      </div>

      {err && (
        <div className="card p-5 border-red-200 dark:border-red-800">
          <div className="font-bold text-red-600 dark:text-red-400">
            صار خطأ
          </div>
          <div className="mt-2 text-sm dark:text-yellow-100/80">{err}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-yellow-100/60">
            تأكد من جدول faq + policy (select to anon).
          </div>
        </div>
      )}

      <div className="card p-4 md:p-6">
        <div className="h-[420px] overflow-auto rounded-xl border border-brand-100 bg-white dark:bg-[#1a1405] dark:border-yellow-700 p-4 grid gap-3">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.text}
            </Bubble>
          ))}

          <div className="rounded-xl border border-brand-200 bg-brand-50 dark:bg-[#221c08] dark:border-yellow-700 p-4">
            <div className="font-extrabold mb-3">اختر رقم السؤال:</div>

            {loading ? (
              <div className="text-sm text-slate-500 dark:text-yellow-100/60">
                جاري تحميل الأسئلة ...
              </div>
            ) : numberedFaq.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-yellow-100/80">
                ما في أسئلة مضافة. أضف أسئلة في جدول <b>faq</b>.
              </div>
            ) : (
              <div className="grid gap-2">
                {numberedFaq.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => answerByIndex(idx)}
                    className="flex items-center gap-3 text-right rounded-lg border border-brand-200 bg-white dark:bg-[#2a220a] dark:border-yellow-700 px-4 py-2 hover:bg-brand-100 dark:hover:bg-[#3a2d0d] transition"
                    title={item.category || "عام"}
                  >
                    <span className="min-w-8 text-center font-extrabold rounded-lg bg-brand-100 border border-brand-200 dark:bg-yellow-100/10 dark:border-yellow-700 px-2 py-1">
                      {item.num}
                    </span>
                    <span className="font-semibold dark:text-yellow-100">
                      {item.question}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رقم السؤال (مثلاً: 1) ثم Enter…"
            className="flex-1 rounded-xl border border-brand-200 bg-white dark:bg-[#221c08] dark:border-yellow-700 dark:text-yellow-100 dark:placeholder:text-yellow-100/50 px-3 py-3 font-semibold outline-none focus:ring-2 focus:ring-brand-200 dark:focus:ring-yellow-700"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <button className="btn-primary" onClick={send}>
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}