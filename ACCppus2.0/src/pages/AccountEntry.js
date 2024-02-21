import React, { useState } from 'react';
import { StyledInput } from "../Util/Comp/SmallComp";
import { useEffect } from 'react';
import { Box } from "@mui/material";
import { fetchMasterData, fetchTableMaqSeq } from "../Util/CommonFun/CommonFun";
import { InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import axios from "axios";
import DataTable from "../Util/Comp/Table"

function AccountEntry() {
    const [budget, setbudget] = useState("")
    const [budgetMaster, setBudgetMaster] = useState([])
    const [selectbudget, setSelectbudget] = useState({
        budgetName: "",
        budgetId: ""
    })
    const [accountDetails, setaccountDetails] = useState({
        accountName: "",
        accountID: ""
    })
    const [max_seq, setMax_seq] = useState(null)
    const [responsefromDB, setResponseFromDB] = useState([])
    const [editFlag, setEditFlag] = useState(false)
    const [selectForEdit, setSelectForEdit] = useState({})

    let intialValue = {}

    useEffect(() => {
        async function fetchingBudgetToState() {
            try {
                const response = await fetchMasterData("budget");
                setBudgetMaster(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchingBudgetToState();

        async function getMaxSeq() {
            setMax_seq(await fetchTableMaqSeq("acc_budget_map"))
        }
        getMaxSeq()
        fetingAccBudgetDataFromDb()
    }, []);

    async function fetingAccBudgetDataFromDb() {
        try {
            const response = await fetchMasterData("acc_budget_map");
            // let responseWithId= response.map((item,index)=>(
            //     {...item,
            //         id:index+1
            //     }
            // ))
            setResponseFromDB(response);
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


    const getBudgetIdToCreateAccountId = async (budgetName) => {
        console.log("budgetname", budgetName)
        try {
            let result = await axios.post("http://localhost:8000/get_indivisual_budget_max_seq", { budgetName })
            console.log("mmmmmmmm", result.data)
            let alphabetPart = budgetName.substring(0,3); 
            if ((result.data) == "no row inserted yet") {
                console.log("22222222><><><><><><><>22222222222", `${alphabetPart}_001`)
                setaccountDetails({ ...accountDetails, ["accountID"]: `${alphabetPart}_001` })
            }else{
                let numericalPart = (result.data[0].RepetitionCount+1).toString().padStart(3,"0")
                console.log("22222222><><><><><><><>22222222222", numericalPart)
                setaccountDetails({ ...accountDetails, ["accountID"]: `${alphabetPart}_${numericalPart}` })
            }
        } catch (error) {

        }
    }

    const handleChangeBudget = async (event) => {
        let { value } = event.target
        setbudget(value)
        let dstrtselectbudget = budgetMaster.filter((item, i) => item.name === value)
        setSelectbudget({
            budgetName: dstrtselectbudget[0].name,
            budgetId: dstrtselectbudget[0].id
        })
        getBudgetIdToCreateAccountId(dstrtselectbudget[0].name)
    }

    const enterAccountName = (event) => {
        let { value } = event.target;
        let dstrtselectAccount = { ...accountDetails };
        // if (!editFlag) {
        //     dstrtselectAccount.accountID = value.length < 5 ? '' : `${value.substring(0, 3)}_${max_seq + 1}`;
        // }
        dstrtselectAccount.accountName = value;
        setaccountDetails(dstrtselectAccount);
    };
    // console.log('accountDetails>>>>>>>',accountDetails);
    const storingDataToAccBudgetMaster = async () => {
        intialValue["acc_id"] = accountDetails.accountID;
        intialValue["acc_name"] = accountDetails.accountName;
        intialValue["budget_id"] = selectbudget.budgetId;
        intialValue["budget_name"] = selectbudget.budgetName;
        intialValue["table_name"] = "acc_budget_map";
        try {
            let result = await axios.post("http://localhost:8000/insert_acc_budget_map", intialValue)
            if (result.data.length > 1) {
                console.log("/////////", result)
                setResponseFromDB(result.data);
                setSelectbudget({
                    budgetName: "",
                    budgetId: ""
                });
                setaccountDetails({
                    accountID: "",
                    accountName: ""
                })
                setbudget("")
            }
        } catch (error) {
            console.log("error")
        }
    }

    const handleEdit = (props) => {
        // console.log("ttttttttttt0", props)
        setEditFlag(true)
        setbudget(props.budget_name)
        setSelectForEdit(props)
        setSelectbudget({
            budgetName: props.budget_name,
            budgetId: props.budget_id,
        });
        setaccountDetails({ ...accountDetails, ["accountID"]: props.acc_id, ["accountName"]: props.acc_name })
    }

    const storingEditDataToAccBudgetMaster = () => {
        // let seq_no = selectForEdit.seq_no;
        let editedDara = {};
        editedDara["acc_id"] = accountDetails.accountID;
        editedDara["acc_name"] = accountDetails.accountName;
        editedDara["budget_id"] = selectbudget.budgetId;
        editedDara["budget_name"] = selectbudget.budgetName;
        editedDara["seq_no"] = selectForEdit.seq_no
        if (editedDara.budget_name.length < 4) {
            alert("Budget Name should contain more than 5 letter")
            return
        }
        axios.put(
            "http://localhost:8000/acc_budget_edit", editedDara
        )
            .then((res) => setResponseFromDB(res.data))
            .catch((err) => console.error(err))
        setSelectbudget({
            budgetName: "",
            budgetId: ""
        });
        setaccountDetails({
            accountID: "",
            accountName: ""
        })
        setbudget("")
    }
 
    const handleDelete=async(props)=>{
        console.log('delere props',props);
        let deleteData={}
        deleteData['budget_id']= props.budget_id;
        deleteData['acc_id']= props.acc_id;
        deleteData['table_name']= "acc_budget_map";
        let result= await axios.post("http://localhost:8000/delete_acc_budget_map", deleteData)
        console.log(result)
    }

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
                        onClick={() => handleDelete(params.row)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    console.log("<<<<<<", accountDetails, selectbudget, budgetMaster)
    return (
        <div>
            <Box sx={{ mt: "64px" }}>
                <Box sx={{
                    padding: 1, justify: "center", display: "flex", alignItems: "end", justifyContent: "center", "&:hover": {
                        '& .MuiInputBase-root': {
                            background: "blue",
                        },
                    },
                }}>
                    <div>
                        <InputLabel id="Budget_select_lebel">Budget name</InputLabel>
                        {/* {selectbudget.budgetName} */}
                        <Select
                            sx={{ width: 500, height: "40px", border: "", borderRadius: "8px" }}
                            id="Budget_select"
                            placeholder='Select a Budget Name'
                            onChange={(event) => handleChangeBudget(event)}
                            value={budget}
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
                        <StyledInput
                            width="475px"
                            required
                            id="Account_name"
                            label="Account name"
                            value={accountDetails.accountName}
                            onChange={(event) => enterAccountName(event)}
                        />
                    </div>
                    &nbsp;&nbsp;
                    <StyledInput
                        id="Account_Id"
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
                    {!editFlag ? <Button
                        sx={{

                        }}
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={storingDataToAccBudgetMaster}
                    >
                        Map Budget Account
                    </Button> :
                        <Button
                            sx={{

                            }}
                            variant="contained"
                            type="submit"
                            color="primary"
                            onClick={storingEditDataToAccBudgetMaster}
                        >
                            store data to DB
                        </Button>
                    }
                </Box>
                <Box>
                    <DataTable
                        mapDataWithId={mapDataWithId}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        TableName={"ObMust"}
                    />
                </Box>
            </Box>
        </div>
    )
}

export default AccountEntry
