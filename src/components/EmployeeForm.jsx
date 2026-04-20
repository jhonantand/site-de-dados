import React from "react";

export default function EmployeeForm({
  editingEmployee,
  setEditingEmployee,
  saveEmployee,
  setEditingEmployeeDirect,
  isCreatingEmployee,
}) {
  return (
    <div>
      <div className="section-header">
        <div>
          <h3>{isCreatingEmployee ? "Novo funcionário" : "Editar funcionário"}</h3>
          <p>Preencha os dados da ficha.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setEditingEmployeeDirect(null)}
        >
          Cancelar
        </button>
      </div>

      <div className="form-grid">
        <Input
          label="Nome completo"
          value={editingEmployee.nomeCompleto}
          onChange={(v) =>
            setEditingEmployee({ ...editingEmployee, nomeCompleto: v })
          }
        />

        <Input
          label="Email"
          value={editingEmployee.email}
          onChange={(v) => setEditingEmployee({ ...editingEmployee, email: v })}
        />

        <Input
          label="Telefone"
          value={editingEmployee.telefone}
          onChange={(v) =>
            setEditingEmployee({ ...editingEmployee, telefone: v })
          }
        />

        <Input
          label="CPF"
          value={editingEmployee.cpf}
          onChange={(v) => setEditingEmployee({ ...editingEmployee, cpf: v })}
        />

        <Input
          label="Data de entrada"
          type="date"
          value={editingEmployee.dataEntrada}
          onChange={(v) =>
            setEditingEmployee({ ...editingEmployee, dataEntrada: v })
          }
        />

        <Input
          label="Cargo"
          value={editingEmployee.cargo}
          onChange={(v) => setEditingEmployee({ ...editingEmployee, cargo: v })}
        />

        <Input
          label="Setor"
          value={editingEmployee.setor}
          onChange={(v) => setEditingEmployee({ ...editingEmployee, setor: v })}
        />

        <label className="field">
          <span>Status</span>
          <select
            value={editingEmployee.status}
            onChange={(e) =>
              setEditingEmployee({ ...editingEmployee, status: e.target.value })
            }
          >
            <option>Ativo</option>
            <option>Desligado</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Observações</span>
        <textarea
          rows={5}
          value={editingEmployee.observacoes}
          onChange={(e) =>
            setEditingEmployee({
              ...editingEmployee,
              observacoes: e.target.value,
            })
          }
        />
      </label>

      <button className="primary-btn" onClick={saveEmployee}>
        Salvar funcionário
      </button>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}