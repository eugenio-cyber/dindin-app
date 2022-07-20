import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Input";
import api from "../../services/api";
import Logo from "../../assets/logo.png";
import "./styles.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState({
    active: false,
    content: "",
    tipe: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const localWarning = { ...warning };

      if (form.password !== form.confirmPassword) {
        localWarning.active = true;
        localWarning.content = "As senhas precisam ser iguais.";
        localWarning.tipe = "error";

        return setWarning({ ...localWarning });
      }

      localWarning.active = false;
      localWarning.content = "";
      localWarning.tipe = "";
      setWarning({ ...localWarning });

      await api.post("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });

      localWarning.active = true;
      localWarning.content = "Usuário cadastrado com sucesso.";
      localWarning.tipe = "accepted";
      setWarning({ ...localWarning });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const localWarning = { ...warning };

      localWarning.active = true;
      localWarning.content = error.response.data.message;
      localWarning.tipe = "error";

      setWarning({ ...localWarning });
    }
  };

  return (
    <div className="container-img">
      <header className="header">
        <img
          className="cursor-pointer"
          src={Logo}
          alt="Ícone da logo"
          onClick={() => navigate("/")}
        />
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
              {warning.active && (
                <span
                  className={
                    warning.tipe === "error" ? "card__error" : "card__accepted"
                  }
                >
                  {warning.content}
                </span>
              )}
            </div>
            <button className="card__btn">Cadastrar</button>
          </form>
          <span className="card__register">
            Já tem cadastro?
            <span className="cursor-pointer" onClick={() => navigate("/")}>
              ⠀Clique aqui!
            </span>
          </span>
        </section>
      </main>
    </div>
  );
};

export default SignUp;
