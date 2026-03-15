import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    setMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg("خطأ: " + error.message);
      return;
    }

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = pErr || !profile ? "user" : profile.role;

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "admin_lite") {
      navigate("/admin-lite");
    } else {
      await supabase.auth.signOut();
      setMsg("هذا الحساب غير مخول للدخول إلى لوحة التحكم");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={signIn}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        دخول
      </button>

      {msg && <div className="text-sm text-red-600">{msg}</div>}
    </div>
  );
}