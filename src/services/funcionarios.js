import { supabase } from "../lib/supabase";

export async function listarFuncionarios(userId) {
  const { data, error } = await supabase
    .from("funcionarios")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function criarFuncionario(userId, funcionario) {
  const payload = {
    user_id: userId,
    nome_completo: funcionario.nomeCompleto,
    email: funcionario.email || null,
    telefone: funcionario.telefone || null,
    cpf: funcionario.cpf || null,
    data_entrada: funcionario.dataEntrada || null,
    cargo: funcionario.cargo || null,
    setor: funcionario.setor || null,
    observacoes: funcionario.observacoes || null,
    status: funcionario.status || "Ativo",
  };

  const { data, error } = await supabase
    .from("funcionarios")
    .insert([payload])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarFuncionario(userId, id, funcionario) {
  const payload = {
    user_id: userId,
    nome_completo: funcionario.nomeCompleto,
    email: funcionario.email || null,
    telefone: funcionario.telefone || null,
    cpf: funcionario.cpf || null,
    data_entrada: funcionario.dataEntrada || null,
    cargo: funcionario.cargo || null,
    setor: funcionario.setor || null,
    observacoes: funcionario.observacoes || null,
    status: funcionario.status || "Ativo",
  };

  const { data, error } = await supabase
    .from("funcionarios")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

export async function deletarFuncionario(userId, id) {
  const { error } = await supabase
    .from("funcionarios")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}