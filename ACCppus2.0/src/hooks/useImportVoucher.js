import {useContext} from 'react'
import { VoucherContext } from '../context/VoucherContext'

function useImportVoucher() {
  return useContext(VoucherContext)
}

export default useImportVoucher