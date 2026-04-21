import { supabase } from "../lib/supabase";

export async function criarConta(email, senha) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

export async function trocarSenha(novaSenha) {
  const { data, error } = await supabase.auth.updateUser({
    password: novaSenha,
  });

  if (error) throw error;
  return data;
}

export async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}