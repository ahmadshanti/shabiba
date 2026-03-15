import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLite() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("guest");
  const [userId, setUserId] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("drive");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setMsg("");

      // 1) لازم يكون داخل
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      // 2) اقرأ الدور
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const r = pErr ? "user" : profile.role;
      setRole(r);

      // 3) جيب المواد للـ dropdown (حسب جدولك)
      const { data: mats, error: mErr } = await supabase
        .from("materials")
        .select("id, course_name")
        .order("course_name");

      if (mErr) setMsg("خطأ بجلب المواد: " + mErr.message);
      else setMaterials(mats || []);

      setLoading(false);
    })();
  }, []);

  const addFile = async () => {
    setMsg("");
    if (!materialId || !title || !fileUrl) {
      setMsg("عبّي كل الحقول");
      return;
    }

    const { error } = await supabase.from("material_files").insert({
      material_id: materialId,
      title,
      file_url: fileUrl,
      file_type: fileType,
      uploaded_by: userId, // مهم للـ RLS
    });

    if (error) setMsg("خطأ: " + error.message);
    else {
      setMsg("✅ تمت إضافة الملف");
      setTitle("");
      setFileUrl("");
      setMaterialId("");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (role !== "admin" && role !== "admin_lite")
    return <div className="p-4 text-red-600">Not allowed</div>;

  return (
    <div className="p-6 max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة الأدمن البسيط</h1>
        <button onClick={logout} className="border px-3 py-1 rounded">
          تسجيل خروج
        </button>
      </div>

      <div className="text-green-700">✅ صفحة الأدمن البسيط شغالة</div>

      <div className="space-y-2">
        <label className="block">اختر المادة</label>
        <select
          className="border p-2 w-full"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        >
          <option value="">
            {materials.length ? "-- اختر --" : "لا يوجد مواد"}
          </option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.course_name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block">عنوان الملف</label>
        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: ملخص المحاضرة 1"
        />
      </div>

      <div className="space-y-2">
        <label className="block">رابط الملف</label>
        <input
          className="border p-2 w-full"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="ضع رابط Google Drive أو PDF"
        />
      </div>

      <div className="space-y-2">
        <label className="block">نوع الملف</label>
        <select
          className="border p-2 w-full"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="drive">Drive</option>
          <option value="pdf">PDF</option>
          <option value="link">Link</option>
        </select>
      </div>

      <button onClick={addFile} className="bg-black text-white px-4 py-2 rounded">
        إضافة الملف
      </button>

      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
