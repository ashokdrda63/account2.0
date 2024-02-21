import React, { useEffect, useState } from 'react';
import { StyledInput } from "../Util/Comp/SmallComp";
import { fetchMasterData, fetchTableMaqSeq } from "../Util/CommonFun/CommonFun";
import { InputLabel, Select, MenuItem, TextField, Button, Autocomplete } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import SchemeMaster from './SchemeMaster';

function OBmust() {
    const [budgetMaster, setBudgetMaster] = useState([]);
    const [accoutMaster, setAccountMaster] = useState([]);
    const [schemeMaster, setSchemetMaster] = useState([]);
    const [selectScheme, setSelectScheme] = useState({
        schemeName: "",
        schemeId: ""
    });
    const [selectedSchemeName,setselectedSchemeName] = useState("")
    const [selectedBudgetName,setselectedBudgetName] = useState("")
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

    useEffect(() => {
        async function fetchingAccountToState() {
            try {
                const response = await fetchMasterData("scheme");
                setSchemetMaster(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingAccountToState();

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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingBudgetAccMapToState();
    }, []);

    const handleChangeScheme = (event) => {
        let { value } = event.target;
        setselectedSchemeName(value)
        let aa = schemeMaster.filter((item)=>item.name===value)
        console.log(schemeMaster,aa)
        setSelectScheme({
            schemeName: aa[0].name,
            schemeId: aa[0].id
        });
    };
    console.log('selectScheme',selectScheme);

    const handleChangeBudget = (event) => {
        let { value } = event.target;
        setselectedSchemeName(value)
        let aa = budgetMaster.filter((item)=>item.name===value)
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
    const submitToObmust = async() => {
        let temp = {}
        temp["scheme_id"] = selectScheme.schemeId;
        temp["scheme_name"] = selectScheme.schemeName;
        temp["budget_id"] = selectbudget.budgetId;
        temp["budget_name"] = selectbudget.budgetName;
        temp["acc_id"] = accountDetails.accountID;
        temp["acc_name"] = accountDetails.accountName;
        temp["table_name"] = "obmust";
        console.log(temp)
        try {
            let response = axios.post("http://localhost:8000/insert_ObMust", temp)
            if(response="Record Inserted"){
               setSelectScheme({
                schemeName:"",
                schemeId:""
               })
               setaccountDetails({
                accountName:"",
                accountID:""
               })
               setSelectbudget({
                budgetName:"",
                budgetId:""
               })
               setselectedBudgetName("")
               setselectedSchemeName("")
            }
        } catch (error) {
             console.log(error)
        }
    }

    return (
        <div>
            <h3 style={{ display: "flex", justifyContent: "center" }}>Scheme-Budget-Account MAP</h3>

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
                        value={selectScheme.schemeName}
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
                        value={selectbudget.budgetName}
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
            {/* -----------account --------- */}
            <Box style={{ padding: 5, justify: "center", display: "flex", alignItems: "end", justifyContent: "center" }}>
                <div>
                    <InputLabel id="Account_select_lebel">Account name</InputLabel>
                    <Autocomplete
                        disablePortal
                        id="Account_name"
                        options={filterbudgetAcc}
                        getOptionLabel={(option) => option.acc_name}
                        value={filterbudgetAcc.find((option) => option.acc_name === accountDetails.accountName) || null}
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
            <Box sx={{
                my: 2,
                display: 'flex',
                justifyContent: "center"
            }}>
                <Button variant="contained" onClick={submitToObmust}>submit</Button>
            </Box>
        </div>
    );
}

export default OBmust;
