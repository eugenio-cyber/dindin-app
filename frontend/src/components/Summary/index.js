import './styles.css';

const Summary = ({ revenues, expenses, balance, setModalRecord }) => {
  return (
    <section className="summary">
      <div className="summary__body">
        <h3 className="summary__title">Resumo</h3>
        <div className="revenues">
          <span className="revenues__subtitle">Entradas</span>
          <span className="revenues__value">R$ {revenues}</span>
        </div>
        <div className="expenses">
          <span className="expenses__subtitle">Saídas</span>
          <span className="expenses__value">R$ {expenses}</span>
        </div>
        <div className="balance">
          <span className="balance__subtitle">Saldo</span>
          <span className="balance__value">R$ {balance}</span>
        </div>
      </div>
      <button
        className="summary__btn"
        onClick={() =>
          setModalRecord({
            show: true,
            title: 'Adicionar Registro',
            revenues: false,
            expenses: true,
            valor: '',
            categoria_id: '',
            data: '',
            format_data: '',
            descricao: '',
          })
        }
      >
        Adicionar Registro
      </button>
    </section>
  );
};

export default Summary;
