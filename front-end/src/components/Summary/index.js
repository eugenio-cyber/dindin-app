import "./styles.css";

const Summary = ({ incomes, expenses, balance, setModalRecord }) => {
  return (
    <section className='summary'>
      <div className='summary__body'>
        <h3 className='summary__title'>Resumo</h3>
        <div className='incomes'>
          <span className='incomes__subtitle'>Entradas</span>
          <span className='incomes__value'>R$ {incomes}</span>
        </div>
        <div className='expenses'>
          <span className='expenses__subtitle'>Saídas</span>
          <span className='expenses__value'>R$ {expenses}</span>
        </div>
        <div className='balance'>
          <span className='balance__subtitle'>Saldo</span>
          <span className='balance__value'>R$ {balance}</span>
        </div>
      </div>
      <button
        className='summary__btn'
        onClick={() =>
          setModalRecord({
            show: true,
            title: "Adicionar Registro",
            incomes: false,
            expenses: true,
            value: "",
            category_id: "",
            transaction_date: "",
            format_data: "",
            description: "",
          })
        }
      >
        Adicionar Registro
      </button>
    </section>
  );
};

export default Summary;
