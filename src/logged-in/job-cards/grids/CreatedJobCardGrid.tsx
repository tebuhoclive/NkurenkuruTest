import React, { useState } from "react";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import ViewJobCardModal from "../ViewJobCardModal";
import { DeleteForever, OpenInNew, Visibility } from "@mui/icons-material";
import swal from "sweetalert";
import { IJobCard, IStatus, defaultJobCard } from "../../../shared/models/job-card-model/Jobcard";
import Toolbar from "../../shared/components/toolbar/Toolbar";

interface IProp {
  data: any[];
}

const CreatedJobCardGrid= observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const onUpdateStatus = async (jobCardId: string) => {

       console.log("job card id", jobCardId);
    // const currentJobCard = store.jobcard.jobcard.getItemById(jobCardId)?.asJson;
      //  console.log("job card id", currentJobCard);
      await api.jobcard.jobcard.delete(jobCardId);
  
  };
  // Function to get the display name based on the assignedTo ID
  const getDisplayName = (assignedToId) => {
    const user = store.user.all.find(
      (user) => user.asJson.uid === assignedToId
    );
    return user ? user.asJson.displayName : "Unknown";
  };

  const columns: GridColDef[] = [
    {
      field: "assignedTo",
      headerName: "Assigned To",
      flex: 1,
      renderCell: (params) => {
        return getDisplayName(params.row.assignedTo);
      },
    },
    {
      field: "division",
      headerName: "Division",
      flex: 1,
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
    },
    {
      field: "dateIssued",
      headerName: "Date Issued",
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Date Due",
      flex: 1,
    },
    {
      field: "urgency",
      headerName: "Urgency",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Urgency",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              onClick={() => onUpdate(params.row)}
              aria-label="allocate"
              data-uk-tooltip="Allocate Job Card"
              style={{ color: "black", padding: "8px" }}>
              <OpenInNew style={{ fontSize: "20px" }} />
            </IconButton>

            <IconButton
              onClick={() => onUpdateStatus(params.row.id)}
              aria-label="delete"
              data-uk-tooltip="Delete">
              <DeleteForever />
            </IconButton>

            {/* <IconButton
              onClick={() => onView(params.row)}
              aria-label="view"
              data-uk-tooltip="View">
              <i className="fa fa-sign-in"></i>
            </IconButton> */}
          </div>
        );
      },
    },
  ];

  const onUpdate = (jobCards: any) => {
    store.jobcard.jobcard.select(jobCards);
    showModalFromId(MODAL_NAMES.EXECUTION.ALLOCATEJOBCARD_MODAL);
  };

  // const onView = (jobCard: any) => {
  //   store.jobcard.jobcard.select(jobCard);
  //   showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  // };

  // const onDelete = (jobCard: any) => {
  //   // Show a confirmation dialog
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this job card!",
  //     icon: "warning",
  //     buttons: ["Cancel", "Delete"],
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       try {
  //         deleteJobCard(jobCard);
  //         swal({
  //           title: "Job Card Deleted!",
  //           icon: "success",
  //         });
  //       } catch (error) {
  //         console.log("Error: " + error);
  //       }
  //     } else {
  //       swal("Cancelled!");
  //     }
  //   });
  // };

  // const deleteJobCard = async (jobCard: any) => {
  //   try {
  //     await api.jobcard.jobcard.delete(jobCard.id);
  //   } catch (error) {
  //     console.log("Error" + error);
  //   }
  // };

  function handleFilterChange(arg0: string, value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {" "}
      <div className="grid">
        {" "}
        <Toolbar
          rightControls={
            <div className="uk-flex">
              <div className="uk-form-controls uk-flex uk-margin-left">
                <select
                  // value={filterValue}
                  className="uk-select uk-form-small"
                  onChange={(e) =>
                    handleFilterChange("stringValueB", e.target.value)
                  }>
                  <option value="">Click select transaction type</option>
                  <option value="Normal">Normal</option>
                  <option value="High Value">High value</option>
                  <option value="ZAR">ZAR</option>
                  <option value="Both">All</option>
                </select>
              </div>

              <div className="uk-form-controls uk-flex uk-margin-left">
                <button
                  className="btn btn-danger"
                  // onClick={() => setFilterValue("")}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          }
          leftControls={
            <>
              <h4 className="main-title-alt uk-text-bold">
                Unallocated Job Cards
              </h4>
            </>
          }
        />
        <hr />
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id}
            rowHeight={45}
            className="uk-card uk-card-default uk-card-body uk-card-small"
          />
        </Box>
      </div>
      <ViewJobCardModal />
    </>
  );
});

export default CreatedJobCardGrid;
