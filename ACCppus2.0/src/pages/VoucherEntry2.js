import React, { useEffect, useState } from 'react';
import { StyledInput } from '../Util/Comp/SmallComp';
import { fetchMasterData } from '../Util/CommonFun/CommonFun';
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Check } from '@mui/icons-material';
import axios from 'axios';
import VoucherTable from '../Util/Comp/VoucherTable';
import useImportVoucher from '../hooks/useImportVoucher';
import dayjs from "dayjs";


const monthes = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sept",
  "oct",
  "nov",
  "dec",
]

function VoucherEntey() {

  const {dataForEdit,setDateforEdit,voucherEditing,setVoucherEditing} =useImportVoucher();

  const [schemeMaster, setSchemetMaster] = useState([]);
  const [selectedSchemeName, setselectedSchemeName] = useState("")
  const [selectScheme, setSelectScheme] = useState({
    schemeName: "",
    schemeId: ""
  });

  const [accountMaster, setaccountMaster] = useState([])
  const [selectedAccountName, setselectedAccountName] = useState("")
  const [selectAccount, setSelectAccount] = useState({
    accountName: "",
    accountId: ""
  });
  const [chequeNo, setChequeNo] = useState("");
  const [voucherDate, setVoucherDate] = useState(dayjs(""))
  const [chequeDate, setChequeDate] = useState(dayjs(""))
  const [newVoucher, setNewVoucher] = useState("");
  const [voucherno, setVoucherno] = useState("");
  const [selectedMon, setSelectedMon] = useState("");
  const [bank, setBank] = useState("");
  const [description, setDescrpition] = useState("")
  const [accountType, setAccountType] = useState("");
  const [month, setMonth] = useState(monthes);
  const [generateAccDet, setGenerateAccDet] = useState("");
  const [editFlag, setEditFlag] = useState(false)
  const [accountTo, setAccountTo] = useState();
  const [accountFrom, setAccountFrom] = useState();
  const [voucherType, setVoucherType] = useState([
    "BR",
    "BP",
    "CR",
    "CP",
    "JV",
  ]);
  const [voucherRows, setVouncherRows] = useState([
    // { accountTy: 'to', accountDesName: 'SBI KHORDHA 11276460214', accountTo: 10000, accountFrom: 0 },
    // { accountTy: 'from', accountDesName: 'DIST ESTABLISHMENT', accountTo: 0, accountFrom: 5000 }
  ])
  const [submitTrue, setSubmitTrue] = useState(false)

  useEffect(() => {
    async function fetchingSchemeToState() {
      try {
        const response = await fetchMasterData("scheme");
        setSchemetMaster(response);
        // console.log('response',response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchingSchemeToState();
  }, [])

  useEffect(()=>{
     function checkForEdit (){
      if(Object.keys(dataForEdit).length !==0){
        let editAble = dataForEdit["inword_vchentry"].map((item,i)=>({
          accountTy:item.vch_ty,
          accountDesName: item.account_desc,
          accountTo: item.vch_ty === 'to' ? +item.amount_pay : 0,
          accountFrom: item.vch_ty === 'from' ? +item.amount_rec : 0,
        }))
        setVouncherRows(editAble)
        let EditVoucherDate =dayjs(dataForEdit["outward_vchentry"][0]["vch_date"])
        let EditCheckDate =dayjs(dataForEdit["outward_vchentry"][0]["chq_date"])
        setVoucherno(dataForEdit["outward_vchentry"][0]["vch_no"])
        setselectedSchemeName(dataForEdit["outward_vchentry"][0]["scheme_name"])
        setNewVoucher(dataForEdit["outward_vchentry"][0]["vch_type"])
        setChequeNo(dataForEdit["outward_vchentry"][0]["chq_no"])
        setDescrpition(dataForEdit["outward_vchentry"][0]["vch_desc"])
        setBank(dataForEdit["outward_vchentry"][0]["bank_name"])
        setChequeDate(EditVoucherDate)  
        setVoucherDate(EditCheckDate)
      }else{
        console.log('Error  On Vouher Edit');
      }
     }
     checkForEdit()
  },[dataForEdit])
  console.log('...................',voucherEditing,dataForEdit)

  const handleChangeScheme = (event) => {
    let { value } = event.target;
    setselectedSchemeName(value)
    let aa = schemeMaster.filter((item) => item.name === value)
    setSelectScheme({
      schemeName: aa[0].name,
      schemeId: aa[0].id
    });
  };


 const handleChangeForAcc = (event) => {
  let { value } = event.target;
  setselectedAccountName(value)
  let aa = accountMaster.filter((item) => item.acc_name === value)
  console.log("?//////////////??//////////",aa)
  setSelectAccount({
    accountName: aa[0].acc_name,
    accountId: aa[0].acc_id
  });
}
console.log(">>>>>>>>>>>>>>",selectAccount.accountId);

  const ChangeVoucherType = (event) => {
    setNewVoucher(event.target.value);
  };

  const changeVoucherno = (event) => {
    setVoucherno(event.target.value);
  };

  const ChangeBank = (event) => {
    setBank(event.target.value);
  };

  const handleChangeMonth = (event) => {
    setSelectedMon(event.target.value);
  };

  // const handleChange = (event) => {
  //   setAccountType(event.target.value);
  // };

  const ChangeChequeNo = (event) => {
    setChequeNo(event.target.value);
  };

  const handleChangeDes = (event) => {
    setDescrpition(event.target.value)
  }

   console.log("schemeMaster", schemeMaster, "selectedSchemeName", selectedSchemeName, "selectScheme", selectScheme, "cheque", chequeNo, "chequeDate", chequeDate, "bank", bank, "description", description, "voucherNO", voucherno)
  
  // optimize the two submit code
  const SubmitAll = async() => {
    let table = "outward_vchentry_view";
    let temp = {};
    temp["Scheme_name"] = selectedSchemeName;
    temp["vch_no"] =voucherno;
    temp["Vch_type"] = newVoucher;
    temp["Vch_date"] = voucherDate.toISOString().split('T')[0];
    temp["Chq_no"] = chequeNo;
    temp["Chq_date"] = chequeDate.toISOString().split('T')[0]||null;
    temp["Bank_name"] = bank;
    temp["Vch_desc"] = description;
    temp["total_Amount"] =totalAmount(voucherRows,"accountTo") ;
    temp["table_name"] = table;
    console.log("temp", temp);

    let vchInEntSync =voucherRows.map((item,i)=>({
      ...item,vch_no:voucherno,
      scheme_name:selectedSchemeName,
      vch_type:newVoucher,
      vch_date:voucherDate.toISOString().split('T')[0],
      acc_id:selectAccount.accountId !=="" && selectAccount.accountId,
    }))


    try {
      const firstApiResponse = await axios.post("http://localhost:8000/insert_outward_voucher", temp);
      if (firstApiResponse.data === "Record Inserted") {
        const secondApiResponse = await axios.post("http://localhost:8000/insert_inword_voucher", vchInEntSync);
        alert("Successfully inserted");
        setselectedSchemeName("")
        setChequeNo("")
        setVoucherDate("")
        setChequeDate("")
        setVoucherno("")
        setBank("")
        setDescrpition("")
        setNewVoucher("")
        setVouncherRows([])
      }

    } catch (error) {
      console.log('voucher entey error', error);
      alert(error)
    }
  }

  const submitEditAll =async()=>{
    let vchInEntSync =voucherRows.map((item,i)=>({
      ...item,vch_no:voucherno,scheme_name:selectedSchemeName
    }))

    let temp = {};
    temp["Scheme_name"] = selectedSchemeName;
    temp["vch_no"] =voucherno;
    temp["Vch_type"] = newVoucher;
    temp["Vch_date"] = voucherDate.toISOString().split('T')[0];
    temp["Chq_no"] = chequeNo;
    temp["Chq_date"] = chequeDate.toISOString().split('T')[0];
    temp["Bank_name"] = bank;
    temp["Vch_desc"] = description;
    temp["total_Amount"] =totalAmount(voucherRows,"accountTo") ;
    temp["inWord_allRows"] = vchInEntSync;

    try {
      const firstApiResponse = await axios.post("http://localhost:8000/insert_Edited_voucher", temp);
      if (firstApiResponse.data === "Data inserted successfully") {
        alert("Edit inserted"); 
        setselectedSchemeName("")
        setChequeNo("")
        setVoucherDate("")
        setChequeDate("")
        setVoucherno("")
        setBank("")
        setDescrpition("")
        setNewVoucher("") 
        setVouncherRows([])
        setDateforEdit({})
        setVoucherEditing(false)
      }
    } catch (error) {
      console.log('edit voucher rror ', error);
      alert(error)
    }
  }
  
  function totalAmount(voucherRows,prop)  {
    let sumAmount= voucherRows.map((voucherRows)=>voucherRows[prop]).reduce((sum,i)=>sum+i,0)
    return  sumAmount
  }
  
 // Add disable state  to To From in voucher
 const [disable,setDisable] = useState(false)
  const settingAccountFromZero = () => {
    setAccountTo(0)
    setDisable(true)
    setAccountFrom()
  }

  const settingAccountToZero = () => {
    setAccountFrom(0)
    setDisable(true)
    setAccountTo()
  }
  const handleChangeToFrom = (e) => {
    setAccountType(e.target.value);
    let toFrom = e.target.value;
    toFrom === "to" ? settingAccountToZero() : settingAccountFromZero();
    if (selectedSchemeName != "" && voucherType != "") {
      axios
        .post("http://localhost:8000/get_all_accountDes", {
          scheme_name: selectedSchemeName,
          voucher_type: newVoucher,
          to_from: e.target.value,
        })
        .then((res) => {
          // console.log("res.data : " + res.data);
          setaccountMaster(res.data);
        })
        .then(console.error("no data"));
    }
  };

  // console.log("setAccountDes", disable, accountFrom, accountTo)

  const enterAmountTo = (event) => {
    setAccountTo(event.target.value)
  }

  const enterAmountFrom = (event) => {
    setAccountFrom(event.target.value)
  }

  // { console.log('schemmaster', schemeMaster) }
  function createVoucherRow(accountTy, accountDesName, accountTo, accountFrom) {
    const parsedAccountTo = parseFloat(accountTo);
    const parsedAccountFrom = parseFloat(accountFrom);

    return {
      accountTy,
      accountDesName,
      accountTo: isNaN(parsedAccountTo) ? 0 : parsedAccountTo,
      accountFrom: isNaN(parsedAccountFrom) ? 0 : parsedAccountFrom,
    };
  }


  const onEnterPress = (e) => {
    console.log(e)
    if (e.key === "Enter") {
      let newRow = createVoucherRow(accountType, selectedAccountName, accountTo, accountFrom)
      console.log(newRow)
      setVouncherRows([...voucherRows, newRow])
      setAccountType("")
      setselectedAccountName("")
      setAccountTo(null)
      setAccountFrom(null)
    }
  }

  

  return (
    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center",mt:voucherEditing ? "100px" : "0px" }}>
        {!voucherEditing ? <h4>VoucherEntey</h4>:<h4>Edit Voucher</h4>}
      <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap", width: "90%", justifyContent: "center" }}>
        {/* scheme */}
        <Box>
          <InputLabel id="Account_select_lebel">Scheme name</InputLabel>
          <Select
            sx={{ width: 225, height: "40px", border: "", borderRadius: "8px" }}
            id="Scheme_select"
            placeholder='Select a Scheme Name'
            onChange={(event) => handleChangeScheme(event)}
            value={selectedSchemeName}
          >
            {schemeMaster.map((data) => (
              <MenuItem key={data.id} value={data.name}>
                {data.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* type of votcher */}
        <Box>
          <InputLabel id="Account_select_lebel">Type of Voucher</InputLabel>
          <Select
            sx={{ width: 225, height: "40px", border: "", borderRadius: "8px" }}
            id="Voucher_select"
            // placeholder='Select a Scheme Name'
            onChange={(event) => ChangeVoucherType(event)}
            value={newVoucher}
          // readOnly={editFlag && true}
          >
            {voucherType.map((data, index) => (
              <MenuItem value={data}>{data}</MenuItem>
            ))}
          </Select>
        </Box>
        {/* voucher No */}
        <Box>
          <InputLabel id="Account_select_lebel">Voucher No</InputLabel>
          <StyledInput
            width="200px"
            onChange={(event) => changeVoucherno(event)}
            value={voucherno}
            disabled={voucherEditing}
          />
        </Box>
        {/* voucherDate */}
        <Box>
          <InputLabel id="Account_select_lebel" >Voucher Date</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0px" }}>
              <DatePicker value={voucherDate} onChange={(newValue) => setVoucherDate(newValue)}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    height: "40px",
                    padding: 0
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        {/* /Cheque No */}
        <Box>
          <InputLabel id="Account_select_lebel">Cheque No</InputLabel>
          <StyledInput
            width="200px"
            onChange={(event) => ChangeChequeNo(event)}
            value={chequeNo}
          />
        </Box>
        {/* bankname */}
        <Box>
          <InputLabel id="Account_select_lebel">Bank Name</InputLabel>
          <StyledInput
            width="350px"
            onChange={(event) => ChangeBank(event)}
            value={bank}
          />
        </Box>
        {/* //chaeck date */}
        {/* toISOString().split('T')[0] */}
        <Box>
          <InputLabel id="Account_select_lebel">Check Date</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0px" }}>
              <DatePicker value={chequeDate} onChange={(newValue) => setChequeDate(newValue)}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    height: "40px",
                    padding: 0
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        {/* Descrpition */}
        <Box>
          <InputLabel id="Account_select_lebel">Descrpition</InputLabel>
          <StyledInput
            width="500px"
            multiline
            rows={3}
            onChange={(event) => handleChangeDes(event)}
            defaultValue={description}
          />
        </Box>
      </Box>

      {/* voucher Entery  Table */}
      <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap", width: "90%", justifyContent: "center" }}>
        <Box>
          <InputLabel id="to-from">TO/FROM</InputLabel>
          <Select
            sx={{ width: 200, height: "40px", border: "", borderRadius: "8px" }}
            id="Budget_select"
            placeholder='Select a Budget Name'
            value={accountType}
            onChange={handleChangeToFrom}
          >
            <MenuItem value="to">TO</MenuItem>
            <MenuItem value="from">FROM</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel id="account-Name">Account Name</InputLabel>
          <Select
            sx={{ width: 200, height: "40px", border: "", borderRadius: "8px" }}
            id="To_from"
            // placeholder='Select a Budget Name'
            value={selectedAccountName}
            onChange={handleChangeForAcc}
          >
            {accountMaster.map((data) => (
              <MenuItem value={data.acc_name}>{data.acc_name}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <InputLabel id="account-to">Account To</InputLabel>
          <StyledInput
            // ref={accTo}
            value={accountTo == null ? "" : accountTo}
            onChange={(event) => enterAmountTo(event)}
            onKeyPress={(e) => onEnterPress(e)}
          />
        </Box>
        <Box>
          <InputLabel id="account-from">Account From</InputLabel>
          <StyledInput
            // ref={accFrom}
            value={accountFrom == null ? "" : accountFrom}
            onChange={(event) => enterAmountFrom(event)}
            onKeyPress={(e) => onEnterPress(e)}
          />
        </Box>
      </Box>
      {/* ----------- To FROM Table------------ */}
      <VoucherTable 
      voucherRows={voucherRows} 
      setVouncherRows={setVouncherRows} 
      setSubmitTrue={setSubmitTrue} 
      submitTrue={submitTrue} 
      totalCredit={totalAmount(voucherRows,"accountTo")}
      totalDebit={totalAmount(voucherRows,"accountFrom")}/>
      <Box>
        {totalAmount(voucherRows,"accountTo") === totalAmount(voucherRows,"accountFrom") && <button onClick={voucherEditing ? submitEditAll:SubmitAll }>
          {!voucherEditing ?"submit" :"submit Edit"}
        </button>}
      </Box>
    </Box>
  )
}

export default VoucherEntey