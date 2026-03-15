import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

// ===== Small UI helpers =====
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-2 rounded ${active ? "bg-black text-white" : ""}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <div className="text-sm">{label}</div>
      {children}
    </div>
  );
}

// ===== Generic CRUD for simple tables =====
function SimpleCrud({ table, title, columns, defaultRow }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(defaultRow);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setMsg("");
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) setMsg("خطأ: " + error.message);
    else setRows(data || []);
  };

  useEffect(() => { load(); }, [table]);

  const onSubmit = async () => {
    setMsg("");
    if (editingId) {
      const { error } = await supabase.from(table).update(form).eq("id", editingId);
      if (error) setMsg("خطأ: " + error.message);
      else {
        setMsg("✅ تم التعديل");
        setEditingId(null);
        setForm(defaultRow);
        load();
      }
    } else {
      const { error } = await supabase.from(table).insert(form);
      if (error) setMsg("خطأ: " + error.message);
      else {
        setMsg("✅ تمت الإضافة");
        setForm(defaultRow);
        load();
      }
    }
  };

  const onEdit = (r) => {
    setMsg("");
    setEditingId(r.id);
    // خذ فقط الأعمدة اللي بتهمنا
    const f = {};
    for (const c of columns) f[c.key] = r[c.key] ?? "";
    setForm(f);
  };

  const onDelete = async (id) => {
    if (!confirm("متأكد بدك تحذف؟")) return;
    setMsg("");
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setMsg("خطأ: " + error.message);
    else {
      setMsg("✅ تم الحذف");
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">{title}</div>

      <div className="border rounded p-4 space-y-3">
        <div className="font-bold">{editingId ? "تعديل" : "إضافة"}</div>

        <div className="grid gap-3">
          {columns.map((c) => (
            <Field key={c.key} label={c.label}>
              {c.type === "textarea" ? (
                <textarea
                  className="border p-2 w-full"
                  value={form[c.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              ) : (
                <input
                  className="border p-2 w-full"
                  value={form[c.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </Field>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onSubmit} className="bg-black text-white px-4 py-2 rounded">
            {editingId ? "حفظ التعديل" : "إضافة"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(defaultRow);
                setMsg("");
              }}
              className="border px-4 py-2 rounded"
            >
              إلغاء
            </button>
          )}
        </div>

        {msg && <div className="text-sm">{msg}</div>}
      </div>

      <div className="border rounded p-4">
        <div className="font-bold mb-2">المدخلات</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                {columns.map((c) => (
                  <th key={c.key} className="text-right p-2">{c.label}</th>
                ))}
                <th className="text-right p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  {columns.map((c) => (
                    <td key={c.key} className="p-2">{String(r[c.key] ?? "")}</td>
                  ))}
                  <td className="p-2 flex gap-2">
                    <button className="border px-3 py-1 rounded" onClick={() => onEdit(r)}>تعديل</button>
                    <button className="border px-3 py-1 rounded" onClick={() => onDelete(r.id)}>حذف</button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="p-2" colSpan={columns.length + 1}>لا يوجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== Majors (needs college dropdown) =====
function MajorsCrud({ colleges }) {
  return (
    <RelCrud
      title="التخصصات"
      table="majors"
      parentLabel="الكلية"
      parentKey="college_id"
      parentOptions={colleges.map((c) => ({ value: c.id, label: c.name }))}
      fields={[
        { key: "name", label: "اسم التخصص" },
        { key: "description", label: "وصف", type: "textarea" },
      ]}
    />
  );
}

// ===== Materials (needs major dropdown) =====
function MaterialsCrud({ majors }) {
  return (
    <RelCrud
      title="المواد"
      table="materials"
      parentLabel="التخصص"
      parentKey="major_id"
      parentOptions={majors.map((m) => ({ value: m.id, label: m.name }))}
      fields={[
        { key: "course_name", label: "اسم المادة" },
        { key: "course_code", label: "رمز المادة" },
        { key: "year_level", label: "السنة (رقم)" },
      ]}
    />
  );
}

// ===== Generic CRUD with relation dropdown =====
function RelCrud({ title, table, parentLabel, parentKey, parentOptions, fields }) {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(() => {
    const base = { [parentKey]: "" };
    for (const f of fields) base[f.key] = "";
    return base;
  }, [parentKey, fields]);

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setMsg("");
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) setMsg("خطأ: " + error.message);
    else setRows(data || []);
  };

  useEffect(() => { load(); }, [table]);

  useEffect(() => { setForm(emptyForm); }, [emptyForm]);

  const onSubmit = async () => {
    setMsg("");
    if (!form[parentKey]) {
      setMsg(`اختَر ${parentLabel} أولاً`);
      return;
    }

    const payload = { ...form };
    // year_level رقم (لو موجود)
    if ("year_level" in payload && payload.year_level !== "") payload.year_level = Number(payload.year_level);

    if (editingId) {
      const { error } = await supabase.from(table).update(payload).eq("id", editingId);
      if (error) setMsg("خطأ: " + error.message);
      else {
        setMsg("✅ تم التعديل");
        setEditingId(null);
        setForm(emptyForm);
        load();
      }
    } else {
      const { error } = await supabase.from(table).insert(payload);
      if (error) setMsg("خطأ: " + error.message);
      else {
        setMsg("✅ تمت الإضافة");
        setForm(emptyForm);
        load();
      }
    }
  };

  const onEdit = (r) => {
    setMsg("");
    setEditingId(r.id);
    const f = { [parentKey]: r[parentKey] ?? "" };
    for (const fld of fields) f[fld.key] = r[fld.key] ?? "";
    setForm(f);
  };

  const onDelete = async (id) => {
    if (!confirm("متأكد بدك تحذف؟")) return;
    setMsg("");
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setMsg("خطأ: " + error.message);
    else {
      setMsg("✅ تم الحذف");
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">{title}</div>

      <div className="border rounded p-4 space-y-3">
        <div className="font-bold">{editingId ? "تعديل" : "إضافة"}</div>

        <Field label={parentLabel}>
          <select
            className="border p-2 w-full"
            value={form[parentKey]}
            onChange={(e) => setForm({ ...form, [parentKey]: e.target.value })}
          >
            <option value="">-- اختر --</option>
            {parentOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <div className="grid gap-3">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "textarea" ? (
                <textarea
                  className="border p-2 w-full"
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : (
                <input
                  className="border p-2 w-full"
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </Field>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onSubmit} className="bg-black text-white px-4 py-2 rounded">
            {editingId ? "حفظ التعديل" : "إضافة"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setMsg("");
              }}
              className="border px-4 py-2 rounded"
            >
              إلغاء
            </button>
          )}
        </div>

        {msg && <div className="text-sm">{msg}</div>}
      </div>

      <div className="border rounded p-4">
        <div className="font-bold mb-2">المدخلات</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2">{parentLabel}</th>
                {fields.map((f) => (
                  <th key={f.key} className="text-right p-2">{f.label}</th>
                ))}
                <th className="text-right p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{String(r[parentKey] ?? "")}</td>
                  {fields.map((f) => (
                    <td key={f.key} className="p-2">{String(r[f.key] ?? "")}</td>
                  ))}
                  <td className="p-2 flex gap-2">
                    <button className="border px-3 py-1 rounded" onClick={() => onEdit(r)}>تعديل</button>
                    <button className="border px-3 py-1 rounded" onClick={() => onDelete(r.id)}>حذف</button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="p-2" colSpan={fields.length + 2}>لا يوجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== Page =====
export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("guest");
  const [msg, setMsg] = useState("");

  const [tab, setTab] = useState("colleges");

  const [colleges, setColleges] = useState([]);
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    (async () => {
      setMsg("");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const r = pErr ? "user" : profile.role;
      setRole(r);

      if (r !== "admin") {
        setLoading(false);
        return;
      }

      // preload dropdown data
      const { data: c } = await supabase.from("colleges").select("id,name").order("name");
      const { data: m } = await supabase.from("majors").select("id,name").order("name");
      setColleges(c || []);
      setMajors(m || []);

      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (role !== "admin") return <div className="p-4 text-red-600">Not allowed</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة Super Admin</h1>
        <button onClick={logout} className="border px-3 py-1 rounded">
          تسجيل خروج
        </button>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      <div className="flex flex-wrap gap-2">
        <TabBtn active={tab === "colleges"} onClick={() => setTab("colleges")}>الكليات</TabBtn>
        <TabBtn active={tab === "majors"} onClick={() => setTab("majors")}>التخصصات</TabBtn>
        <TabBtn active={tab === "materials"} onClick={() => setTab("materials")}>المواد</TabBtn>
        <TabBtn active={tab === "announcements"} onClick={() => setTab("announcements")}>الإعلانات</TabBtn>
        <TabBtn active={tab === "faq"} onClick={() => setTab("faq")}>FAQ</TabBtn>
        <TabBtn active={tab === "housing"} onClick={() => setTab("housing")}>السكنات</TabBtn>
      </div>

      <div className="border rounded p-4">
        {tab === "colleges" && (
          <SimpleCrud
            table="colleges"
            title="إدارة الكليات"
            defaultRow={{ name: "", description: "", image_url: "" }}
            columns={[
              { key: "name", label: "اسم الكلية" },
              { key: "description", label: "وصف", type: "textarea" },
              { key: "image_url", label: "رابط صورة" },
            ]}
          />
        )}

        {tab === "majors" && <MajorsCrud colleges={colleges} />}

        {tab === "materials" && <MaterialsCrud majors={majors} />}

        {tab === "announcements" && (
          <SimpleCrud
            table="announcements"
            title="إدارة الإعلانات"
            defaultRow={{ title: "", content: "" }}
            columns={[
              { key: "title", label: "العنوان" },
              { key: "content", label: "المحتوى", type: "textarea" },
            ]}
          />
        )}

        {tab === "faq" && (
          <SimpleCrud
            table="faq"
            title="إدارة FAQ"
            defaultRow={{ question: "", answer: "" }}
            columns={[
              { key: "question", label: "السؤال" },
              { key: "answer", label: "الجواب", type: "textarea" },
            ]}
          />
        )}

        {tab === "housing" && (
          <SimpleCrud
            table="housing"
            title="إدارة السكنات"
            defaultRow={{ name: "", gender: "", phone: "", location: "", description: "" }}
            columns={[
              { key: "name", label: "اسم السكن" },
              { key: "gender", label: "الجنس (ذكور/إناث)" },
              { key: "phone", label: "رقم التواصل" },
              { key: "location", label: "الموقع" },
              { key: "description", label: "وصف", type: "textarea" },
            ]}
          />
        )}
      </div>
    </div>
  );
}
