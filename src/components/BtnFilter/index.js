import More from '../../assets/more.png';
import CloseWhite from '../../assets/close-white.png';
import './styles.css';

const BtnFilter = ({
  name,
  description,
  active,
  id,
  sectionFilter,
  setSectionFilter,
}) => {
  const handleClickBtnFilter = (e) => {
    let localFilter = [...sectionFilter];

    localFilter = localFilter.map((filter) => {
      if (filter.id === id) {
        filter.active = !filter.active;
      }

      return filter;
    });

    setSectionFilter([...localFilter]);
  };

  return (
    <button
      className="filter__type"
      name={name}
      // description={description}
      onClick={(e) => handleClickBtnFilter(e)}
      style={
        active
          ? { background: '#7978D9', color: '#FFFFFF' }
          : { background: '#FAFAFA', color: '#000000' }
      }
    >
      {description}
      <img src={active ? CloseWhite : More} alt="Botão adicionar" />
    </button>
  );
};

export default BtnFilter;
