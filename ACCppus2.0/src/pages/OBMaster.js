import React, { useEffect, useState } from 'react';
import { StyledInput } from "../Util/Comp/SmallComp";
import { fetchMasterData, fetchTableMaqSeq } from "../Util/CommonFun/CommonFun";
import { InputLabel, Select, MenuItem, TextField, Button, Autocomplete, FormControl, Radio, FormLabel, RadioGroup, FormControlLabel } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import SchemeMaster from './SchemeMaster';
import DataTable from "../Util/Comp/Table"

function OBMaster() {
    const [budgetMaster, setBudgetMaster] = useState([]);
    const [accoutMaster, setAccountMaster] = useState([]);

    const [schemeMaster, setSchemetMaster] = useState([]);
    const [selectedSchemeName, setselectedSchemeName] = useState("")
    const [selectScheme, setSelectScheme] = useState({
        schemeName: "",
        schemeId: ""
    });

    const [selectedBudgetName, setselectedBudgetName] = useState("")
    const [selectbudget, setSelectbudget] = useState({
        budgetName: "",
        budgetId: ""
    });
    const [accountDetails, setaccountDetails] = useState({
        accountName: "", // Initialize with an empty string
        accountID: ""
    });
    const [budgetAccMap, setBudgetAccMap] = useState([]);
    const [filterbudgetAcc, setFilterbudgetAcc] = useState([]);
    const [transaction, setTransaction] = useState("")
    const [amount, setAmount] = useState(0)
    const [responsefromDB, setResponseFromDB] = useState([])
    const [editFlag, setEditFlag] = useState(false)
    const [selectForEdit, setSelectForEdit] = useState({})

    useEffect(() => {
        async function fetchingSchemeToState() {
            try {
                const response = await fetchMasterData("scheme");
                setSchemetMaster(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingSchemeToState();

        async function fetchingBudgetToState() {
            try {
                const response = await fetchMasterData("budget");
                setBudgetMaster(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingBudgetToState();

        async function fetchingBudgetAccMapToState() {
            try {
                const response = await fetchMasterData("acc_budget_map");
                setBudgetAccMap(response);
                setFilterbudgetAcc(response)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingBudgetAccMapToState();

        async function fetchingOBmasterfromDb() {
            try {
                let response = await axios.post('http://localhost:8000/get_seq_reverse', {
                    table_name: "obmaster",
                });
                let result = response.data;
                setResponseFromDB(result)
            } catch (error) {
                console.log("Error fetching data:", error)
            }
        }
        fetchingOBmasterfromDb()

    }, []);

    const handleChangeScheme = (event) => {
        let { value } = event.target;
        setselectedSchemeName(value)
        let aa = schemeMaster.filter((item) => item.name === value)
        console.log(schemeMaster, aa)
        setSelectScheme({
            schemeName: aa[0].name,
            schemeId: aa[0].id
        });
    };
    // console.log('selectScheme', selectScheme);

    const handleChangeBudget = (event) => {
        let { value } = event.target;
        setselectedBudgetName(value)
        let aa = budgetMaster.filter((item) => item.name === value)
        setSelectbudget({
            budgetName: aa[0].name,
            budgetId: aa[0].id
        });
        let ab = budgetAccMap.filter((item) => item.budget_name.includes(value));
        setFilterbudgetAcc(ab);
    };

    const handleAccountChange = (event, newValue) => {
        if (newValue) {
            setaccountDetails({
                accountName: newValue.acc_name,
                accountID: newValue.acc_id
            });
        } else {
            setaccountDetails({
                accountName: "",
                accountID: ""
            });
        }
    };
    // console.log('12345566778')

    const submitToObmust = async () => {
        let temp = {}
        temp["scheme_id"] = selectScheme.schemeId;
        temp["scheme_name"] = selectScheme.schemeName;
        temp["budget_id"] = selectbudget.budgetId;
        temp["budget_name"] = selectbudget.budgetName;
        temp["acc_id"] = accountDetails.accountID;
        temp["acc_name"] = accountDetails.accountName;
        temp["amt_pay"] = transaction == 'credit' ? amount : "0";
        temp["amt_rec"] = transaction == 'debit' ? amount : "0";
        temp["table_name"] = "obmaster";
        try {
            let response = axios.post("http://localhost:8000/insert_obmaster", temp)
            response.then((result) =>
                setResponseFromDB(result.data),
                setSelectScheme({
                    schemeName: "",
                    schemeId: ""
                }),
                setaccountDetails({
                    accountName: "",
                    accountID: ""
                }),
                setSelectbudget({
                    budgetName: "",
                    budgetId: ""
                }),
                setselectedBudgetName(""),
                setselectedSchemeName(""),
                setTransaction(""),
                setAmount(""),
            ).catch((error)=>console.log(error))
        } catch (error) {
            console.log(error)
        }
    }

    let aaaa
    function mapDataWithId() {
        aaaa = responsefromDB.map((item, index) => (
            {
                ...item,
                id: index + 1
            }
        ));
        return aaaa
    }

    const handleEdit = (props) => {
        console.log("ttttttttttt0", props)
        setSelectForEdit(props)
        setEditFlag(true)
        setselectedSchemeName(props.scheme_name)
        setselectedBudgetName(props.budget_name)
        setaccountDetails({
            accountName: props.acc_name,
            accountID: props.acc_id
        })
        setSelectScheme({
            schemeName: props.scheme_name,
            schemeId: props.scheme_id
        })
        setSelectbudget({
            budgetName:props.budget_name,
            budgetId:props.budget_id
        })
        setAmount(props.amt_pay||props.amt_rec)
        setTransaction(props.amt_pay ? "credit":"debit")
    }
    console.log('setselectedSchemeName',selectedSchemeName,"selectedBudgetName",selectedBudgetName,"accountDetails",accountDetails);

    // const columns = [
    //     { field: 'id', headerName: 'Seq No', width: 100 },
    //     { field: 'scheme_id', headerName: 'Budget ID', width: 150 },
    //     { field: 'scheme_name', headerName: 'Budget Name', width: 250 },
    //     { field: 'budget_id', headerName: 'Budget ID', width: 150 },
    //     { field: 'budget_name', headerName: 'Budget Name', width: 250 },
    //     { field: 'acc_id', headerName: 'Account ID', width: 150 },
    //     { field: 'acc_name', headerName: 'Account Name', width: 250 },
    //     {
    //         field: 'action',
    //         headerName: 'Actions',
    //         description: 'This column has a value getter and is not sortable.',
    //         sortable: false,
    //         width: 200,
    //         renderCell: (params) => (
    //             <div>
    //                 <Button
    //                     variant="contained"
    //                     color="primary"
    //                     onClick={() => handleEdit(params.row)}
    //                 >
    //                     Edit
    //                 </Button>
    //                 <Button
    //                     variant="contained"
    //                     color="secondary"
    //                     sx={{ marginLeft: "5px" }}
    //                 // onClick={() => handleDelete(params.row.id)}
    //                 >
    //                     Delete
    //                 </Button>
    //             </div>
    //         ),
    //     },
    // ];
    const editSubmitToObmust =async()=>{
        let temp = {}
        temp["amt_pay"] = transaction == 'credit' ? amount : "0";
        temp["amt_rec"] = transaction == 'debit' ? amount : "0";
        temp["table_name"] = "obmaster";
        temp["seq_no"] = selectForEdit.seq_no
       try {
         let response= await axios.put("http://localhost:8000/editInsert_obmaster",temp)
         response.then((result) =>
                setResponseFromDB(result.data),
                setSelectScheme({
                    schemeName: "",
                    schemeId: ""
                }),
                setaccountDetails({
                    accountName: "",
                    accountID: ""
                }),
                setSelectbudget({
                    budgetName: "",
                    budgetId: ""
                }),
                setselectedBudgetName(""),
                setselectedSchemeName(""),
                setTransaction(""),
                setAmount(""),
                editFlag(false)
            ).catch((error)=>console.log(error))
       } catch (error) {
        
       }
    }
    return (
        <div>
            <h3 style={{ display: "flex", justifyContent: "center" }}>OB Master</h3>

            {/* -----------scheme --------- */}
            <Box sx={{
                padding: 1, justify: "center", display: "flex", alignItems: "end", justifyContent: "center", "&:hover": {
                    '& .MuiInputBase-root': {
                        background: "blue",
                    },
                },
            }}>
                <div>
                    <InputLabel id="Budget_select_lebel">Scheme name</InputLabel>
                    <Select
                        sx={{ width: 500, height: "40px", border: "", borderRadius: "8px" }}
                        id="Scheme_select"
                        placeholder='Select a Scheme Name'
                        onChange={(event) => handleChangeScheme(event)}
                        value={selectedSchemeName}
                        readOnly={editFlag && true}
                    >
                        {schemeMaster.map((data) => (
                            <MenuItem key={data.id} value={data.name}>
                                {data.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                &nbsp;&nbsp;
                <StyledInput
                    id="Scheme_select_Id"
                    value={selectScheme.schemeId || ""}
                    placeholder='selected scheme ID'
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            {/* -----------budget --------- */}
            <Box style={{ padding: 5, justify: "center", display: "flex", alignItems: "end", justifyContent: "center" }}>
                <div>
                    <InputLabel id="Budget_select_lebel">Budget name</InputLabel>
                    <Select
                        sx={{ width: 500, height: "40px", border: "", borderRadius: "8px" }}
                        id="Budget_select"
                        placeholder='Select a Budget Name'
                        onChange={(event) => handleChangeBudget(event)}
                        value={selectedBudgetName}
                        readOnly={editFlag && true}
                    >
                        {budgetMaster.map((data) => (
                            <MenuItem key={data.id} value={data.name}>
                                {data.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                &nbsp;&nbsp;
                <StyledInput
                    id="Budget_select_Id"
                    value={selectbudget.budgetId || ""}
                    placeholder='selected Budget ID'
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            {console.log('filterbudgetAcc',filterbudgetAcc)}
            {/* -----------account --------- */}
            <Box style={{ padding: 5, justify: "center", display: "flex", alignItems: "end", justifyContent: "center" }}>
                <div>
                    <InputLabel id="Account_select_lebel">Account name</InputLabel>
                    <Autocomplete
                        disablePortal
                        readOnly={editFlag && true}
                        id="Account_name"
                        options={filterbudgetAcc}
                        getOptionLabel={(option) => option.acc_name}
                        value={filterbudgetAcc.find((option) => option.acc_name === accountDetails.accountName) ||null}
                        onChange={handleAccountChange}
                        renderInput={(params) => <TextField sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "40px", height: "40px", border: "", borderRadius: "8px", width: 500, pt: 0
                            }
                        }} {...params} />}
                    />
                </div>
                &nbsp;&nbsp;
                <StyledInput
                    id="Account_Id"
                    placeholder='selected Account ID'
                    value={accountDetails.accountID}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <FormControl >
                    <FormLabel id="demo-radio-buttons-group-label">Amount</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        value={transaction}
                        onChange={(e) => { setTransaction(e.target.value); setAmount(0) }}
                    >
                        <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                        <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                    </RadioGroup>
                </FormControl>
                <Box>
                    <StyledInput
                        width="250px"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Box>
            </Box>
            
            {editFlag ? (<Box sx={{
                my: 2,
                display: 'flex',
                justifyContent: "center"
            }}>
                <Button variant="contained" onClick={editSubmitToObmust}>edited record save</Button>
            </Box>):(
                <Box sx={{
                    my: 2,
                    display: 'flex',
                    justifyContent: "center"
                }}>
                    <Button variant="contained" onClick={submitToObmust}>submit</Button>
                </Box>
            )}
            <Box>
                <DataTable
                    mapDataWithId={mapDataWithId}
                    handleEdit={handleEdit}
                    TableName={"ObMaster"}
                />
            </Box>
        </div>
    );
}

export default OBMaster;
