import React from "react";
import { IBusinessUnit } from "../../../../shared/models/BusinessUnit";

interface IProps {
  division: IBusinessUnit;
  setDivision: React.Dispatch<React.SetStateAction<IBusinessUnit>>;
}
const DivisionForm = (props: IProps) => {
  const { division, setDivision } = props;

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="business-unit-fname">
          Division Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="business-unit-fname"
            type="text"
            placeholder="Name"
            value={division.name}
            onChange={(e) =>
              setDivision({ ...division, name: e.target.value })
            }
            required
          />
        </div>
      </div>
    </>
  );
};

export default DivisionForm;
