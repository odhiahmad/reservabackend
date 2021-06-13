const { create,getUser,getUserById,deleteUser,getUserByUsername } = require("./user.service");
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
                    berhasil:0,
                    pesan:'Record tidak ada'
                })
            }
            return res.json({
                berhasil:1,
                data:results
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
                results.password = undefined;
                const jsonToken = sign({result:results},"qwe1234",{expiresIn: "7d"});
                return res.json({
                    berhasil:1,
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