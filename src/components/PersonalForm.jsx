import React from "react";

export default function PersonalForm({
  editingPerson,
  setEditingPerson,
  savePerson,
  setEditingPersonDirect,
  isCreatingPerson,
}) {
  return (
    <div>
      <div className="section-header">
        <div>
          <h3>{isCreatingPerson ? "Nova pessoa" : "Editar pessoa"}</h3>
          <p>Organize os dados por categoria.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setEditingPersonDirect(null)}
        >
          Cancelar
        </button>
      </div>

      <Input
        label="Nome"
        value={editingPerson.nome}
        onChange={(v) => setEditingPerson({ ...editingPerson, nome: v })}
      />

      <TextArea
        label="Documentos"
        value={editingPerson.documentos}
        onChange={(v) => setEditingPerson({ ...editingPerson, documentos: v })}
      />

      <TextArea
        label="Bancos"
        value={editingPerson.bancos}
        onChange={(v) => setEditingPerson({ ...editingPerson, bancos: v })}
      />

      <TextArea
        label="Cartões"
        value={editingPerson.cartoes}
        onChange={(v) => setEditingPerson({ ...editingPerson, cartoes: v })}
      />

      <TextArea
        label="Logins"
        value={editingPerson.logins}
        onChange={(v) => setEditingPerson({ ...editingPerson, logins: v })}
      />

      <TextArea
        label="Pix"
        value={editingPerson.pix}
        onChange={(v) => setEditingPerson({ ...editingPerson, pix: v })}
      />

      <TextArea
        label="Outros"
        value={editingPerson.outros}
        onChange={(v) => setEditingPerson({ ...editingPerson, outros: v })}
      />

      <button className="primary-btn" onClick={savePerson}>
        Salvar pessoa
      </button>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}