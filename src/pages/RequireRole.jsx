import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RequireRole({ allowedRoles, children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = error || !profile ? "user" : profile.role;

      if (allowedRoles.includes(role)) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    };

    checkAccess();
  }, [allowedRoles]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}