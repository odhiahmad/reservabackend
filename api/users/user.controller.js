const { create,getUser,getUserById,deleteUser,getUserByUsername,simpanDeviceUser } = require("./user.service");

const { getAbsenById} = require("./../absen/absen.service");
const {genSaltSync,hashSync,compareSync} = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser:(req,res) => {
        console.log(req.body)
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password,salt);
        create(body,(err,results,resultsDua) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    berhasil:0,
                    pesan:"Koneksi database error",
                    error:err
                });
            }
            return res.status(200).json({
                berhasil:1,
                data:results,
                dataDua:resultsDua
            })
        })
    },
    getUserById:(req,res) =>{
        const id = req.params.id;
        getUserById(id,(err,results) =>{
            if(err){
                console.log(err)
                return;
            }
            if(!results){
                return res.json({
                    berhasil:true,
                    pesan:'Record tidak ada'
                })
            }
            return res.json({
                berhasil:true,
                data:results
            })
        })
    },
    getUserAbsenById:(req,res) =>{
        const id = req.params.id;
        const tanggal = req.params.tanggal;
        getUserById(id,(err,results) =>{
            if(err){
                console.log(err)
                return;
            }
            if(!results){
                return res.json({
                    berhasil:true,
                    pesan:'Record tidak ada'
                })
            }

            const dataUser = results;
            getAbsenById(id,tanggal,(err,results) =>{
                if(err){
                    console.log(err)
                    return;
                }
                if(!results){
                    return res.json({
                        berhasil:true,
                        dataAbsenLimit:null,
                        dataUser:dataUser
                    })
                }
                return res.json({
                    berhasil:true,
                    dataAbsenLimit:results[1],
                    dataAbsen:results[0],
                    dataUser:dataUser
                   

                })
            })
        })

    },
   
    getUser:(req,res) => {
        getUser((err,results) => {
            if(err){
                console.log(err);
                 return;
            }
            return res.json({
                berhasil:1,
                data:results
            });
        });
    },
    deleteUser:(req,res)=>{
        const data = req.body;
        deleteUser(data,(err,results)=>{
            if(err){
                console.log(err);
                return
            }
            if(!results){
                return res.json({
                    berhasil:1,
                    pesan:"Record Tidak ada"
                });
            }
            return res.json({
                berhasil:1,
                pesan:"User berhasil di hapus"
            })
        })
    },
    login:(req,res)=>{
        const body = req.body;
        getUserByUsername(body.username,(err,results)=>{
            if(err){
                console.log(err);
            }
            if(!results){
                return res.json({
                    berhasil:0,
                    data:"Username atau password salah"
                });
            }
            const result = compareSync(body.password,results.password);
            
            if(result){
                body.id = results.id;
                if(results.device_id === null){
                    simpanDeviceUser(body)
                }
                results.password = undefined;
                const jsonToken = sign({result:results},"qwe1234",{expiresIn: "7d"});
                return res.json({
                    berhasil:true,
                    pesan:'Login Berhasil',
                    token:jsonToken,
                });
            }else{
                return res.json({
                    berhasil:0,
                    data:'Email atau Password salah'
                })
            }

        });
    }
}