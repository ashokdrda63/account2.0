const get_all_accountDes = (con, req, res) => {
    console.log(req.body)
    const {scheme_name,voucher_type,to_from} = req.body
      //const qry = "select acc_id, acc_name from account_plus.obmaster_master  where scheme_name='"+scheme_name+"'"
    var qry = ""
    if(voucher_type == "BR" && to_from == "to")
      qry = "select acc_id, acc_name from account_plus.obmaster_master "+
      " where scheme_name='"+scheme_name+"' and budget_name = 'BANK'"
    
    else if(voucher_type == "BR" && to_from == "from")
      qry = "select acc_id, acc_name from account_plus.acc_budget_map_master where "+ 
              " budget_name ='INCOME'"
  
    else if(voucher_type == "CR" && to_from == "to")
      qry = "select acc_id, acc_name from account_plus.obmaster_master where "+ 
                "scheme_name ='"+scheme_name+"' and budget_name ='CASH-IN-HAND'"
    
    else if(voucher_type == "CR" && to_from == "from")
      qry = "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
              "budget_name = 'INCOME'"
    
    else if(voucher_type == "BP" && to_from == "to")
      qry = "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
                "budget_name = 'EXPENDITURE' or budget_name = 'ADVANCE' or budget_name = 'LIBILITIES'"
    
    else if(voucher_type == "BP" && to_from == "from")
      qry = "select acc_id, acc_name from account_plus.obmaster_master where "+ 
                "scheme_name ='"+scheme_name+"' and budget_name ='BANK'"
    else qry = ""
    console.log("Qry : "+qry)
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if(result.length > 0){
           console.log("Record Present..")
           res.json(result)
         } 
        else{
           console.log(result+"--result")
           res.json([])
        }
      });
    });
  }

  const insert_outWordVoucher = async(req,res,db)=>{
    try {
      const{Scheme_name,Vch_type,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,total_Amount,table_name}  = req.body;
      if (!Scheme_name || !Vch_type || !Vch_date  || !Bank_name || !Vch_desc || !total_Amount || !table_name) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const insertedData = await db(table_name).insert({Scheme_name,VchType,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,total_Amount}).returning("*")
      console.log(insertedData)
      if (insertedData.length === 0) {
        return res.status(400).json({ error: "Record not inserted" });
      }
      res.status(200).json({ message: "Record Inserted", data: insertedData[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }


  const searchVoucher_outWard = (con, req, res) => {
    const vch_no = req.body.vch_no;
  
    const qry1 = "SELECT * FROM outward_vchentry_view WHERE vch_no = ?";
    const qry2 = "SELECT * FROM inword_vchentry WHERE vchno = ? ORDER BY id";
  
    const promise1 = new Promise((resolve, reject) => {
      con.query(qry1, [vch_no], (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  
    const promise2 = new Promise((resolve, reject) => {
      con.query(qry2, [vch_no], (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  
    Promise.all([promise1, promise2])
      .then((results) => {
        const [result1, result2] = results;
        res.json({
          outward_vchentry: result1,
          inword_vchentry: result2,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "Error in one of the queries" });
      });
  };
  
    // const postSchemeTableData = (req, res, db) => {
    //   const { scheme_id,scheme_name,created_by,modified_by} = req.body
    //   const added = new Date()
    //   console.log("Inside save method---"+req.body)
    //   db('account_master').insert({scheme_id,scheme_name,created_by,modified_by})
    //     .returning('*')
    //     .then(item => {
    //       res.json({ "status": "SUCCESS" })
    //     })
    //     .catch(err => res.status(400).json({ dbError: err.message }))
    // }
  
    // const postBudgetTableData = (req, res, db) => {
    //   const {budget_id,budget_name,created_by,modified_by} = req.body
    //   const added = new Date()
    //   console.log("Inside save method---"+req.body)
    //   db('Budget_master').insert({budget_id,budget_name,created_by,modified_by})
    //     .returning('*')
    //     .then(item => {
    //       res.json({ "status": "SUCCESS" })
    //     })
    //     .catch(err => res.status(400).json({ dbError: err.message }))
    // }
//-----------------------------------------------------------------------------------

    /*
select * from account_plus.family_perticulars a 
join account_plus.family_head b on 
a.houseNo = b.idfamily_head;
    */

// const searchVoucher_outWard = (con,req, res) => {
  //   const vch_no = req.body.vch_no
  //   // console.log('"+vch_no+">>>>>>>>>>>>>>>>>>>>',typeof(vch_no),vch_no)
  //   const qry = "SELECT * from outward_vchentry_view where vch_no = ? "
  //   con.connect(function(err) {
  //     con.query(qry,[vch_no] ,function (err, result, fields) {
  //       if (err) throw err;
  //       res.json(result)
  //       console.log(res)
  //     });
  //   });
  //   const qry1 ="SELECT * FROM inword_vchentry WHERE vchno =( ? ) ORDER BY id"
  //   con.connect(function(err) {
  //     con.query(qry,[vch_no] ,function (err, result, fields) {
  //       if (err) throw err;
  //       res.json(result)
  //       console.log(res)
  //     });
  //   });
  // }

  // const insert_outWordVoucher =(req,res,db)=>{
//   console.log('lllllllll',req);
//   const{Scheme_name,vch_no,Vch_type,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,total_Amount,table_name} = req.body;
//   db(table_name).insert({Scheme_name,vch_no,Vch_type,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,total_Amount})
//   .returning("*")
//   .then(item=>{
//     res.json("Record Inserted")
//   })
//   .catch(err=> res.status(400).json({ dbError: err.message }))
//  }


// const putTableData = (req, res, db) => {
  //   const { id, song_title, movie_album, singers, song_length, genre, song_url } = req.body
  //   db('songlist').where({ id }).update({ song_title, movie_album, singers, song_length, genre, song_url })
  //   .returning('*')
  //   .then(item => {
  //     res.json(item)
  //   })
  //   .catch(err => res.status(400).json({ dbError: 'db error' }))
  // }