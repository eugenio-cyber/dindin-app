import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { setItem } from "../../utils/storage";
import Input from "../Input";
import "./styles.css";

const CardLogin = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState({
    active: false,
    content: "",
    tipe: "",
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localWarning = { ...warning };

    try {
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });
      const { token } = response.data;

      setItem("token", token);

      localWarning.active = true;
      localWarning.content = "Login feito com sucesso.";
      localWarning.tipe = "accepted";
      setWarning({ ...localWarning });

      setTimeout(() => {
        navigate("/main");
      }, 1000);
    } catch (error) {
      localWarning.active = true;
      localWarning.content = error.response.data;
      localWarning.tipe = "error";

      setWarning({ ...localWarning });
    }
  };

  return (
    <div className='card-login'>
      <h3 className='card-login__title'>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className='card-login__inputs'>
          <Input
            label='E-mail'
            type='email'
            id='email'
            setState={setForm}
            state={form}
          />
          <Input
            label='Password'
            type='password'
            id='password'
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
        <button className='card-login__btn'>Entrar</button>
      </form>
    </div>
  );
};

export default CardLogin;
