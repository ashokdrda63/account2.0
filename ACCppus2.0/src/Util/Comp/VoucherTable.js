import React, { useEffect } from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function VoucherTable({voucherRows,setVouncherRows,setSubmitTrue,submitTrue,totalCredit,totalDebit}) {


    // console.log("voucherRowsddddddddddddddddddddd",submitTrue,typeof(subTotalCredit(voucherRows)),subTotalCredit(voucherRows),typeof(subTotalDebit(voucherRows)),subTotalDebit(voucherRows))
    // function subTotalCredit (voucherRows){
    //     return voucherRows.map((voucherRows)=>voucherRows.accountTo).reduce((sum,i)=>sum+i,0)
    // }
    // function subTotalDebit (voucherRows){
    //     console.log(".......0",voucherRows)
    //     return voucherRows.map((voucherRows)=>voucherRows.accountFrom).reduce((sum,i)=>sum+i,0)
    // }
    
    const deleteRow =(index)=>{
        let aa = voucherRows.filter((item,i)=>i !==index)
        setVouncherRows(aa)
    } 
    // useEffect(()=>{
    //     if (totalCredit === totalDebit ) {
    //         setSubmitTrue(true);
    //         console.log('ccccccccccccccccccccccc');
    //     } else {
    //         setSubmitTrue(false)
    //     }
    // },[voucherRows])


    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Account Name</TableCell>
                            <TableCell align="right">Account Type</TableCell>
                            <TableCell align="right">Credit</TableCell>
                            <TableCell align="right">Debit</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {voucherRows.map((row, index) => (
                            <TableRow key="index">
                                <TableCell>{row.accountDesName}</TableCell>
                                <TableCell align="center">{row.accountTy}</TableCell>
                                <TableCell align="right">{row.accountTo}</TableCell>
                                <TableCell align="right">{(row.accountFrom)}</TableCell>
                                <TableCell align="right"><button onClick={()=>deleteRow(index)}>Delete</button></TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell rowSpan={1} />
                            <TableCell colSpan={1}>Subtotal</TableCell>
                            <TableCell align="right">{totalCredit}</TableCell>
                            <TableCell align="right">{totalDebit}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default VoucherTable