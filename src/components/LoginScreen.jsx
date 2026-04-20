import React from "react";
import { Lock } from "lucide-react";

export default function LoginScreen({
  passwordInput,
  setPasswordInput,
  loginError,
  handleLogin,
}) {
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="badge">Painel privado</div>
        <h1>Sistema de funcionários e dados pessoais</h1>
        <p>
          Organize cadastros, encontre pessoas rápido e mantenha tudo em um
          painel só.
        </p>
      </div>

      <form onSubmit={handleLogin} className="login-card">
        <div className="login-title">
          <div className="icon-box">
            <Lock size={22} />
          </div>
          <div>
            <h2>Entrar</h2>
            <p>Senha padrão inicial: 1234</p>
          </div>
        </div>

        <label>
          <span>Senha</span>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        {loginError ? <p className="error-text">{loginError}</p> : null}

        <button type="submit" className="primary-btn full">
          Entrar no sistema
        </button>
      </form>
    </div>
  );
}