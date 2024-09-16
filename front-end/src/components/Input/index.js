import "./styles.css";

const Input = ({
  label,
  type,
  id,
  value,
  placeholder,
  required,
  setState,
  state,
}) => {
  const handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState({ ...state, [name]: value });
  };

  return (
    <div className='input-area'>
      <label className='input-area__label' htmlFor={id}>
        {label}
      </label>
      <input
        className='input-area__input'
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChangeInput(e)}
        required={required}
      />
    </div>
  );
};

export default Input;
