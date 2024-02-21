import React, { useState } from 'react';
import axios from "axios";
import useImportVoucher from '../hooks/useImportVoucher';
import { useNavigate } from 'react-router-dom';

function VoucherEdit() {
  const { setDateforEdit,setVoucherEditing } = useImportVoucher();
  const navigate = useNavigate()

  // console.log('inWardDataForEdit//////////////////////////',);
  // const [dataForEditInward,SetDataForEditInward] = useState([])

  const [findVoucherNo, setFindVoucherNo] = useState(" ")
  

  const callDB = (e) => {
    axios.post("http://localhost:8000/search_voucher", { vch_no: findVoucherNo })
    .then((res) => {
      if (res.data) {
        setDateforEdit(res.data);
        setVoucherEditing(true);
        navigate('/Voucher-Entry');
      } else {
        // Handle the case when no data is received
        console.log('No data received from the API.');
      }
    })
    .catch((err) => {
      console.log('Error', err);
    });
  }

  const onSubmit =(e)=>{
    if (e.key === "Enter"){
      callDB()
    }
  }

  return (
    <div>
      <div>VoucherEdit</div>
      <input type="text" onChange={(e) => setFindVoucherNo(e.target.value)} onKeyDown={(e)=>onSubmit(e)} />
      <button onClick={callDB}>click</button>
    </div>
  )
}

export default VoucherEdit;