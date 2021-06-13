const pool = require("../../config/database");
const moment = require('moment');

moment.locale('id');  

module.exports = {
    create:(data,callBack) => {
        pool.query(
            `insert into users(username,password,role) values (?,?,?)`,
            [
                data.username,
                data.password,
                data.role,
               

            ],
            (error,results,fields) =>{
                if(error){
                    return callBack(error)
                }
                pool.query('insert into pegawai(id_user,nama,tipe,gaji,created_at,updated_at) values (?,?,?,?,?,?)',
                [
                    results.insertId,
                    data.nama,
                    data.tipe,
                    data.gaji,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ],
                (error,resultsDua,fields) => {
                    if(error){
                        return callBack(error)
                    }
                    return callBack(null,resultsDua)
                })

            });
    },
    getUser:callBack => {
        pool.query('select * from users',[],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results);
        })
    },
    getUserById:(id,callBack) => {
        pool.query('select * from users where id = ?',[id],(error,results,fields) =>{
            if(error){
                return callBack(error);
            }

            return callBack(null,results[0]);
        })
    },
    deleteUser:(data,callBack) => {
        pool.query(
            'delete from users where id=?',[data.id],
            (error,results,fields) =>{
                if(error){
                    return callBack(error)
                }
                pool.query(
                    'delete from pegawai where id_user=?',[data.id],
                    (error,results,fields) =>{
                        return callBack(null,results[0]);
                    }
                )
            }
        )
    },
    getUserByUsername:(username,callback) => {
        pool.query(
            'select * from users where username = ?',[username],(error,results,fields) =>{
                if(error){
                    callback(error);
                }
                return callback(null,results[0]);
            }
        )
    }

};