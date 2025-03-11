import React, { useEffect, useState } from "react";
import "../styles/Filters.css";
import { Filter, Trash2 } from "lucide-react";
import { FilterModal } from "./FilterModal";

export const Filters = ({
  inputSearch,
  setInputSearch,
  selectedFilter,
  setSelectedFilter,
  MAX_BOUND,
}) => {
  const MIN_BOUND = 0;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [rangeValues, setRangeValues] = useState([MIN_BOUND, MAX_BOUND]);

  useEffect(() => {
    setRangeValues([MIN_BOUND, MAX_BOUND]);
  }, [MAX_BOUND]);

  const handleFilterSelect = (option) => {
    setIsFilterModalOpen(false);
    setSelectedFilter(option);
  };

  const HandleClearFilter = () => {
    setRangeValues([MIN_BOUND, MAX_BOUND]);
    setSelectedFilter(null);
  };

  return (
    <>
      <div className="form-filter-section">
        <input
          type="text"
          placeholder="Search..."
          value={inputSearch}
          onChange={({ target }) => setInputSearch(target.value)}
        />
        <button onClick={() => setIsFilterModalOpen(true)}>
          <Filter />
        </button>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterSelect={handleFilterSelect}
        rangeValue={rangeValues}
        setRangeValue={setRangeValues}
        MIN_BOUND={MIN_BOUND}
        MAX_BOUND={MAX_BOUND}
      />
      {selectedFilter && (
        <div className="selected-filter">
          <span className="filter-label">
            Filter: Min: {selectedFilter.min} - Max: {selectedFilter.max}
          </span>
          <Trash2 onClick={HandleClearFilter} className="clear-filter-icon" />
        </div>
      )}
    </>
  );
};
