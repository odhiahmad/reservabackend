const { updatePegawai,getPegawai,getPegawaiById } = require("./pegawai.service");
const {genSaltSync,hashSync} = require("bcrypt")

module.exports = {
    updatePegawai:(req,res) => {
        console.log(req.body)
        updatePegawai(body,(err,results) => {
            if(err){
                console.log(err);
                return res.json({
                    berhasil:0,
                    pesan:"Koneksi database error",
                    error:err
                });
            }
            return res.json({
                berhasil:1,
                pesan:'Berhasil update ',
               
            })
        })
    }, 
    getPegawaiById:(req,res) =>{
        const id = req.params.id;
        getPegawaiById(id,(err,results) =>{
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
    getPegawai:(req,res) => {
        getPegawai((err,results) => {
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

}