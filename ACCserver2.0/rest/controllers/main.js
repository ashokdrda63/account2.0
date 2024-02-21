const utilcomponent= require('../util/utility');
const getTableData = (req, res, db) => {
  db.select('*').from('budget_master')
    .then(items => {
      if (items.length) {
        res.json(items)
      } else {
        res.json({ dataExists: 'false' })
      }
    })
    .catch(err => res.status(400).json({ dbError: err }))
}

const getAllRecords = (req, res, db) => {
  const { table_name } = req.body
  db.select('*').from(table_name + '_master')
    .then(items => {
      if (items.length) {
        res.json(items)
      } else {
        res.json([])
      }
    })
    .catch(err => res.status(400).json({ dbError: err }))
}

const getAllRecordsReverse = (req, res, db) => {
  const { table_name } = req.body
  db.select('*').from(table_name + '_master').orderBy('seq_no', 'desc')
    .then(items => {
      if (items.length) {
        res.json(items)
      } else {
        res.json([])
      }
    })
    .catch(err => res.status(400).json({ dbError: err }))
}


const get_all_scheme_obmaster = (req, res, db) => {
  const { table_name } = req.body
  db.select('id', 'name').from(table_name + '_master')
    .then(items => {
      if (items.length) {
        res.json(items)
      } else {
        res.json([])
      }
    })
    .catch(err => res.status(400).json({ dbError: err }))
}

const insertTableData = (req, res, db) => {
  const { id, name, created_by, modified_by, table_name } = req.body
  const added = new Date()
  // console.log("Inside save method---"+JSON.stringify(req.body))
  db(table_name + '_master').insert({ id, name, created_by, modified_by })
    .returning('*')
    .then(item => {
      res.json({ "status": "SUCCESS" })
    })
    .catch(err => res.status(400).json({ dbError: err.message }))
}

