import Input from "../Input";
import Close from "../../assets/close.png";
import Select from "../Select";
import "./styles.css";

const ModalRecord = ({
  modalRecord,
  setModalRecord,
  categories,
  sendRecord,
}) => {
  return (
    <div className='container-modal-record'>
      <div className='modal-record'>
        <div className='modal-record__top'>
          <h2 className='modal-record__title'>{modalRecord.title}</h2>
          <img
            className='btn-close cursor-pointer'
            src={Close}
            alt='Botão fechar'
            onClick={() => setModalRecord({ ...modalRecord, show: false })}
          />
        </div>
        <div className='modal-record__btns'>
          <button
            className='modal-record__btn-incomes'
            style={
              modalRecord.incomes
                ? { background: "#3a9ff1" }
                : { background: "#b9b9b9" }
            }
            onClick={() =>
              setModalRecord({
                ...modalRecord,
                incomes: true,
                expenses: false,
              })
            }
          >
            Entrada
          </button>
          <button
            className='modal-record__btn-expenses'
            style={
              modalRecord.expenses
                ? { background: "#ff576b" }
                : { background: "#b9b9b9" }
            }
            onClick={() =>
              setModalRecord({
                ...modalRecord,
                expenses: true,
                incomes: false,
              })
            }
          >
            Saída
          </button>
        </div>
        <form className='modal-record__form' onSubmit={sendRecord}>
          <div className='modal-record__inputs'>
            <Input
              setState={setModalRecord}
              state={modalRecord}
              label='Valor'
              type='number'
              id='value'
              value={modalRecord.value && modalRecord.value}
            />
            <Select
              label='Categoria'
              name='category_id'
              categories={categories}
              setModalRecord={setModalRecord}
              modalRecord={modalRecord}
            />
            <Input
              setState={setModalRecord}
              state={modalRecord}
              label='Data'
              type='date'
              id='format_data'
              value={modalRecord.format_data && modalRecord.format_data}
            />
            <Input
              setState={setModalRecord}
              state={modalRecord}
              label='Descrição'
              type='text'
              id='description'
              value={modalRecord.description && modalRecord.description}
            />
          </div>
          <button className='modal-record__btn'>Confirmar</button>
        </form>
      </div>
    </div>
  );
};

export default ModalRecord;
