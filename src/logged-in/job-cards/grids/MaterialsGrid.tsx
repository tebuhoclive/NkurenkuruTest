import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import { IMaterial } from "../../../shared/models/job-card-model/Material";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import { useAppContext } from "../../../shared/functions/Context";
import Modal from "../../../shared/components/Modal";
import ViewJobCardModal from "../ViewJobCardModal";
import { ITask } from "../../../shared/models/Task";
import { currencyFormat } from "../../../shared/functions/Directives";

interface IProps {
  data: IMaterial[];
}

export const MaterialsGrid = observer(({ data }: IProps) => {
  const { api, store } = useAppContext();

  const columns: GridColDef[] = [
    {
      field: "quantity",
      headerName: "quantity",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "name",
      headerName: "Description of Material",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "unitCost",
      headerName: "cost of Material",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "Options",
      headerName: "Options",
      flex: 1,
    },
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 450 }}>
        <DataGrid
          loading={!data}
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={40}
        />
      </Box>
    </div>
  );
});