const get_indivisual_budget_max_seq =(req,res,db)=>{
  const {budgetName} = req.body
  db('acc_budget_map_master')
  .select('budget_name')
  .count('budget_name as RepetitionCount')
  .where({ budget_name: budgetName })
  .groupBy('budget_name')
  .then((items) => {
    if(items.length){
      res.json(items);
    }else{
      res.json("no row inserted yet")
    }
  })
  .catch((err) => {
    console.error("Error retrieving budget repetition count:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });
};

const insert_acc_budget_map = (req, res, db) => {
  const { acc_id, acc_name, budget_id, budget_name, table_name } = req.body
  db(table_name + '_master').insert({ acc_id, acc_name, budget_id, budget_name })
    .returning('*')
    .then(item => {
      db.select('*').from(table_name + '_master')
        .then(items => {
          if (items.length) {
            res.json(items)
          } else {
            res.json({ dataExists: 'no data' })
          }
        })
        .catch(err => res.status(400).json({ dbError: err }))
    })
    .catch(err => res.status(400).json({ dbError: err.message }))
}


const update_acc_budget_map = (req, res, db) => {
  // Assuming 'db' is a valid database connectio
  const { acc_id, acc_name, budget_id, budget_name, seq_no } = req.body;
  // const q ="UPDATE acc_budget_map_master SET acc_id = ?, acc_name = ?, budget_id = ?, budget_name = ? WHERE seq_no = ?";
  // const values = [acc_id, acc_name, budget_id, budget_name, seq_no];
  console.log("Request body:", values);
  db("acc_budget_map_master").where({ seq_no }).update({ acc_id, acc_name, budget_id, budget_name })
    .returning('*')
    .then(item => {
      db.select('*').from("acc_budget_map_master")
        .then(items => {
          if (items.length) {
            res.json(items)
          } else {
            res.json({ dataExists: 'false' })
          }
        })
        .catch(err => res.status(400).json({ dbError: err }))
    })
    .catch(err => res.status(400).json({ dbError: err.message }))
};

const insert_outWordVoucher = (req, res, con) => {
  const { Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount, table_name } = req.body;
  const values = [Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount]
  const q = "select * from " + table_name + " where vch_no = ? ";
  con.connect((err) => {
    if (err) {
      res.status(500).json({ error: "Database connection error" })
    } else {
      con.query(q, [vch_no], (err, result, feilds) => {
        if (err) {
          res.status(500).json({ error: "Voucher No ALready Exist" })
        }
        if (result.length === 0) {
          console.log('result', result);
          const q1 = "INSERT INTO " + table_name + " (Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount) VALUES (?)"
          con.query(q1, [values], (err, result, fields) => {
            if (!err) {
              res.json("Record Inserted");
            }
            else {
              console.log('err???????????????', err);
              res.status(400).json({ Error1: err })
            }
          })
        } else {
          res.status(400).json({ error: "Voucher No Already Exists" });
        }
      })
    }
  })
}

const insert_obmaster = (req, res, db) => {
  console.log('kkkkkkkkkkkkkkkkkk', req.body);
  const { scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name, amt_pay, amt_rec, table_name } = req.body
  // console.log(JSON.stringify(req.body)+"---console")
  db(table_name + '_master').insert({ scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name, amt_pay, amt_rec })
    .returning('*')
    .then(item => {
      db.select('*').from(table_name + '_master').orderBy('seq_no', 'desc')
        .then(items => {
          if (items.length) {
            res.json(items)
          } else {
            res.json({ dataExists: 'false' })
          }
        })
        .catch(err => res.status(500).json({ dbError7: err }))
    })
    .catch(err => res.status(400).json({ dbError3: err.message }))
}

const updateInsert_obmasterr = (req, res, db) => {
  console.log('kkkkkkkkkkkkkkkkkk', req.body);
  const { amt_pay, amt_rec, table_name, seq_no } = req.body
  console.log(JSON.stringify(req.body) + "---console")
  db(table_name + '_master').where({ seq_no }).update({ amt_pay, amt_rec })
    // db(table_name+'_master').insert({ scheme_id,scheme_name,budget_id,budget_name,acc_id, acc_name,amt_pay,amt_rec})
    .returning('*')
    .then(item => {
      db.select('*').from(table_name + '_master').orderBy('seq_no', 'desc')
        .then(items => {
          if (items.length) {
            res.json(items)
          } else {
            res.json({ dataExists: 'false' })
          }
        })
        .catch(err => res.status(500).json({ dbError7: err }))
    })
    .catch(err => res.status(400).json({ dbError3: err.message }))
}

const inset_ObMust = (req, res, db) => {
  console.log(req.body)
  const { scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name, table_name } = req.body
  console.log("/////////////////////", scheme_id)
  db(table_name + '_master').insert({ scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name }).returning("*")
    .then(item => {
      res.json("Record Inserted")
    }).catch(err => res.status(400).json({ dbError: err.message }))
}


const get_all_accountDes = (con, req, res) => {
  console.log(req.body);
  const { scheme_name, voucher_type, to_from } = req.body;
  let qry = "";
  try {
    if (voucher_type == "BR" && to_from == "to") {
      qry =
        "select acc_id, acc_name from account_plus.obmaster_master " +
        " where scheme_name='" + scheme_name + "' and budget_name = 'BANK'";
    } else if (voucher_type == "BR" && to_from == "from") {
      qry =
        "select acc_id, acc_name from account_plus.acc_budget_map_master where " +
        " budget_name ='INCOME'";
    } else if (voucher_type == "CR" && to_from == "to") {
      qry =
        "select acc_id, acc_name from account_plus.obmaster_master where " +
        "scheme_name ='" + scheme_name + "' and budget_name ='CASH-IN-HAND'";
    } else if (voucher_type == "CR" && to_from == "from") {
      qry =
        "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
        "budget_name = 'INCOME'";
    } else if (voucher_type == "BP" && to_from == "to") {
      qry =
        "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
        "budget_name = 'EXPENDITURE' or budget_name = 'ADVANCE' or budget_name = 'LIBILITIES'";
    } else if (voucher_type == "BP" && to_from == "from") {
      qry =
        "select acc_id, acc_name from account_plus.obmust_master where " +
        "scheme_name ='" + scheme_name + "' and budget_name ='BANK'";
    } else {
      qry = "";
    }
    console.log("Qry : " + qry);

    con.connect(function (err) {
      if (err) {
        console.error("Database connection error:", err);
        res.status(500).json({ error: "Database connection error" });
        return;
      }

      con.query(qry, function (err, result, fields) {
        if (err) {
          console.error("Database query error:", err);
          res.status(500).json({ error: "Database query error" });
          return;
        }

        if (result.length > 0) {
          console.log("Record Present..");
          res.json(result);
        } else {
          console.log(result + "--result");
          res.json([]);
        }
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const get_AccountDetails = (req, res, con) => {
  const { table_name, budget_name } = req.body
  //  console.log(budget_name+"---------");
  const qry = "select acc_id, acc_name from account_plus.acc_budget_map_master where budget_name='" + budget_name + "'"
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (result.length > 0) {
        console.log("Record Present..")
        res.json(result)
      }
      else {
        console.log(result + "--result")
        res.json([])
      }
    });
  });
}

const insertMapData = (con, req, res, db) => {
  console.log(JSON.stringify(req.body))
  const { budget_id, account_id } = req.body
  const added = new Date()
  const qry = "SELECT count(1) as cnt FROM budget_account_sync where budget_id='" + budget_id + "' and account_id='" + account_id + "'"
  const insertQuery = "INSERT INTO budget_account_sync values('" + budget_id + "','" + account_id + "')"
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (result[0].cnt > 0)
        res.json("Record Present")
      else {
        insertRecordToDB(con, insertQuery)
        res.json("Data Inserted")
      }
    });
  });
}


const insert_family_perticular = (con, req, res, db) => {
  // console.log(JSON.stringify(req.body))
  const items = req.body
  con.connect(function (err) {
    con.query(
      'INSERT INTO family_perticulars (name, age, gender, salary, houseNo) VALUES ?',
      [items.map(item => [item.name, item.age, item.gender, item.salary, item.houseNo])],
      (error, results) => {
        console.log(error)
      }
    );
  });
}

// const insert_inWordVoucher = (con, req, res) => {
//   const items = req.body;
//   con.connect(function (err) {
//     con.query(
//       'INSERT INTO inword_vchentry (scheme_name,account_desc,amount_rec,amount_pay,vch_ty,vchno) VALUES ?',
//       [items.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, item.vch_no])],
//       (error, results) => {
//         if (results?.insertId > 0) {
//           res.json("Record Inserted")
//         }
//         console.log("error>>>>>>>>>",error)
//       }
//     );
//   })
// }

const insert_inWordVoucher = (con, req, res) => {
  const items = req.body;
  console.log('???????????????????',items);
  con.connect(function (err) {
    con.query(
      'INSERT INTO inword_vchentry (scheme_name,account_desc,amount_rec,amount_pay,vch_ty,vchno,acc_id,vch_type,vch_date) VALUES ?',
      [items.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, item.vch_no,item.acc_id,item.vch_type,item.vch_date])],
      (error, results) => {
        if (results?.insertId > 0) {
          res.json("Record Inserted")
        }else {
          console.log(">>>>>>>>>>>>>>>",error)
          res.status(500).json({ error: "No records were inserted" });
        }
      }
    );
  })
}

