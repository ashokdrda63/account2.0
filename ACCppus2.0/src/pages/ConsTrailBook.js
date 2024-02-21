import axios from "axios";
import dayjs from "dayjs";
import useImportVoucher from '../hooks/useImportVoucher';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState, componentDidUpdate } from 'react';
import LoadingSpinner from "../Util/LoadingSpinner";
//import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Paper from '@mui/material/Paper';
import { formatDate, sortByKey, sortFromTo, sortToFrom } from "../Util/CommonFun/CommonFun";
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

function ConsTrailBook() {
    const { dataForEdit, setDateforEdit, voucherEditing, setVoucherEditing } = useImportVoucher();
    const [voucherStartDate, setVoucherStartDate] = useState(dayjs(""))
    const [voucherEndDate, setVoucherEndDate] = useState(dayjs(""))
    const [loading, setLoading] = useState(false);
    const [postProcess, setPostProcess] = useState(false);
    const [processedDaybookData, setProcessedDaybookData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [elementOutlet, setElementOutlet] = useState("");
    const [totalPayment, setTotalPayment] = useState(0);
    const node = useRef(null);

    useEffect(() => {
        if (postProcess) {
            setElementOutlet(document.getElementById("report"));
            console.log(document.getElementById("report"));
        }
    }, [])

    const processDaybook = async () => {
        setLoading(true)
        let temp = {};
        temp["Vch_start_date"] = voucherStartDate.toISOString().split('T')[0];
        temp["Vch_end_date"] = voucherEndDate.toISOString().split('T')[0];
        //temp["Vch_start_date"] = "2023-12-03";
        //temp["Vch_end_date"] = "2023-12-06";
        console.log("temp", temp);

        try {
            const firstApiResponse = await axios.post("http://localhost:8000/processDaybook", temp);
            if (firstApiResponse.data != undefined) {
                alert("Prcoeesed Daybook Data!!!");
                setVoucherStartDate("")
                setVoucherEndDate("")
                setLoading(false)
                setPostProcess(true)
                console.log(firstApiResponse.data);
                setProcessedDaybookData(firstApiResponse.data)
            }

        } catch (error) {
            console.log('Daybook Processing errored:', error);
            setLoading(false)
            alert(error)
        }
    }

    const paymentAggregator=(voucherAmount)=>{
        setTotalPayment(totalPayment+voucherAmount);
        console.log(totalPayment);
    }

    const generatePDF = () => {
        console.log(elementOutlet);
        console.log(document.getElementById('report'));
        // const report = new jspdf('portrait','pt','a4');
        // report.html(document.getElementById('report')).then(() => {
        //     report.save('report.pdf');
        // });
        const input = document.getElementById('report');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf('portrait', 'pt', 'a4', true);
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
                //pdf.addImage(imgData, 'JPEG', 0, 0);
                // pdf.output('dataurlnewwindow');
                pdf.save("download.pdf");
            });
    }


    if (!postProcess) {
        return (
            <div className="App-header-daybook">
                <div ref={node} id="report">
                    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", mt: voucherEditing ? "100px" : "0px" }}>
                        <div><h4>DayBook</h4></div>
                        <table>
                            <tr>
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
                                    <button onClick={processDaybook} loading={loading} disabled={loading}>Process Data...</button>
                                </td>
                            </tr>
                        </table>
                        {loading ? <LoadingSpinner /> : <div></div>} {errorMessage && <div className="error">{errorMessage}</div>}
                    </Box>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={generatePDF} type="primary" danger>Export Data...</button>
                <div ref={node} id="report" style={{ position: "relative" }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 1100, backgroundColor: "lavender" }} size="small" aria-label="a dense table">

                            <TableCell style={{ width: "50%", borderRight: "solid" }}>
                                <TableHead>
                                    <TableRow>

                                        <TableCell >Daybook Received</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processedDaybookData.datareceivedres.map((val, key) => {
                                        return (
                                            <TableRow key={key} style={{ borderBottom: "dashed", overflowX: "auto" }}>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Voucher No:{val.receipt_vch_no} |Voucher Date:{formatDate(val.receipt_vchno_date)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <tr>
                                                            <td colSpan={3}>{val.receipt_vch_desc}</td>
                                                        </tr>
                                                        {sortToFrom(val.transactions, "receipt_vch_ty").map((trxndata, trxndatakey) => (
                                                            <TableRow key={trxndatakey}>
                                                                <tr>
                                                                    <TableCell>{trxndata.receipt_vch_ty}</TableCell>
                                                                    <TableCell>{trxndata.account_desc}</TableCell>
                                                                    <TableCell>{trxndata.receipt_vch_type}</TableCell>
                                                                    <TableCell>{trxndata.receipt_vch_ty!="to"?trxndata.receipt_vch_amt:""}</TableCell>
                                                                    <TableCell>
                                                                        <p>{trxndata.receipt_vch_ty == "to" ? <TableCell colSpan={15} style={{ border: "solid" }}>
                                                                        {trxndata.receipt_vch_amt}
                                                                        </TableCell> : ""}
                                                                        </p>
                                                                    </TableCell>
                                                                </tr>
                                                            </TableRow>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            </TableRow>
                                        )
                                    })}

                                </TableBody>
                            </TableCell>
                            <TableCell style={{ width: "50%", borderLeft: "solid" }}>
                                <TableHead>
                                    <TableRow>

                                        <TableCell >Daybook Payment</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processedDaybookData.datapaymentres.map((val, key) => {
                                        return (
                                            <TableRow key={key} style={{ borderBottom: "dashed", overflowX: "auto" }}>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Voucher No:{val.payment_vch_no} |Voucher Date:{formatDate(val.payment_vch_date)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <tr>
                                                            <td colSpan={3}>{val.payment_vch_desc}</td>
                                                        </tr>
                                                        {sortFromTo(val.transactions, "payment_vch_ty").map((trxndata, trxndatakey) => (
                                                            <TableRow key={trxndatakey}>
                                                                <tr>
                                                                    <TableCell>{trxndata.payment_vch_ty}</TableCell>
                                                                    <TableCell>{trxndata.account_desc}</TableCell>
                                                                    <TableCell>{trxndata.payment_vch_type}</TableCell>
                                                                    <TableCell>{trxndata.payment_vch_ty!="from"?trxndata.payment_vch_amt:""}</TableCell>
                                                                    <TableCell>
                                                                        {trxndata.payment_vch_ty == "from" ? <TableCell colSpan={15} style={{ border: "solid" }}>
                                                                        {trxndata.payment_vch_amt}
                                                                        </TableCell> : ""}

                                                                    </TableCell>
                                                                </tr>

                                                            </TableRow>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>

                                                {/* <TableCell>
                                                {Object.keys(val.transactions).map((dat, datkey) => (
                                                    <TableRow key={datkey}>
                                                        <TableCell>{dat.daybook_payment_id}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableCell> */}
                                            </TableRow>
                                        )
                                    })}

                                </TableBody>
                            </TableCell>

                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }

}

export default ConsTrailBook;
