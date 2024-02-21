import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import html2pdf from 'html2pdf.js';


// let DataAA = [
//     {
//         "seq_no": 24,
//         "acc_id": "SBI_01",
//         "acc_name": "SBI KHORDHA 11276460214",
//         "budget_id": "BAN_22",
//         "budget_name": "BANK",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 25,
//         "acc_id": "PNB_01",
//         "acc_name": "PNB KHORDHA",
//         "budget_id": "BAN_22",
//         "budget_name": "BANK",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 26,
//         "acc_id": "GRA_25",
//         "acc_name": "GRANT-IN-AID",
//         "budget_id": "INC_1",
//         "budget_name": "INCOME",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 27,
//         "acc_id": "DIS_26",
//         "acc_name": "DIST ESTABLISHMENT",
//         "budget_id": "INC_1",
//         "budget_name": "INCOME",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 28,
//         "acc_id": "DIS_28",
//         "acc_name": "DIST ESTABLISHMENT (PAYMENT)",
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 29,
//         "acc_id": "SBI_01",
//         "acc_name": "SBI BANAPUR A/C 11276557321",
//         "budget_id": "BAN_22",
//         "budget_name": "BANK",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 30,
//         "acc_id": "TRA_30",
//         "acc_name": "TRAVELLING EXPENDITURE",
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 31,
//         "acc_id": "MED_31",
//         "acc_name": "MEDICAL REIMBURSEMENT",
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 35,
//         "acc_id": "CAS_01",
//         "acc_name": "CASH - IN - HABD",
//         "budget_id": "INC_1",
//         "budget_name": "INCOME",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 36,
//         "acc_id": "DEE_36",
//         "acc_name": "DEERdffff",
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 37,
//         "acc_id": "Dee_37",
//         "acc_name": "Deepak",
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 38,
//         "acc_id": null,
//         "acc_name": null,
//         "budget_id": "EXP_19",
//         "budget_name": "EXPENDITURE",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     },
//     {
//         "seq_no": 39,
//         "acc_id": "ere_39",
//         "acc_name": "erereefefefefe",
//         "budget_id": "INC_1",
//         "budget_name": "INCOME",
//         "delete": null,
//         "edit": null,
//         "acc_budget_map_mastercol": null
//     }
// ]

// DataAA = DataAA.map((row, index) => ({
//     ...row,
//     id: index + 1, // Assuming index starts from 0
//   }));

export default function DataTable({ mapDataWithId, TableName, handleEdit }) {
  // console.log('mapDataWithId',mapDataWithId());


  const columns = [
    { field: 'id', headerName: 'Seq No', width: 100 },
    { field: 'acc_id', headerName: 'Account ID', width: 150 },
    { field: 'acc_name', headerName: 'Account Name', width: 300 },
    { field: 'budget_id', headerName: 'Budget ID', width: 150 },
    { field: 'budget_name', headerName: 'Budget Name', width: 250 },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: "5px" }}
          // onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const columnsObMaster = [
    { field: 'id', headerName: 'Seq No', width: 100 },
    { field: 'scheme_id', headerName: 'Scheme ID', width: 100 },
    { field: 'scheme_name', headerName: 'Scheme Name', width: 150 },
    { field: 'budget_id', headerName: 'Budget ID', width: 150 },
    { field: 'budget_name', headerName: 'Budget Name', width: 150 },
    { field: 'acc_id', headerName: 'Account ID', width: 100 },
    { field: 'acc_name', headerName: 'Account Name', width: 150 },
    { field: 'amt_rec', headerName: 'Credit', width: 150 },
    { field: 'amt_pay', headerName: 'Debit', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: "5px" }}
          // onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

    // Ref to the grid container
    const gridContainerRef = React.useRef(null);

    // Function to export to PDF
    const exportToPDF = () => {
      // Ensure the grid container exists
      if (gridContainerRef.current) {
        // Convert the grid container to PDF
        html2pdf(gridContainerRef.current);
      }
    };
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      <button onClick={exportToPDF}>Export to PDF</button>
      <div style={{ height: 400, width: '100%' }} ref={gridContainerRef}>
      <DataGrid
        rows={mapDataWithId()}
        columns={TableName === "ObMust" ? columns : columnsObMaster }
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 7 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      </div>
    </div>
  );
}