const insert_familyy_perticular = (con, req, res, db) => {
  const items = req.body
  con.connect(function (err) {
    con.query(
      'INSERT INTO school_status (fname, age, gender, salary, rollno) VALUES ?',
      [items.map(item => [item.fname, item.age, item.gender, item.salary, item.rollno])],
      (error, results) => {
        console.log(error)
      }
    );
  });
}

const searchForrollno = (con, req, res) => {
  const rollno = req.body
  console.log(JSON.stringify(rollno))
  const qry = "SELECT * from school_status where rollno = '" + rollno.rollno + "'"
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (err) throw err;
      res.json(result)
    });
  });
}

const searchVoucher_outWard = (req, res, con) => {
  const { vch_no } = req.body;
  console.log('cccccccccccccccccccccc', req.body, vch_no);
  const qry = "SELECT * FROM outward_vchentry_view WHERE vch_no = ? ";
  con.connect((err) => {
    if (!err) {
      con.query(qry, [vch_no], (err, result) => {
        if (!err) {
          if (result.length > 0) {
            const qry1 = "SELECT * FROM inword_vchentry WHERE vchno = ? ORDER BY id";
            con.query(qry1, [vch_no], (err, result1) => {
              if (err) {
                res.status(500).json({ error: "Error in the second query" });
              } else {
                console.log("/////////////////////////////////////", result1)
                res.json({ outward_vchentry: result, inword_vchentry: result1 });
              }
            })
          }
        } else {
          res.status(500).json({ error: "NO record found" });
        }
      })
    } else {
      res.status(500).json({ error: "Database connection error" });
    }
  })
}

