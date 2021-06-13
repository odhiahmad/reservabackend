const pool = require("../../config/database");
const moment = require('moment');

moment.locale('id');  

module.exports = {
    updatePegawai:(data,callBack) => {
        pool.query('update pegawai set nama=?,jabatan=?,gaji=? where id = ?',
        [
            data.nama,
            data.jabatan,
            data.gaji,
            data.id
        ],
        (error, results,fields)=>{
            if(error){
                callBack(error)
            }
            return callBack(null,results[0])
        })
    },
    getPegawai:callBack => {
        pool.query('select * from pegawai',[],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results);
        })
    },
    getPegawaiById:(id,callBack) => {
        pool.query('select * from pegawai where id = ?',[id],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results[0]);
        })
    },
    getPegawaiByIdUser:(id,callBack) => {
        pool.query('select * from pegawai where id_user = ?',[id],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results[0]);
        })
    }

};