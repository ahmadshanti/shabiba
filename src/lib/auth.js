import { supabase } from "./supabase";

export async function getMyRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: "guest", user: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (error) return { role: "user", user };
  return { role: data.role, user };
}
