import React from 'react'
import { useState } from 'react'

function useVoucher() {

    const[inWardDataForEdit,setInWarDataForEdit] =useState([])
    const[outWardDataForEdit,setOutWarDataForEdit] =useState([])
    const [dataForEdit,setDateforEdit] = useState({})
    const [voucherEditing,setVoucherEditing] = useState(false)

  return {
    dataForEdit,
    setDateforEdit,
    voucherEditing,
    setVoucherEditing,
    inWardDataForEdit,
    setInWarDataForEdit,
    outWardDataForEdit,
    setOutWarDataForEdit
  }
}

export default useVoucher