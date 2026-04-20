import React from "react";

export default function PersonalDetails({
  selectedPerson,
  startEditPerson,
  deletePerson,
}) {
  return (
    <div>
      <div className="section-header">
        <div>
          <p className="muted">Cadastro pessoal</p>
          <h3>{selectedPerson.nome}</h3>
        </div>

        <div className="action-row">
          <button
            className="secondary-btn"
            onClick={() => startEditPerson(selectedPerson)}
          >
            Editar
          </button>
          <button
            className="danger-btn"
            onClick={() => deletePerson(selectedPerson.id)}
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="info-grid">
        <CategoryBox title="Documentos" value={selectedPerson.documentos} />
        <CategoryBox title="Bancos" value={selectedPerson.bancos} />
        <CategoryBox title="Cartões" value={selectedPerson.cartoes} />
        <CategoryBox title="Logins" value={selectedPerson.logins} />
        <CategoryBox title="Pix" value={selectedPerson.pix} />
        <CategoryBox title="Outros" value={selectedPerson.outros} />
      </div>
    </div>
  );
}

function CategoryBox({ title, value }) {
  return (
    <div className="info-card">
      <p className="category-title">{title}</p>
      <p className="pre-wrap">{value || "Sem dados."}</p>
    </div>
  );
}