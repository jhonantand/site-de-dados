import { supabase } from "../lib/supabase";

// criar conta
export async function criarConta(email, senha) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

// login
export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

// trocar senha
export async function trocarSenha(novaSenha) {
  const { data, error } = await supabase.auth.updateUser({
    password: novaSenha,
  });

  if (error) throw error;
  return data;
}

// logout
export async function sair() {
  await supabase.auth.signOut();
}