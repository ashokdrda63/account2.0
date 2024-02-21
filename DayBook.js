import axios from "axios";
import useImportVoucher from '../hooks/useImportVoucher';
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchMasterData } from '../Util/CommonFun/CommonFun';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LoadingSpinner from "../Util/LoadingSpinner";
//import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from "dayjs";

function DayBook() {
    const { dataForEdit, setDateforEdit, voucherEditing, setVoucherEditing } = useImportVoucher();
    const navigate = useNavigate()
    const [voucherStartDate, setVoucherStartDate] = useState(dayjs(""))
    const [voucherEndDate, setVoucherEndDate] = useState(dayjs(""))
    const [schemeMaster, setSchemetMaster] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postProcess, setPostProcess] = useState(false);
    const [processedMasterData, setProcessedMasterData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedSchemeName, setselectedSchemeName] = useState("")
    const [selectScheme, setSelectScheme] = useState({
        schemeName: "",
        schemeId: ""
    });
    const [findVoucherNo, setFindVoucherNo] = useState(" ")


    const callDB = (e) => {
        axios.post("http://localhost:8000/search_voucher", { vch_no: findVoucherNo })
            .then((res) => {
                if (res.data) {
                    setDateforEdit(res.data);
                    setVoucherEditing(true);
                    navigate('/DayBook');
                } else {
                    // Handle the case when no data is received
                    console.log('No data received from the API.');
                }
            })
            .catch((err) => {
                console.log('Error', err);
            });
    }

    const onSubmit = (e) => {
        if (e.key === "Enter") {
            callDB()
        }
    }

    const handleChangeScheme = (event) => {
        let { value } = event.target;
        setselectedSchemeName(value)
        let aa = schemeMaster.filter((item) => item.name === value)
        setSelectScheme({
            schemeName: aa[0].name,
            schemeId: aa[0].id
        });
    };

    const handleDataInputs = (event) => {
        let { value } = event.target;
        setselectedSchemeName(value)
        let aa = schemeMaster.filter((item) => item.name === value)
        setSelectScheme({
            schemeName: aa[0].name,
            schemeId: aa[0].id
        });
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "numeric", day: "numeric"}
        return new Date(dateString).toLocaleDateString(undefined, options)
      }

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

    const processMaster = async () => {
        setLoading(true)
        let temp = {};
        temp["Scheme_name"] = selectedSchemeName;
        temp["Vch_start_date"] = voucherStartDate.toISOString().split('T')[0];
        temp["Vch_end_date"] = voucherEndDate.toISOString().split('T')[0];
        //temp["Scheme_name"] = "MLALAD";
        //temp["Vch_start_date"] = "2023-12-01";
        //temp["Vch_end_date"] = "2023-12-14";
        console.log("temp", temp);

        try {
            const firstApiResponse = await axios.post("http://localhost:8000/processMaster", temp);
            if (firstApiResponse.data != undefined) {
                alert("Prcoeesed Master Data!!!");
                setselectedSchemeName("")
                setVoucherStartDate("")
                setVoucherEndDate("")
                setLoading(false)
                setPostProcess(true)
                console.log(firstApiResponse.data.dataResponse);
                setProcessedMasterData(firstApiResponse.data.dataResponse)
            }

        } catch (error) {
            console.log('voucher entey error', error);
            setLoading(false)
            alert(error)
        }
    }

    if (!postProcess) {
        return (
            <div className="App-header-daybook">
                <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", mt: voucherEditing ? "100px" : "0px" }}>
                    <div><h4>DayBook</h4></div>
                    <table>
                        <tr>
                            <td>
                                <Box>
                                    <InputLabel id="Account_select_lebel">Scheme name</InputLabel>
                                    <Select
                                        sx={{ width: 225, height: "40px", border: "", borderRadius: "8px" }}
                                        id="Scheme_select"
                                        placeholder='Select a Scheme Name'
                                        onChange={(event) => handleChangeScheme(event)}
                                        value={selectedSchemeName}>
                                        {schemeMaster.map((data) => (
                                            <MenuItem key={data.id} value={data.name}>
                                                {data.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </td>
                            <td>
                                <Box>
                                    <InputLabel id="Account_select_lebel" >Voucher Date Start</InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0px" }}>
                                            <DatePicker value={voucherStartDate} onChange={(newValue) => setVoucherStartDate(newValue)}
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
                            </td>
                            <td><Box>
                                <InputLabel id="Account_select_lebel" >Voucher Date End</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0px" }}>
                                        <DatePicker value={voucherEndDate} onChange={(newValue) => setVoucherEndDate(newValue)}
                                            sx={{
                                                "& .MuiOutlinedInput-input": {
                                                    height: "40px",
                                                    padding: 0
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box></td>
                            <td>
                                <button onClick={processMaster} loading={loading} disabled={loading}>Process Data...</button>
                            </td>
                        </tr>
                    </table>
                    {loading ? <LoadingSpinner /> : <div></div>} {errorMessage && <div className="error">{errorMessage}</div>}
                </Box>
            </div>
        )
    } else {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>master_date_id</TableCell>
                                <TableCell>ob_cash</TableCell>
                                <TableCell>ob_bank</TableCell>
                                <TableCell>ob_adv</TableCell>
                                <TableCell>ob_tot</TableCell>
                                <TableCell>cash_rec</TableCell>
                                <TableCell>cash_exp</TableCell>
                                <TableCell>cash_adv</TableCell>
                                <TableCell>bank_rec</TableCell>
                                <TableCell>bank_exp</TableCell>
                                <TableCell>bank_adv</TableCell>
                                <TableCell>cb_cash</TableCell>
                                <TableCell>cb_bank</TableCell>
                                <TableCell>cb_adv</TableCell>
                                <TableCell>tot_cb</TableCell>
                                <TableCell>entry_date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processedMasterData.map((val, key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>{val.master_date_id}</TableCell>
                                        <TableCell>{val.ob_cash}</TableCell>
                                        <TableCell>{val.ob_bank}</TableCell>
                                        <TableCell>{val.ob_adv}</TableCell>
                                        <TableCell>{val.ob_tot}</TableCell>
                                        <TableCell>{val.cash_rec}</TableCell>
                                        <TableCell>{val.cash_exp}</TableCell>
                                        <TableCell>{val.cash_adv}</TableCell>
                                        <TableCell>{val.bank_rec}</TableCell>
                                        <TableCell>{val.bank_exp}</TableCell>
                                        <TableCell>{val.bank_adv}</TableCell>
                                        <TableCell>{val.cb_cash}</TableCell>
                                        <TableCell>{val.cb_bank}</TableCell>
                                        <TableCell>{val.cb_adv}</TableCell>
                                        <TableCell>{val.tot_cb}</TableCell>
                                        <TableCell>{formatDate(val.entry_date)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </div>
        )
    }

}

export default DayBook;