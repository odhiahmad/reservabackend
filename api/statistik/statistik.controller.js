const { statistikDashboard} = require("./statistik.service");

module.exports = {
    statistikDashboard:(req,res) =>{
        const id = req.params.id;
        statistikDashboard(id,(err,results) =>{
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
                data1:results[0],
                data2:results[1],
                data3:results[2],
                data4:results[3],
            })
        })
    },
   
}