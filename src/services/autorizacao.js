import { supabase } from "../lib/supabase";

export async function buscarMeuAcesso() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("usuarios_autorizados")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return data;
}

export async function criarRegistroInicialUsuario(nome = "") {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { error } = await supabase.from("usuarios_autorizados").upsert({
    id: user.id,
    email: user.email,
    nome,
    autorizado: false,
    role: "user",
  });

  if (error) throw error;
}