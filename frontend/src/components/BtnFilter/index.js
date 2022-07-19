import More from "../../assets/more.png";
import CloseWhite from "../../assets/close-white.png";
import "./styles.css";

const BtnFilter = ({
  name,
  value,
  active,
  id,
  sectionFilter,
  setSectionFilter,
}) => {
  const handleClickBtnFilter = (e) => {
    let localFilter = [...sectionFilter];
    const name = e.target.name;

    localFilter = localFilter.map((element) => {
      if (element.id === id) {
        element.active = !element.active;
      }

      return element;
    });

    setSectionFilter([...localFilter]);
  };

  return (
    <button
      className="filter__type"
      name={name}
      value={value}
      onClick={(e) => handleClickBtnFilter(e)}
      style={
        active
          ? { background: "#7978D9", color: "#FFFFFF" }
          : { background: "#FAFAFA", color: "#000000" }
      }
    >
      {value}
      <img src={active ? CloseWhite : More} alt="Botão adicionar" />
    </button>
  );
};

export default BtnFilter;
