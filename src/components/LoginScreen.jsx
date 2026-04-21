import { useState } from "react";

export default function LoginScreen({
  passwordInput,
  setPasswordInput,
  emailInput,
  setEmailInput,
  loginError,
  handleLogin,
  handleCreateAccount,
}) {
  const [modoCadastro, setModoCadastro] = useState(false);

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Site de Dados</h1>
        <p>{modoCadastro ? "Criar conta" : "Entrar no sistema"}</p>

        <form
          onSubmit={modoCadastro ? handleCreateAccount : handleLogin}
          className="login-form"
        >
          <input
            type="email"
            placeholder="Seu e-mail"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />

          {loginError ? <p className="error-text">{loginError}</p> : null}

          <button type="submit" className="primary-btn">
            {modoCadastro ? "Criar conta" : "Entrar"}
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => setModoCadastro((prev) => !prev)}
          >
            {modoCadastro ? "Já tenho conta" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}