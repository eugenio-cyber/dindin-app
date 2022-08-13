import { useState } from 'react';
import { getItem } from '../../utils/storage';
import api from '../../services/api';
import Input from '../Input';
import Close from '../../assets/close.png';
import './styles.css';

const ModalEditProfile = ({
  setShowModalEditProfile,
  showModalEditProfile,
  currentUser,
}) => {
  const [showWarningPassword, setShowWarningPassword] = useState({
    active: false,
    text: '',
    tipe: '',
  });
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
        return setShowWarningPassword({
          active: true,
          text: 'As senhas precisam ser iguais.',
          tipe: 'error',
        });
      }

      await api.put(
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

      setShowWarningPassword({
        active: true,
        text: 'Dados alterados com sucesso!',
        tipe: 'accepted',
      });
      setForm({ ...form, password: '', confirmPassword: '' });

      setTimeout(() => {
        setShowModalEditProfile(!showModalEditProfile);
      }, 1000);
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
              <span
                className="card__warning"
                style={{
                  color: `var(${
                    showWarningPassword.tipe === 'error'
                      ? '--message-error'
                      : '--message-accepted'
                  })`,
                }}
              >
                {showWarningPassword.text}
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
