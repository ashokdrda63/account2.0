import React, { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import { fetchTableMaqSeq } from "../Util/CommonFun/CommonFun";
import { StyledInput } from "../Util/Comp/SmallComp"

function SchemeMaster() {
  const [schemeMaster, setSchemeMaster] = useState({
    id: '',
    name: '',
    created_by: '',
    modified_by: '',
  });
  const [maxSequ, setmaxSequ] = useState(null)
  const [schemeName, setSchemeName] = useState("")

  const onSchemeNameChange = (e) => {
    const { value } = e.target;
    setSchemeName(value)
  };

  const checkEntry = () => {
    console.log("called")
    if (schemeName.length < 5) {
      return false
    } else {
      return true
    }
  };


  const addBudgetDetails = async () => {
    if (checkEntry()) {
      let maxSeq = await fetchTableMaqSeq("Scheme")
      let temp = schemeMaster;
      temp.id = `${schemeName.substring(0, 3)}_${maxSeq + 1}`;
      temp.name = schemeName;
      temp['table_name'] = 'scheme'
      setSchemeMaster(temp)
      async function storeMasterData() {
        let response = await axios.post('http://localhost:8000/insert_scheme', schemeMaster)
      }
      storeMasterData()
      setSchemeMaster({
        id: '',
        name: '',
        created_by: '',
        modified_by: '',
      })
      document.getElementById("scheme_id").value = ""
    } else {
      alert("Name should be at least 5 characters long");
    }
  };

  return (
    <div>
      <Box sx={{ border: "2px solid red", padding: "30px", borderRadius: "10px", width: "500px", textAlign: "center", display: "flex", flexDirection: "column", gap: "20px" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "24px" }}>Add Scheme</Typography>
        <form>
          <StyledInput
            id="scheme_id"
            width="400px"
            onChange={onSchemeNameChange}
            placeholder='Enter Scheme Name'
            value={schemeName}
            sx={{

            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={addBudgetDetails}
            sx={{
              mt: "20px"
            }}
          >
            Add Budget
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default SchemeMaster;
