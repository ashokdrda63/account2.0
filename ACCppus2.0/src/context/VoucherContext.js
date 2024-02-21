import React,{createContext} from "react";
import useVoucher from "../hooks/useVoucher";

//context
export const VoucherContext = createContext();


const VoucherContextProvider =({children})=>{
    const allcontext  = useVoucher();
    return(
        <VoucherContext.Provider value={allcontext}>{children}</VoucherContext.Provider>
    )
}

export default VoucherContextProvider;