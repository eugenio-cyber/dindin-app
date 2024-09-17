import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../utils/storage";
import CardLogin from "../../components/CardLogin";
import Logo from "../../assets/logo.png";
import "./styles.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className='container-img'>
      <header className='header'>
        <img
          src={Logo}
          alt='Ícone da logo'
          className='cursor-pointer'
          onClick={() => navigate("/")}
        />
      </header>
      <main className='login'>
        <section className='login__signup'>
          <h2 className='login__title'>
            Controle suas <b className='login__bold'>finanças</b>, sem planilha
            chata.
          </h2>
          <p className='login__subtitle'>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </p>
          <button className='login__btn' onClick={() => navigate("/sign-up")}>
            Cadastre-se
          </button>
        </section>
        <CardLogin />
      </main>
    </div>
  );
};

export default Login;
