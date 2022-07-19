import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Input";
import api from "../../services/api";
import Logo from "../../assets/logo.png";
import "./styles.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showWarningPassword, setShowWarningPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.password !== form.confirmPassword) {
        return setShowWarningPassword(true);
      }

      setShowWarningPassword(false);

      const response = await api.post("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container-img">
      <header className="header">
        <img className="logo" src={Logo} alt="Ícone da logo" />
      </header>
      <main className="signup">
        <section className="card">
          <h3 className="card__title">Cadastre-se</h3>
          <form className="card__form" onSubmit={handleSubmit}>
            <div className="card__inputs">
              <Input
                label="Nome"
                type="text"
                id="name"
                setState={setForm}
                state={form}
              />
              <Input
                label="E-mail"
                type="email"
                id="email"
                setState={setForm}
                state={form}
              />
              <Input
                label="Senha"
                type="password"
                id="password"
                setState={setForm}
                state={form}
              />
              <Input
                label="Confirmação de senha"
                type="password"
                id="confirmPassword"
                setState={setForm}
                state={form}
              />
              {showWarningPassword && (
                <span className="card__warning">
                  As senhas precisam ser iguais.
                </span>
              )}
            </div>
            <button className="card__btn">Cadastrar</button>
          </form>
          <span className="card__register">
            Já tem cadastro?
            <a
              className="cursor-pointer"
              href="/"
              onClick={() => navigate("/")}
            >
              Clique aqui!
            </a>
          </span>
        </section>
      </main>
    </div>
  );
};

export default SignUp;
