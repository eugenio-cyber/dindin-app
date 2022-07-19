import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { setItem } from "../../utils/storage";
import Input from "../Input";
import "./styles.css";

const CardLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email: form.email,
        senha: form.password,
      });

      const { token } = response.data;

      setItem("token", token);

      navigate("/main");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card-login">
      <h3 className="card-login__title">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="card-login__inputs">
          <Input
            label="E-mail"
            type="email"
            id="email"
            setState={setForm}
            state={form}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            setState={setForm}
            state={form}
          />
        </div>
        <button className="card-login__btn">Entrar</button>
      </form>
    </div>
  );
};

export default CardLogin;
