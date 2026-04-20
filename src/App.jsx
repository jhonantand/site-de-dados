import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, Lock, Plus, UserCircle2, Users } from "lucide-react";
import { initialEmployees, initialPeople } from "./data/mockData";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeDetails from "./components/EmployeeDetails";
import PersonalForm from "./components/PersonalForm";
import PersonalDetails from "./components/PersonalDetails";

const STORAGE_KEY = "painel_empresa_jhonantan_v2";
const PASSWORD_KEY = "painel_empresa_password_v2";

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

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      funcionarios: initialEmployees,
      pessoas: initialPeople,
    };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {
      funcionarios: initialEmployees,
      pessoas: initialPeople,
    };
  }
}

function loadPassword() {
  return localStorage.getItem(PASSWORD_KEY) || "1234";
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState({ funcionarios: [], pessoas: [] });
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

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

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

  function handleLogin(e) {
    e.preventDefault();

    if (passwordInput === loadPassword()) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta.");
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

  function saveEmployee() {
    if (!editingEmployee?.nomeCompleto?.trim()) return;

    setData((prev) => {
      const exists = prev.funcionarios.some((f) => f.id === editingEmployee.id);

      return {
        ...prev,
        funcionarios: exists
          ? prev.funcionarios.map((f) =>
              f.id === editingEmployee.id ? editingEmployee : f
            )
          : [editingEmployee, ...prev.funcionarios],
      };
    });

    setSelectedEmployeeId(editingEmployee.id);
    setEditingEmployee(null);
    setIsCreatingEmployee(false);
  }

  function deleteEmployee(id) {
    if (!window.confirm("Deseja excluir este funcionário?")) return;

    setData((prev) => ({
      ...prev,
      funcionarios: prev.funcionarios.filter((f) => f.id !== id),
    }));

    if (selectedEmployeeId === id) setSelectedEmployeeId(null);
    if (editingEmployee?.id === id) setEditingEmployee(null);
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

  function saveNewPassword() {
    if (!newPassword.trim()) return;
    localStorage.setItem(PASSWORD_KEY, newPassword.trim());
    setNewPassword("");
    alert("Senha alterada com sucesso.");
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        loginError={loginError}
        handleLogin={handleLogin}
      />
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
            <p>Troque a senha de entrada do sistema.</p>

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

              <button
                className="secondary-btn"
                onClick={() => setIsAuthenticated(false)}
              >
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