// const insert_Edited_voucher =(req,res,con)=>{
//   const data = req.body;
//   const { Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount, inWord_allRows } = data;
//   const valuesForOutWard = [Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount];
//   const valuesForInWord = inWord_allRows.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, vch_no]);

//   console.log(valuesForInWord);
//   con.connect((err)=>{
//     if(!err){
//       const q1 ="DELETE FROM outward_vchentry_view WHERE vchno = ?";
//       con.query(q1,[data.vchno],(err,results)=>{
//         if(!err){
//           const q2 = "INSERT INTO " + table_name + " (Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount) VALUES (?)"
//           con.query(q2,[valuesForOutWard],(err,results)=>{
//             if(!err){
//               const q3='DELETE FROM inword_vchentry WHERE vchno = ?'
//               con.query(q3,[data.vchno],(err,results)=>{
//                 if(!err){
//                   const q4='INSERT INTO inword_vchentry (scheme_name,account_desc,amount_rec,amount_pay,vch_ty,vchno) VALUES ?',
//                   // const mapValuesForInWord = valuesForInWord.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, item.vch_no]);
//                   con.query(q4,[valuesForInWord],(err,results)=>{
//                     if(!err){
//                       res.json('Data inserted successfully');
//                     }
//                   })
//                   }
//                 }
//               }
//           })
//         }
//       }

//     }
//     else{
//       res.status(500).json({ error: "Database connection error" })
//     }
//   })
// }

// const insert_Edited_voucher = (req, res, con) => {
//   const data = req.body;
//   const { Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount, inWord_allRows } = data;
//   const valuesForOutWard = [Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount];
//   const valuesForInWord = inWord_allRows.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, vch_no]);
// };

const insert_Edited_voucher = (req, res, con) => {
  const data = req.body;
  const { Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount, inWord_allRows } = req.body;
  const valuesForOutWard = [Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount];
  const valuesForInWord = inWord_allRows;
  console.log('?????????????????????0',vch_no);

  if (!data.vch_no) {
    res.status(400).json({ error: "Voucher number (vch_no) is required" });
    return;
  }

  con.connect((err) => {
    if (err) {
      res.status(500).json({ error: "Database connection error" });
      return;
    }

    con.beginTransaction((transactionErr) => {
      if (transactionErr) {
        con.rollback(() => {
          res.status(500).json({ error: "Transaction error" });
        });
      } else {
        // const table_name = 'your_table_name'; // Replace with your actual table name

        // Define queries
        const q1 = "DELETE FROM outward_vchentry_view WHERE vch_no = ?";
        const q2 = `INSERT INTO outward_vchentry_view (Scheme_name, vch_no, Vch_type, Vch_date, Chq_no, Chq_date, Bank_name, Vch_desc, total_Amount) VALUES (?)`;
        const q3 = "DELETE FROM inword_vchentry WHERE vchno = ?";
        const q4 = "INSERT INTO inword_vchentry (scheme_name, account_desc, amount_rec, amount_pay, vch_ty, vchno) VALUES ?";

        con.query(q1, [vch_no], (err, results) => {
          if (err) {
            con.rollback(() => {
              console.log('erroe---------->',err);
              res.status(500).json({ error: "Error deleting from outward_vchentry_view" });
            });
            return;
          }

          con.query(q2, [valuesForOutWard], (err, results) => {
            if (err) {
              con.rollback(() => {
                res.status(500).json({ error: "Error inserting into your_table_name" });
              });
              return;
            }

            con.query(q3, [vch_no], (err, results) => {
              if (err) {
                con.rollback(() => {
                  res.status(500).json({ error: "Error deleting from inword_vchentry" });
                });
                return;
              }

              const mapValuesForInWord = valuesForInWord.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy, item.vch_no]);

              con.query(q4, [mapValuesForInWord], (err, results) => {
                if (err) {
                  con.rollback(() => {
                    res.status(500).json({ error: "Error inserting into inword_vchentry" });
                  });
                } else {
                  con.commit(() => {
                    res.json('Data inserted successfully');
                  });
                }
              });
            });
          });
        });
      }
    });
  });
};



const getMaxSeqNo = (con, req, res, db) => {
  const { table_name } = req.body
  const qry = "select max(seq_no) as max_seq from " + table_name + "_master"
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (err) throw err;
      res.json(result)
    });
  });

}

