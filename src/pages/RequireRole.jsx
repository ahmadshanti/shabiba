import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * RequireRole:
 * - يمنع الوصول إلا للمسجلين دخول
 * - ويتأكد أن role ضمن allowedRoles
 *
 * الاستخدام:
 * <RequireRole allowedRoles={["admin"]}> <Admin/> </RequireRole>
 */
export default function RequireRole({ allowedRoles, children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      // لازم يكون داخل
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // اقرأ الدور من profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = error ? "user" : profile.role;

      if (!allowedRoles.includes(role)) {
        window.location.href = "/"; // أو صفحة NotAllowed
        return;
      }

      setAllowed(true);
      setLoading(false);
    })();
  }, [allowedRoles]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!allowed) return null;

  return children;
}
