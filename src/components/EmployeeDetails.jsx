import React from "react";

export default function EmployeeDetails({
  selectedEmployee,
  startEditEmployee,
  deleteEmployee,
}) {
  return (
    <div>
      <div className="section-header">
        <div>
          <p className="muted">Ficha do funcionário</p>
          <h3>{selectedEmployee.nomeCompleto}</h3>
          <span className="status-badge">{selectedEmployee.status}</span>
        </div>

        <div className="action-row">
          <button
            className="secondary-btn"
            onClick={() => startEditEmployee(selectedEmployee)}
          >
            Editar
          </button>
          <button
            className="danger-btn"
            onClick={() => deleteEmployee(selectedEmployee.id)}
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="info-grid">
        <InfoCard label="Email" value={selectedEmployee.email} />
        <InfoCard label="Telefone" value={selectedEmployee.telefone} />
        <InfoCard label="CPF" value={selectedEmployee.cpf} />
        <InfoCard label="Data de entrada" value={selectedEmployee.dataEntrada} />
        <InfoCard label="Cargo" value={selectedEmployee.cargo} />
        <InfoCard label="Setor" value={selectedEmployee.setor} />
      </div>

      <div className="info-card block">
        <p className="muted">Observações</p>
        <p>{selectedEmployee.observacoes || "Sem observações."}</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="info-card">
      <p className="muted">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}