const searchForHouseNo = (con, req, res) => {
  console.log(req.body)
  const houseNo = req.body
  // console.log(JSON.stringify(houseNo))
  const qry = "SELECT * from family_perticulars where houseNo = '" + houseNo.house_no + "'"
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (err) throw err;
      res.json(result)
      console.log(res)
    });
  });
}

const insertRecordToDB = (con, qry) => {
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (err) throw err;

    });
  });
}


const putTableData = (req, res, db) => {
  const { id, song_title, movie_album, singers, song_length, genre, song_url } = req.body
  db('songlist').where({ id }).update({ song_title, movie_album, singers, song_length, genre, song_url })
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({ dbError: 'db error' }))
}

const deleteTableData = (req, res, con) => {
  const { budget_id, acc_id, table_name } = req.body
  console.log("Budget Id :" + budget_id)
  console.log("Account Id :" + acc_id)
  console.log(JSON.stringify(req.body))

  const qry = "delete  FROM " + table_name + "_master where budget_id='" + budget_id + "' and acc_id='" + acc_id + "'"
  console.log(qry)
  con.connect(function (err) {
    con.query(qry, function (err, result, fields) {
      if (err != '') { console.log(err) }

      const qry1 = "select * from " + table_name + "_master"
      con.query(qry1, function (err, result, fields) {
        if (err != '') { console.log(err) }
        res.json(result)
      });
    });
  });
}

const loginToken = (req, res, db) => {
  const { userid, password } = req.body
  db('usertable').where({ userid }).where({ password })
    .then(item => {
      if (item.length == 1) {
        res.json({ token: userid + password, dataExists: 'true' })
      } else (
        res.json({ dataExists: 'false' })
      )
    })
    .catch(err => res.status(400).json({ dbError: err }))
}

const processMaster = (req, res, db) => {
  const startDate = req.body.Vch_start_date;
  const endDate = req.body.Vch_end_date;
  const schemeName = req.body.Scheme_name;
  console.log(startDate+","+endDate+","+schemeName)
  db.query("call loadMasterTbl_dated(?,?,?);", [startDate, endDate, schemeName], (err, data) => {
    //console.log("print return value ", data[0].ret_value);
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else {
    	db.query("select * from master_date;", (err, dataResponse) =>{
    		console.log(err, dataResponse);
    		if (err) return res.json({ error: err.sqlMessage });
    		else return res.json({ dataResponse });
    	});
    }
  });
};

const processDaybook = (req, res, db) => {
  const startDate = req.body.Vch_start_date;
  const endDate = req.body.Vch_end_date;
  const schemeName = req.body.Scheme_name;
  console.log(startDate + "," + endDate + "," + schemeName)
  db.query("call loadDaybookTbl_dated(?,?);", [startDate, endDate], (err, data) => {
    //console.log("print return value ", data[0].ret_value);
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else {
      db.query("select * from daybook_payment;", (errpay, datapayment) => {
        console.log(errpay, datapayment);
        if (errpay) return res.json({ error: errpay.sqlMessage });
        else {
          db.query("select * from daybook_received;", (errrec, datareceived) => {
            console.log(errrec, datareceived);
            if (errrec) return res.json({ error: errrec.sqlMessage });
            else {
              const datapaymentres= utilcomponent.rowToJsonPaymentResponse(datapayment);
              const datareceivedres= utilcomponent.rowToJsonReceivedResponse(datareceived);
              const dataResponse= { datapaymentres, datareceivedres };
              return res.json(dataResponse);
            }
          })}
      });
    }
  });
};

module.exports = {
  getTableData,
  //postBudgetTableData,
  insertTableData,
  putTableData,
  deleteTableData,
  loginToken,
  getMaxSeqNo,
  getAllRecords,
  getAllRecordsReverse,
  insertMapData,
  //postSchemeTableData,
  insert_acc_budget_map,
  inset_ObMust,
  update_acc_budget_map,
  get_AccountDetails,
  insert_obmaster,
  updateInsert_obmasterr,
  insert_inWordVoucher,
  insert_family_perticular,
  get_all_accountDes,
  get_all_scheme_obmaster,
  searchForHouseNo,
  insert_outWordVoucher,
  searchVoucher_outWard,
  insert_Edited_voucher,
  processMaster,
  processDaybook,
  get_indivisual_budget_max_seq
}
