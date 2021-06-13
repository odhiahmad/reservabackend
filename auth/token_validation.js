const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken:(req,res,next) =>{
        let token = req.get("Authorization");
        if(token){
            token = token.slice(7);
            verify(token,"qwe1234",(err,decoded)=>{
                if(err){
                    res.json({
                        berhasil:0,
                        pesan:'Token tidak benar'
                    })
                }else{
                    next();
                }
            });
        }else{
            res.json({
                berhasil:0,
                pesan:'Akses di Tolak!, User tidak dikenal'
            })
        }
    }
}