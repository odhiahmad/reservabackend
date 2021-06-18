const pool = require("../../config/database");
const moment = require('moment');

moment.locale('id');  

module.exports = {
    storeAbsenMasuk:(data,callBack) => {
        pool.query(
            `insert into absen(id_user,id_pegawai,nama,tanggal,jam_masuk,jam_keluar,status,shift,terlambat,jam_check1,jam_check2,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                data.id_user,
                data.id_pegawai,
                data.nama,
                data.tanggal,
                data.jam_masuk,
                data.jam_keluar,
                data.status,
                data.shift,
                data.terlambat,
                data.jam_check1,
                data.jam_check2,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                moment().format('YYYY-MM-DD HH:mm:ss'),
            ],
            (error,results,fields) =>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            });
    },
    storeAbsenPulang:(data,callBack) => {
        pool.query('update absen set jam_keluar=?,total=? where id_user = ? and tanggal = ?',
        [
            data.jam_keluar,
            data.total,
            data.id_user,
            data.tanggal
        ],
        (error, results,fields)=>{
            if(error){
                callBack(error)
            }
            return callBack(null,results)
        })
    },
    storeAbsenCek1:(data,callBack) => {
        pool.query('update absen set jam_check1=? where id_user = ? and tanggal = ?',
        [
            data.jam_check,
            data.id_user,
            data.tanggal
        ],
        (error, results,fields)=>{
            if(error){
                callBack(error)
            }
            return callBack(null,results)
        })
    },
    storeAbsenCek2:(data,callBack) => {
        pool.query('update absen set jam_check2=? where id_user = ? and tanggal = ?',
        [
            data.jam_check,
            data.id_user,
            data.tanggal
        ],
        (error, results,fields)=>{
            if(error){
                callBack(error)
            }
            return callBack(null,results)
        })
    },
    getAbsenById:(id_user,tanggal,callBack) => {
        pool.query('select * from absen where id_user = ? and tanggal = ?; select * from absen where id_user = ? and jam_keluar is not null limit 7',[id_user,tanggal,id_user],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results);

        })
        
    },
    

   

};