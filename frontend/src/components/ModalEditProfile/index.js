import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../utils/storage';
import api from '../../services/api';
import Input from '../Input';
import Close from '../../assets/close.png';
import './styles.css';

const ModalEditProfile = ({ setShowModalEditProfile, currentUser }) => {
  const navigate = useNavigate();
  const [showWarningPassword, setShowWarningPassword] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.nome,
    email: currentUser.email,
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.password !== form.confirmPassword) {
        return setShowWarningPassword(true);
      }

      setShowWarningPassword(false);

      const response = await api.put(
        '/usuario',
        {
          nome: form.name,
          email: form.email,
          senha: form.password,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getItem('token'),
          },
        }
      );

      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section className="container-modal-edit">
      <div className="modal-edit">
        <div className="modal-edit__top">
          <h2 className="modal-edit__title">Editar Perfil</h2>
          <img
            className="btn-close cursor-pointer"
            src={Close}
            alt="Botão fechar"
            onClick={() => setShowModalEditProfile(false)}
          />
        </div>
        <form className="modal-edit__form" onSubmit={handleSubmit}>
          <div className="modal-edit__inputs">
            <Input
              setState={setForm}
              state={form}
              label="Nome"
              type="text"
              id="name"
              value={form.name}
            />
            <Input
              setState={setForm}
              state={form}
              label="E-mail"
              type="email"
              id="email"
              value={form.email}
            />
            <Input
              setState={setForm}
              state={form}
              label="Senha"
              type="password"
              id="password"
            />
            <Input
              setState={setForm}
              state={form}
              label="Confirmação de senha"
              type="password"
              id="confirmPassword"
            />
            {showWarningPassword && (
              <span className="card__warning">
                As senhas precisam ser iguais.
              </span>
            )}
          </div>
          <button className="modal-edit__btn">Confirmar</button>
        </form>
      </div>
    </section>
  );
};

export default ModalEditProfile;
