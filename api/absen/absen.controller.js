const { storeAbsenMasuk,storeAbsenPulang } = require('./absen.service');
const geolib = require('geolib');
const moment = require('moment');
const e = require('express');

module.exports = {
    cekLokasi:(req,res) => {
        const body = req.body;
        
        const distance = geolib.getDistance(
            { latitude:-0.958765, longitude:100.379906},
            { latitude: body.lat, longitude: body.long}
        );

        if(distance > 50){
            return res.json({
                berhasil:1,
                pesan:'Anda diluar kantor, jarak anda dengan kantor '+distance+' meter'
            })
        }else{
            return res.json({
                berhasil:1,
                pesan:'Silahkan ambil absen anda'
            })
        }
       
    },

    ambilAbsen:(req,res) => {
        const body = req.body;
        //1 -> Tidak Telat
        //2 -> Telat
        //3 -> Denda
        if(body.tipe === 'Pegawai'){
            if(body.absen === 'masuk'){
                var jam_masuk = moment().format("DD/MM/YYYY HH:mm:ss");
                var jam_check_masuk = moment().format("DD/MM/YYYY 12:00:00");
            
                var duration = moment.utc(moment(jam_masuk,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_masuk,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                var minutes = Math.ceil(moment.duration(duration).asMinutes());
              
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_masuk = moment().format("HH:mm:ss");
                body.jam_keluar = null;
                body.jam_check1 = null;
                body.jam_check2 = null;
                body.shift = null;
                body.terlambat = minutes;
                if(minutes > 30 ){
                    if(minutes > 45){
                        body.status = 3;
                        storeAbsenMasuk(body,(err,results) => {
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
                                data:results,
                            })
                        });
                      
                    }else{
                        body.status = 2;
                        storeAbsenMasuk(body,(err,results) => {
                            if(err){
                            
                                return res.json({
                                    berhasil:0,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:1,
                                data:results,
                            })
                        });
                    }
                }else{
                    body.status = 1;
                    storeAbsenMasuk(body,(err,results) => {
                        if(err){
                            return res.json({
                                berhasil:0,
                                pesan:"Koneksi database error",
                                error:err
                            });
                        }
                        return res.json({
                            berhasil:1,
                            data:results,
                        })
                    });
                }

            }else if(body.absen === 'pulang'){
                var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
            
                var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                var minutes = Math.ceil(moment.duration(duration).asMinutes());
              
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_keluar = moment().format("HH:mm:ss");
                body.total = duration;

                storeAbsenPulang(body,(err,results) => {
                    if(err){
                        return res.json({
                            berhasil:0,
                            pesan:"Koneksi database error",
                            error:err
                        });
                    }
                    return res.json({
                        berhasil:1,
                        data:results,
                    })
                });
            }
        }else if(body.tipe === 'Satpam'){
            if(body.absen === 'masuk'){
                if(body.shift === 1){
                    var jam_masuk = moment().format("DD/MM/YYYY HH:mm:ss");
                    var jam_check_masuk = moment().format("DD/MM/YYYY 07:00:00");
                
                    var duration = moment.utc(moment(jam_masuk,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_masuk,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    var minutes = Math.ceil(moment.duration(duration).asMinutes());
                  
                    body.tanggal = moment().format("YYYY-MM-DD");
                    body.jam_masuk = moment().format("HH:mm:ss");
                    body.jam_keluar = null;
                    body.jam_check1 = null;
                    body.jam_check2 = null;
                    body.terlambat = minutes;

                    if(minutes > 30 ){
                        if(minutes > 45){
                            body.status = 3;
                            storeAbsenMasuk(body,(err,results) => {
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
                                    data:results,
                                })
                            });
                          
                        }else{
                            body.status = 2;
                            storeAbsenMasuk(body,(err,results) => {
                                if(err){
                                
                                    return res.json({
                                        berhasil:0,
                                        pesan:"Koneksi database error",
                                        error:err
                                    });
                                }
                                return res.json({
                                    berhasil:1,
                                    data:results,
                                })
                            });
                        }
                    }else{
                        body.status = 1;
                        storeAbsenMasuk(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:0,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:1,
                                data:results,
                            })
                        });
                    }
                }else if(body.shift === 2){
                    var jam_masuk = moment().format("DD/MM/YYYY HH:mm:ss");
                    var jam_check_masuk = moment().format("DD/MM/YYYY 17:00:00");
                
                    var duration = moment.utc(moment(jam_masuk,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_masuk,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    var minutes = Math.ceil(moment.duration(duration).asMinutes());
                  
                    body.tanggal = moment().format("YYYY-MM-DD");
                    body.jam_masuk = moment().format("HH:mm:ss");
                    body.jam_keluar = null;
                    body.jam_check1 = null;
                    body.jam_check2 = null;
                    body.terlambat = minutes;

                    if(minutes > 30 ){
                        if(minutes > 45){
                            body.status = 3;
                            storeAbsenMasuk(body,(err,results) => {
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
                                    data:results,
                                })
                            });
                          
                        }else{
                            body.status = 2;
                            storeAbsenMasuk(body,(err,results) => {
                                if(err){
                                
                                    return res.json({
                                        berhasil:0,
                                        pesan:"Koneksi database error",
                                        error:err
                                    });
                                }
                                return res.json({
                                    berhasil:1,
                                    data:results,
                                })
                            });
                        }
                    }else{
                        body.status = 1;
                        storeAbsenMasuk(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:0,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:1,
                                data:results,
                            })
                        });
                    }
                }
            }else if(body.absen === 'pulang'){
                if(body.shift === 1){
                    var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                    var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
                
                    var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    var minutes = Math.ceil(moment.duration(duration).asMinutes());
                  
                    body.tanggal = moment().format("YYYY-MM-DD");
                    body.jam_keluar = moment().format("HH:mm:ss");
                    body.total = duration;
    
                    storeAbsenPulang(body,(err,results) => {
                        if(err){
                            return res.json({
                                berhasil:0,
                                pesan:"Koneksi database error",
                                error:err
                            });
                        }
                        return res.json({
                            berhasil:1,
                            data:results,
                        })
                    });
                }else if(body.shift === 2){
                    var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                    var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
                
                    var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    var minutes = Math.ceil(moment.duration(duration).asMinutes());
                  
                    body.tanggal = moment().format("YYYY-MM-DD");
                    body.jam_keluar = moment().format("HH:mm:ss");
                    body.total = duration;
    
                    storeAbsenPulang(body,(err,results) => {
                        if(err){
                            return res.json({
                                berhasil:0,
                                pesan:"Koneksi database error",
                                error:err
                            });
                        }
                        return res.json({
                            berhasil:1,
                            data:results,
                        })
                    });
                }
            }
        }else if(body.tipe === 'CS'){
            
        }


    }
   
}