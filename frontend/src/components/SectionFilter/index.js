import BtnFilter from '../BtnFilter';
import './styles.css';

const SectionFilter = ({
  sectionFilter,
  setSectionFilter,
  transactions,
  setTransactions,
}) => {
  const handleClickClean = () => {
    let localFilter = [...sectionFilter];

    localFilter = localFilter.map((filter) => {
      filter.active = false;
      return filter;
    });

    setSectionFilter([...localFilter]);
  };

  const handleClickApply = () => {
    const localTransactions = [...transactions];

    let filters = sectionFilter.filter((e) => {
      return e.active && e.value;
    });

    console.log(filters);

    filters = filters.map((filter) => {
      return filter.value;
    });

    if (filters.length === 0) {
      for (let index = 0; index < localTransactions.length; index++) {
        localTransactions[index].show = true;
      }
      return setTransactions([...localTransactions]);
    }

    for (let index = 0; index < localTransactions.length; index++) {
      for (let i = 0; i < filters.length; i++) {
        if (filters.includes(localTransactions[index].categoria_nome)) {
          localTransactions[index].show = true;
        } else {
          localTransactions[index].show = false;
        }
      }
    }

    setTransactions([...localTransactions]);
  };

  return (
    <section className="filter">
      <span className="filter__title">Categoria</span>
      <div className="filter__filters">
        {sectionFilter.map((filter) => {
          return (
            <BtnFilter
              key={filter.id}
              name={filter.name}
              descricao={filter.descricao}
              active={filter.active}
              id={filter.id}
              sectionFilter={sectionFilter}
              setSectionFilter={setSectionFilter}
            />
          );
        })}
      </div>
      <div className="filter__clean-apply">
        <button
          className="filter__btn-clean"
          onClick={() => handleClickClean()}
        >
          Limpar Filtros
        </button>
        <button
          className="filter__btn-apply"
          onClick={() => handleClickApply()}
        >
          Aplicar Filtros
        </button>
      </div>
    </section>
  );
};

export default SectionFilter;
