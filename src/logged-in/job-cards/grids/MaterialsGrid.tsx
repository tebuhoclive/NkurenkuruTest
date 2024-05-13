
import { IMaterial } from "../../../shared/models/job-card-model/Material";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import { useAppContext } from "../../../shared/functions/Context";
import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface IProps {
  data: IMaterial[];
  jobCard:IJobCard
}

export const MaterialsGrid = observer(({ data ,jobCard}: IProps) => {
  const { api, store } = useAppContext();

  const onDeleteMaterial = async (materialId:string) => {
    try {
      // Delete the material on the server
      await api.jobcard.material.delete(materialId, jobCard.id);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };


  const handleEdit = async (materialId:string) => {
    if (materialId){
    const currentMaterial= store.jobcard.material.getById(materialId)
    store.jobcard.material.select(currentMaterial);
    store.jobcard.jobcard.select(jobCard)
    }
    try {
      showModalFromId(MODAL_NAMES.EXECUTION.ONEDITMATERIAL_MODAL);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };
const columns: GridColDef[] = [
  {
    field: "quantity",
    headerName: "Quantity",
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
    headerName: "Cost of Material",
    flex: 1,
    headerClassName: "grid",
  },
  {
    field: "Options",
    headerName: "Options",
    flex: 1,
    renderCell: (params) => (
      <div>
        {/* Edit Button */}
        <IconButton aria-label="edit" onClick={() => handleEdit(params.row.id)}>
          <Edit />
        </IconButton>
        {/* Delete Button */}
        <IconButton
          aria-label="delete"
          onClick={() => onDeleteMaterial(params.row.id)}>
          <Delete />
        </IconButton>
      </div>
    ),
  },
];

  return (
    <div className="grid">
      <Box sx={{ height: 300 }}>
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
