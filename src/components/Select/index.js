import "./styles.css";

const Select = ({ label, name, categories, modalRecord, setModalRecord }) => {
  const handleChangeSelect = (e) => {
    const value = e.target.value;

    setModalRecord({ ...modalRecord, [name]: value });
  };

  return (
    <div className="select-area">
      <label className="select-area__label">{label}</label>
      <select
        className="select-area__select cursor-pointer"
        onChange={(e) => handleChangeSelect(e)}
        value={modalRecord.categoria_id}
        required
      >
        <option value=""></option>
        {categories.map((categorie) => {
          return (
            <option value={categorie.id} key={categorie.id}>
              {categorie.descricao}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
