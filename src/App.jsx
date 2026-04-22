import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import { criarConta, entrar, sair } from "./services/auth";

function App() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logado, setLogado] = useState(false);

  async function handleCreateAccount(e) {
    e.preventDefault();

    try {
      setLoginError("");
      await criarConta(emailInput.trim(), passwordInput);
      alert("Conta criada com sucesso! Agora clique em 'Já tenho conta' e entre.");
    } catch (error) {
      setLoginError(error.message || "Erro ao criar conta.");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoginError("");
      await entrar(emailInput.trim(), passwordInput);
      setLogado(true);
      setPasswordInput("");
    } catch (error) {
      setLoginError(error.message || "Erro ao entrar.");
    }
  }

  async function handleLogout() {
    await sair();
    setLogado(false);
    setEmailInput("");
    setPasswordInput("");
  }

  if (!logado) {
    return (
      <LoginScreen
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        loginError={loginError}
        handleLogin={handleLogin}
        handleCreateAccount={handleCreateAccount}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>🔥 Você está logado!</h1>
      <p>Email: {emailInput}</p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default App;