import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, Lock, Plus, UserCircle2, Users } from "lucide-react";
import { initialPeople } from "./data/mockData";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeDetails from "./components/EmployeeDetails";
import PersonalForm from "./components/PersonalForm";
import PersonalDetails from "./components/PersonalDetails";
import { supabase } from "./lib/supabase";
import { entrar, criarConta, trocarSenha, sair } from "./services/auth";
import {
  buscarMeuAcesso,
  criarRegistroInicialUsuario,
} from "./services/autorizacao";
import {
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
} from "./services/funcionarios";

const emptyEmployee = {
  id: "",
  nomeCompleto: "",
  email: "",
  telefone: "",
  cpf: "",
  dataEntrada: "",
  cargo: "",
  setor: "",
  observacoes: "",
  status: "Ativo",
};

const emptyPerson = {
  id: "",
  nome: "",
  documentos: "",
  bancos: "",
  cartoes: "",
  logins: "",
  pix: "",
  outros: "",
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [acesso, setAcesso] = useState(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [data, setData] = useState({
    funcionarios: [],
    pessoas: initialPeople,
  });

  const [module, setModule] = useState("dashboard");

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isCreatingPerson, setIsCreatingPerson] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const userId = session?.user?.id;

  useEffect(() => {
    async function carregarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoadingSession(false);
    }

    carregarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionAtual) => {
      setSession(sessionAtual);
      setLoadingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function carregarAcesso() {
      if (!session) {
        setAcesso(null);
        return;
      }

      try {
        const registro = await buscarMeuAcesso();
        setAcesso(registro);
      } catch (error) {
        console.error("Erro ao buscar acesso:", error.message);
      }
    }

    carregarAcesso();
  }, [session]);

  useEffect(() => {
    if (userId) {
      carregarFuncionariosDoBanco();
    }
  }, [userId]);

  async function carregarFuncionariosDoBanco() {
    if (!userId) return;

    try {
      const funcionarios = await listarFuncionarios(userId);

      const funcionariosFormatados = (funcionarios || []).map((item) => ({
        id: item.id,
        nomeCompleto: item.nome_completo || "",
        email: item.email || "",
        telefone: item.telefone || "",
        cpf: item.cpf || "",
        dataEntrada: item.data_entrada || "",
        cargo: item.cargo || "",
        setor: item.setor || "",
        observacoes: item.observacoes || "",
        status: item.status || "Ativo",
      }));

      setData((prev) => ({
        ...prev,
        funcionarios: funcionariosFormatados,
      }));
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error.message);
    }
  }

  const filteredEmployees = useMemo(() => {
    const term = employeeSearch.toLowerCase().trim();
    return data.funcionarios.filter((item) =>
      [
        item.nomeCompleto,
        item.email,
        item.telefone,
        item.cpf,
        item.cargo,
        item.setor,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [data.funcionarios, employeeSearch]);

  const filteredPeople = useMemo(() => {
    const term = personSearch.toLowerCase().trim();
    return data.pessoas.filter((item) =>
      item.nome.toLowerCase().includes(term)
    );
  }, [data.pessoas, personSearch]);

  const selectedEmployee =
    data.funcionarios.find((item) => item.id === selectedEmployeeId) || null;

  const selectedPerson =
    data.pessoas.find((item) => item.id === selectedPersonId) || null;

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoginError("");
      await entrar(emailInput, passwordInput);
      setPasswordInput("");
    } catch (error) {
      setLoginError(error.message || "Erro ao entrar.");
    }
  }

  async function handleCreateAccount(e) {
    e.preventDefault();

    try {
      setLoginError("");
      await criarConta(emailInput, passwordInput);
      await entrar(emailInput, passwordInput);
      await criarRegistroInicialUsuario();
      alert("Conta criada. Agora aguarde tua autorização para entrar.");
    } catch (error) {
      setLoginError(error.message || "Erro ao criar conta.");
    }
  }

  function startCreateEmployee() {
    setIsCreatingEmployee(true);
    setEditingEmployee({ ...emptyEmployee, id: crypto.randomUUID() });
    setSelectedEmployeeId(null);
  }

  function startEditEmployee(employee) {
    setIsCreatingEmployee(false);
    setEditingEmployee({ ...employee });
  }

  async function saveEmployee() {
    if (!editingEmployee?.nomeCompleto?.trim() || !userId) return;

    try {
      const existe = data.funcionarios.some((f) => f.id === editingEmployee.id);

      if (existe) {
        await atualizarFuncionario(userId, editingEmployee.id, editingEmployee);
      } else {
        await criarFuncionario(userId, editingEmployee);
      }

      await carregarFuncionariosDoBanco();

      setSelectedEmployeeId(editingEmployee.id);
      setEditingEmployee(null);
      setIsCreatingEmployee(false);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error.message);
      alert("Erro ao salvar funcionário.");
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm("Deseja excluir este funcionário?") || !userId) return;

    try {
      await deletarFuncionario(userId, id);
      await carregarFuncionariosDoBanco();

      if (selectedEmployeeId === id) setSelectedEmployeeId(null);
      if (editingEmployee?.id === id) setEditingEmployee(null);
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error.message);
      alert("Erro ao excluir funcionário.");
    }
  }

  function startCreatePerson() {
    setIsCreatingPerson(true);
    setEditingPerson({ ...emptyPerson, id: crypto.randomUUID() });
    setSelectedPersonId(null);
  }

  function startEditPerson(person) {
    setIsCreatingPerson(false);
    setEditingPerson({ ...person });
  }

  function savePerson() {
    if (!editingPerson?.nome?.trim()) return;

    setData((prev) => {
      const exists = prev.pessoas.some((p) => p.id === editingPerson.id);

      return {
        ...prev,
        pessoas: exists
          ? prev.pessoas.map((p) =>
              p.id === editingPerson.id ? editingPerson : p
            )
          : [editingPerson, ...prev.pessoas],
      };
    });

    setSelectedPersonId(editingPerson.id);
    setEditingPerson(null);
    setIsCreatingPerson(false);
  }

  function deletePerson(id) {
    if (!window.confirm("Deseja excluir esta pessoa?")) return;

    setData((prev) => ({
      ...prev,
      pessoas: prev.pessoas.filter((p) => p.id !== id),
    }));

    if (selectedPersonId === id) setSelectedPersonId(null);
    if (editingPerson?.id === id) setEditingPerson(null);
  }

  async function saveNewPassword() {
    if (!newPassword.trim()) return;

    try {
      await trocarSenha(newPassword.trim());
      setNewPassword("");
      alert("Senha alterada com sucesso.");
    } catch (error) {
      alert(error.message || "Erro ao alterar senha.");
    }
  }

  async function handleLogout() {
    try {
      await sair();
      setModule("dashboard");
      setSelectedEmployeeId(null);
      setSelectedPersonId(null);
      setEditingEmployee(null);
      setEditingPerson(null);
    } catch (error) {
      alert(error.message || "Erro ao sair.");
    }
  }

  if (loadingSession) {
    return <div style={{ padding: 20 }}>Carregando...</div>;
  }

  if (!session) {
    return (
      <LoginScreen
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        loginError={loginError}
        handleLogin={handleLogin}
        handleCreateAccount={handleCreateAccount}
      />
    );
  }

  if (!acesso?.autorizado) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Acesso pendente</h1>
        <p>Tua conta foi criada, mas ainda não foi autorizada.</p>
        <p>Quando tu autorizar esse usuário no banco, ele entra normal.</p>
        <button className="secondary-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar module={module} setModule={setModule} />

      <main className="main-content">
        {module === "dashboard" && (
          <section>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Resumo rápido do sistema.</p>

            <div className="stats-grid">
              <StatCard
                title="Funcionários"
                value={data.funcionarios.length}
                icon={<Briefcase size={22} />}
              />
              <StatCard
                title="Pessoas cadastradas"
                value={data.pessoas.length}
                icon={<Users size={22} />}
              />
              <StatCard
                title="Ativos"
                value={
                  data.funcionarios.filter((item) => item.status === "Ativo")
                    .length
                }
                icon={<Lock size={22} />}
              />
            </div>
          </section>
        )}

        {module === "funcionarios" && (
          <section className="two-column">
            <div className="panel">
              <div className="panel-top">
                <div>
                  <h2>Funcionários</h2>
                  <p>Pesquise e abra a ficha.</p>
                </div>

                <button className="primary-btn" onClick={startCreateEmployee}>
                  <Plus size={18} />
                  Novo
                </button>
              </div>

              <SearchBar
                value={employeeSearch}
                onChange={setEmployeeSearch}
                placeholder="Buscar funcionário..."
              />

              <div className="list-area">
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    className={`list-item ${
                      selectedEmployeeId === employee.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setEditingEmployee(null);
                      setIsCreatingEmployee(false);
                    }}
                  >
                    <strong>{employee.nomeCompleto}</strong>
                    <span>{employee.cargo || "Sem cargo"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              {editingEmployee ? (
                <EmployeeForm
                  editingEmployee={editingEmployee}
                  setEditingEmployee={setEditingEmployee}
                  saveEmployee={saveEmployee}
                  setEditingEmployeeDirect={setEditingEmployee}
                  isCreatingEmployee={isCreatingEmployee}
                />
              ) : selectedEmployee ? (
                <EmployeeDetails
                  selectedEmployee={selectedEmployee}
                  startEditEmployee={startEditEmployee}
                  deleteEmployee={deleteEmployee}
                />
              ) : (
                <EmptyState
                  title="Escolha um funcionário"
                  subtitle="Abra uma ficha existente ou clique em Novo para cadastrar alguém."
                />
              )}
            </div>
          </section>
        )}

        {module === "pessoas" && (
          <section className="two-column">
            <div className="panel">
              <div className="panel-top">
                <div>
                  <h2>Dados pessoais</h2>
                  <p>Abra o cadastro por pessoa.</p>
                </div>

                <button className="primary-btn" onClick={startCreatePerson}>
                  <Plus size={18} />
                  Novo
                </button>
              </div>

              <SearchBar
                value={personSearch}
                onChange={setPersonSearch}
                placeholder="Buscar pessoa..."
              />

              <div className="list-area">
                {filteredPeople.map((person) => (
                  <button
                    key={person.id}
                    className={`list-item ${
                      selectedPersonId === person.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedPersonId(person.id);
                      setEditingPerson(null);
                      setIsCreatingPerson(false);
                    }}
                  >
                    <strong>{person.nome}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              {editingPerson ? (
                <PersonalForm
                  editingPerson={editingPerson}
                  setEditingPerson={setEditingPerson}
                  savePerson={savePerson}
                  setEditingPersonDirect={setEditingPerson}
                  isCreatingPerson={isCreatingPerson}
                />
              ) : selectedPerson ? (
                <PersonalDetails
                  selectedPerson={selectedPerson}
                  startEditPerson={startEditPerson}
                  deletePerson={deletePerson}
                />
              ) : (
                <EmptyState
                  title="Escolha uma pessoa"
                  subtitle="Abra um cadastro existente ou clique em Novo para cadastrar alguém."
                />
              )}
            </div>
          </section>
        )}

        {module === "configuracoes" && (
          <section className="panel settings-panel">
            <h2>Configurações</h2>
            <p>Troque a senha da tua conta.</p>

            <label className="field">
              <span>Nova senha</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </label>

            <div className="action-row">
              <button className="primary-btn" onClick={saveNewPassword}>
                Salvar nova senha
              </button>

              <button className="secondary-btn" onClick={handleLogout}>
                Sair do sistema
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div>
        <p className="muted">{title}</p>
        <h3>{value}</h3>
      </div>
      <div className="icon-box">{icon}</div>
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="icon-box">
        <UserCircle2 size={24} />
      </div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}