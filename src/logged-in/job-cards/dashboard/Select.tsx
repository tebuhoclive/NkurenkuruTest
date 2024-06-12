import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f5f5f5", // Light grey background
    borderRadius: "10px", // Border radius
    boxShadow: state.isFocused ? "0 0 0 1px #007bff" : null, // Focus border color
    "&:hover": {
      borderColor: "#007bff", // Hover border color
    },
    width: "70%", // Set the width of the select component
    marginLeft: "20%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#007bff" : "transparent", // Selected option background color
    color: state.isSelected ? "#fff" : "#333", // Selected option text color
    "&:hover": {
      backgroundColor: "#007bff", // Hover background color
      color: "#fff", // Hover text color
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333", // Selected value text color
  }),
};

const SingleSelect = ({ options, value, onChange, placeholder, label }) => {
  return (
    <div>
      <label
        className="uk-form-label"
        htmlFor={label}
        style={{ marginLeft: "20%" }}>
        {label}
      </label>
      <Select
        options={options}
        value={value}
        onChange={(selectedOption) => onChange(selectedOption.value)} // Pass the UID of the selected user
        placeholder={placeholder}
        styles={customStyles}
        id={label} // Set the id attribute using the label prop
      />
    </div>
  );
};

export default SingleSelect;
