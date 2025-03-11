import React from "react";
import { Modal } from "./Modal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/FilterModal.css";
import { sliderStyles } from "../constants/styles";

export const FilterModal = ({
  isOpen,
  onClose,
  onFilterSelect,
  rangeValue,
  setRangeValue,
  MIN_BOUND,
  MAX_BOUND,
}) => {
  const handleSliderChange = (value) => {
    setRangeValue(value);
  };

  const handleAmountApplyFilter = () => {
    onFilterSelect({
      type: "amount",
      min: rangeValue[0],
      max: rangeValue[1],
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="filter-modal">
        <h2 className="filter-modal_title">Filter by amount</h2>
        <div className="slider-container">
          <div className="slider-values">
            <span>{rangeValue[0]}</span>-<span>{rangeValue[1]}</span>
          </div>
          <Slider
            range
            min={MIN_BOUND}
            max={MAX_BOUND}
            value={rangeValue}
            onChange={handleSliderChange}
            styles={sliderStyles}
          />
          <div className="filter-modal_actions">
            <button className="filter-modal_cancel" onClick={onClose}>
              Close
            </button>
            <button
              className="filter-modal_apply"
              onClick={handleAmountApplyFilter}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
