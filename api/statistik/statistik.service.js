const pool = require("../../config/database");
const moment = require('moment');

moment.locale('id');  

module.exports = {
    statistikDashboard:(id,callBack) => {
        pool.query(
            'select count(*) from absen where id_user = ? and status = 3;'+
            'select count(*) from absen where id_user = ? and status = 2;'+
            'select count(*) from absen where id_user = ? and status = 1;'+
            'select sum(terlambat) from absen where id_user = ?;',[id,id,id,id],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results);
        })
        
    },
   


};