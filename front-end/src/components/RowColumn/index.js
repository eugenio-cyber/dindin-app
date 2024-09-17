import { useState } from "react";
import Edit from "../../assets/edit.png";
import Trash from "../../assets/trash.png";
import "./styles.css";

const RowColumn = ({ deleteTransaction, transaction, setModalRecord }) => {
  const [modalDelete, setModalDelete] = useState(false);

  const handleEditTransaction = () => {
    const localTransaction = { ...transaction };
    const date = localTransaction.format_data.split("/");

    setModalRecord({
      show: true,
      incomes: localTransaction.type === "income" ? true : false,
      expenses: localTransaction.type === "expense" ? true : false,
      title: "Editar Registro",
      value: localTransaction.value,
      category_id: localTransaction.category_id,
      format_data: `${date[2]}-${date[1]}-${date[0]}`,
      transaction_date: localTransaction.transaction_date,
      description: localTransaction.description,
      transaction: transaction.id,
    });
  };

  return (
    <tr className='table__content'>
      <td className='table__date'>{transaction.format_data}</td>
      <td className='table__text'>{transaction.dia_semana}</td>
      <td className='table__text'>{transaction.description}</td>
      <td className='table__text'>{transaction.category_description}</td>
      <td className='table__value' style={{ color: transaction.color }}>
        {transaction.value}
      </td>
      <td className='table__icons'>
        <img
          className='cursor-pointer'
          src={Edit}
          alt='Ícone do lápis'
          onClick={() => handleEditTransaction()}
        />
        <img
          className='cursor-pointer'
          src={Trash}
          alt='Ícone da lixeira'
          onClick={() => setModalDelete(!modalDelete)}
        />
        {modalDelete && (
          <div className='modal-delete'>
            <span className='modal-delete__title'>Apagar item?</span>
            <div className='modal-delete__btns'>
              <button
                className='modal-delete__btn-yes cursor-pointer'
                onClick={() => deleteTransaction(transaction.id)}
              >
                Sim
              </button>
              <button
                className='modal-delete__btn-no cursor-pointer'
                onClick={() => setModalDelete(false)}
              >
                Não
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

export default RowColumn;
