import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { getItem, removeItem } from '../../utils/storage';
import { useNavigate } from 'react-router';
import RowColumn from '../../components/RowColumn';
import Summary from '../../components/Summary';
import ModalEditProfile from '../../components/ModalEditProfile';
import ModalRecord from '../../components/ModalRecord';
import api from '../../services/api';
import Logo from '../../assets/logo.png';
import Avatar from '../../assets/avatar.png';
import Exit from '../../assets/exit.png';
import Filter from '../../assets/filter.png';
import Arrow from '../../assets/arrow.png';
import SectionFilter from '../../components/SectionFilter';
import './styles.css';

const Main = () => {
  const navigate = useNavigate();

  const [showModalEditProfile, setShowModalEditProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [categories, setCategories] = useState({});
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [ordination, setOrdination] = useState({
    growing: false,
    descending: false,
  });
  const [sectionFilter, setSectionFilter] = useState([]);
  const [modalRecord, setModalRecord] = useState({
    show: false,
    revenues: false,
    expenses: true,
    title: '',
    valor: '',
    categoria_id: '',
    data: '',
    descricao: '',
  });

  const getUser = async () => {
    try {
      const { data: user } = await api.get('/usuario', {
        headers: {
          Authorization: 'Bearer ' + getItem('token'),
        },
      });

      setCurrentUser(user);
    } catch (error) {
      alert(error.message);
    }
  };

  const getTransactions = async () => {
    try {
      const { data: transactions } = await api.get('/transacao', {
        headers: {
          Authorization: 'Bearer ' + getItem('token'),
        },
      });

      const formatTransactions = convertDataTransactions(transactions);

      setTransactions([...formatTransactions]);
    } catch (error) {
      alert(error.message);
    }
  };

  const convertDataTransactions = (transactions) => {
    const daysOfWeek = [
      '',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado',
      'Domingo',
    ];

    const formatTransactions = (transactions = transactions.map(
      (transaction) => {
        let format_data = transaction.data.slice(0, 10);
        format_data = format_data.split('-');
        format_data = `${format_data[2]}/${format_data[1]}/${format_data[0]}`;

        transaction.dia_semana =
          daysOfWeek[Number(format(parseISO(transaction.data), 'i'))];

        transaction.format_data = format_data;
        transaction.valor = `${transaction.valor / 100},00`;
        transaction.show = true;
        return transaction;
      }
    ));

    return formatTransactions;
  };

  const getSummary = async () => {
    try {
      const { data: summary } = await api.get('/transacao/extrato', {
        headers: {
          Authorization: 'Bearer ' + getItem('token'),
        },
      });

      summary.saldo = `${(summary.entrada - summary.saida) / 100},00`;
      summary.entrada = `${summary.entrada / 100},00`;
      summary.saida = `${summary.saida / 100},00`;

      setSummary(summary);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transacao/${id}`, {
        headers: {
          Authorization: 'Bearer ' + getItem('token'),
        },
      });

      getTransactions();
      getSummary();
    } catch (error) {
      alert(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const { data: categories } = await api.get('/categoria', {
        headers: {
          Authorization: 'Bearer ' + getItem('token'),
        },
      });

      setCategories(categories);

      const filters = categories.map((category) => {
        const transformFilter = {
          id: category.id,
          active: false,
          description: category.descricao,
          name: category.descricao.toLowerCase(),
        };

        return transformFilter;
      });

      setSectionFilter(filters);
    } catch (error) {
      alert(error.message);
    }
  };

  const sendEditRecord = async () => {
    let formatValue = modalRecord.valor.toString();
    formatValue = formatValue.replace('.', '');
    formatValue = formatValue.replace(',', '');
    formatValue = Number(formatValue) * 100;

    const formatDate = `${modalRecord.format_data} ${format(
      parseISO(modalRecord.data),
      'HH:mm:ss'
    )}`;

    const data = {
      tipo: modalRecord.revenues ? 'entrada' : 'saida',
      descricao: modalRecord.descricao,
      valor: formatValue,
      data: formatDate,
      categoria_id: modalRecord.categoria_id,
    };

    try {
      await api.put(
        `/transacao/${modalRecord.transacao}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getItem('token'),
          },
        }
      );

      const modal = {
        show: false,
        revenues: false,
        expenses: true,
        title: '',
        valor: '',
        categoria_id: '',
        data: '',
        descricao: '',
      };

      setModalRecord({ ...modal });
      getTransactions();
      getSummary();
    } catch (error) {
      alert(error.message);
    }
  };

  const sendRegisterRecord = async () => {
    let formatValue = modalRecord.valor.toString();
    formatValue = formatValue.replace('.', '');
    formatValue = formatValue.replace(',', '');
    formatValue = Number(formatValue) * 100;

    const date = format(new Date(), "'T'HH:mm:ss.SSS'Z'");

    const data = {
      tipo: modalRecord.revenues ? 'entrada' : 'saida',
      descricao: modalRecord.descricao,
      valor: formatValue,
      data: modalRecord.format_data + date,
      categoria_id: modalRecord.categoria_id,
    };

    try {
      await api.post(
        '/transacao',
        {
          ...data,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getItem('token'),
          },
        }
      );

      const modal = {
        show: false,
        revenues: false,
        expenses: true,
        title: '',
        valor: '',
        categoria_id: '',
        data: '',
        descricao: '',
      };

      setModalRecord({ ...modal });
      getTransactions();
      getSummary();
    } catch (error) {
      alert(error.message);
    }
  };

  const sendRecord = async (e, id) => {
    e.preventDefault();

    if (modalRecord.title === 'Editar Registro') {
      sendEditRecord();
    }

    if (modalRecord.title === 'Adicionar Registro') {
      sendRegisterRecord();
    }
  };

  const handleOrdination = () => {
    const localTransactions = transactions;

    if (!ordination.growing && !ordination.descending) {
      setOrdination({ ...ordination, growing: true });

      localTransactions.sort((a, b) => {
        a = a.format_data.split('/').reverse().join('');
        b = b.format_data.split('/').reverse().join('');

        return a > b ? 1 : a < b ? -1 : 0;
      });
    }

    if (ordination.growing) {
      setOrdination({ growing: false, descending: true });

      localTransactions.sort((a, b) => {
        a = a.format_data.split('/').reverse().join('');
        b = b.format_data.split('/').reverse().join('');
        return a < b ? 1 : a > b ? -1 : 0;
      });
    }

    if (ordination.descending) {
      setOrdination({ growing: true, descending: false });

      localTransactions.sort((a, b) => {
        a = a.format_data.split('/').reverse().join('');
        b = b.format_data.split('/').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
      });
    }

    setTransactions([...localTransactions]);
  };

  const handleExit = () => {
    removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    getUser();
    getTransactions();
    getSummary();
    getCategories();
  }, []);

  return (
    <div className="container-main">
      <header className="header">
        <img className=" cursor-pointer" src={Logo} alt="Ícone da logo" />
        <div className="profile">
          <img
            className=" cursor-pointer"
            src={Avatar}
            alt="Imagem profile"
            onClick={() => setShowModalEditProfile(!showModalEditProfile)}
          />
          <span className="profile__name cursor-pointer">
            {currentUser.nome}
          </span>
          <img
            className=" cursor-pointer"
            src={Exit}
            alt="Ícone de saída"
            onClick={() => handleExit()}
          />
        </div>
      </header>

      <main className="main">
        <div className="main__content">
          <button
            className="btn-filter cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <img
              className="btn-filter__img"
              src={Filter}
              alt="Ícone de filtro"
            />
            Filtrar
          </button>

          {showFilter && (
            <SectionFilter
              setSectionFilter={setSectionFilter}
              sectionFilter={sectionFilter}
              transactions={transactions}
              setTransactions={setTransactions}
              getTransactions={getTransactions}
            />
          )}

          <table className="table">
            <thead>
              <tr className="table__top">
                <th
                  className="table__topic cursor-pointer"
                  onClick={() => handleOrdination()}
                >
                  Data
                  <img
                    className="table__arrow "
                    src={Arrow}
                    alt="Ícone da seta"
                  />
                </th>
                <th className="table__topic">Dia da semana</th>
                <th className="table__topic">Descrição</th>
                <th className="table__topic">Categoria</th>
                <th className="table__topic">Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                transaction.color =
                  transaction.tipo === 'entrada' ? '#7b61ff' : '#fa8c10';

                return (
                  transaction.show && (
                    <RowColumn
                      key={transaction.id}
                      deleteTransaction={deleteTransaction}
                      transaction={transaction}
                      modalRecord={modalRecord}
                      setModalRecord={setModalRecord}
                    />
                  )
                );
              })}
            </tbody>
          </table>
        </div>

        <Summary
          revenues={summary.entrada}
          expenses={summary.saida}
          balance={summary.saldo}
          setModalRecord={setModalRecord}
          modalRecord={modalRecord}
        />
      </main>
      {showModalEditProfile && (
        <ModalEditProfile
          setShowModalEditProfile={setShowModalEditProfile}
          showModalEditProfile={showModalEditProfile}
          currentUser={currentUser}
        />
      )}
      {modalRecord.show && (
        <ModalRecord
          modalRecord={modalRecord}
          setModalRecord={setModalRecord}
          categories={categories}
          sendRecord={sendRecord}
        />
      )}
    </div>
  );
};

export default Main;
