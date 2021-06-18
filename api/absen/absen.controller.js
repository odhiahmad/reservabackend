const { storeAbsenMasuk,storeAbsenPulang,storeAbsenCek1,storeAbsenCek2 } = require('./absen.service');
const { checkDevice } = require('../users/user.service');
const geolib = require('geolib');
const moment = require('moment');
const e = require('express');

module.exports = {
    cekLokasi:(req,res) => {
        const body = req.body;
       
        const distance = geolib.getDistance(
            { latitude: -0.958780, longitude:100.379277},
            { latitude: body.lat, longitude: body.long}
        );

        if(distance > 50){
            return res.json({
                berhasil:false,
                pesan:'Anda diluar kantor, jarak anda dengan kantor '+distance+' meter'
            })
        }else{
            return res.json({
                berhasil:true,
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
                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length > 0){
                        var jam_masuk = moment().format("HH:mm");
                        var check1 = moment().format("DD/MM/YYYY HH:mm:ss");
                        var check2 = moment().format("DD/MM/YYYY 07:30:00");

                        var beginningTime = moment(jam_masuk, 'h:mm');
                        var endTime = moment('07:30', 'h:mm');
                        console.log(beginningTime.isAfter(endTime)); 

                        
                        body.tanggal = moment().format("YYYY-MM-DD");
                        body.jam_masuk = moment().format("HH:mm:ss");
                        body.jam_keluar = null;
                        body.jam_check1 = null;
                        body.jam_check2 = null;
                        body.shift = null;
                      

                        var duration = '';
                        var durationminutes = '';
                        if(beginningTime.isBefore(endTime)){

                            duration = moment.utc(moment(check2,"DD/MM/YYYY HH:mm:ss").diff(moment(check1,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                            minutes = Math.ceil(moment.duration(duration).asMinutes());
                            body.terlambat = minutes;
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
                                    berhasil:true,
                                    data:results,
                                    pesan:"Anda berhasil mengambil absen",
                                    tanggal:moment().format("YYYY-MM-DD"),
                                    jam:moment().format("HH:mm:ss"),
                                    duration:duration
                                })
                            });
                        }else{
                            duration = moment.utc(moment(check1,"DD/MM/YYYY HH:mm:ss").diff(moment(check2,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                            minutes = Math.ceil(moment.duration(duration).asMinutes());
                            if(minutes < 30){
                                body.terlambat = minutes;
                                body.status = 2;
                                storeAbsenMasuk(body,(err,results) => {
                                    if(err){
                                        console.log(err);
                                        return res.json({
                                            berhasil:false,
                                            pesan:"Koneksi database error",
                                            error:err
                                        });
                                    }
                                    return res.json({
                                        berhasil:true,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        data:results,
                                        duration:duration
                                    })
                                });
                              
                            }else if(minutes > 45){
                                body.terlambat = minutes;
                                body.status = 3;
                                storeAbsenMasuk(body,(err,results) => {
                                    if(err){
                                        return res.json({
                                            berhasil:false,
                                            pesan:"Koneksi database error",
                                            error:err
                                        });
                                    }
                                    return res.json({
                                        berhasil:true,
                                        data:results,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        duration:duration
                                    })
                                });
                            }
                        
                        }
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
                

            }else if(body.absen === 'pulang'){
                var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
            
                var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                var minutes = Math.ceil(moment.duration(duration).asMinutes());
              
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_keluar = moment().format("HH:mm:ss");
                body.total = duration;

                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length != 0){
                        storeAbsenPulang(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:false,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:true,
                                data:results,
                                tanggal:moment().format("YYYY-MM-DD"),
                                jam:moment().format("HH:mm:ss"),
                            })
                        });
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
               
            }
        }else if(body.tipe === 'Satpam'){
            if(body.absen === 'masuk'){
                if(body.shift === 1){
                    checkDevice(body,(err,results)=>{
                        if(err){
                            return res.json({
                                berhasil:false,
                                pesan:'Gangguan Jaringan',
                            })
                        }
                        if(results.length > 0){
                            var jam_masuk = moment().format("HH:mm");
                            var check1 = moment().format("DD/MM/YYYY HH:mm:ss");
                            var check2 = moment().format("DD/MM/YYYY 06:00:00");
    
                            var beginningTime = moment(jam_masuk, 'h:mm');
                            var endTime = moment('06:00', 'h:mm');
                            console.log(beginningTime.isAfter(endTime)); 
    
                            
                            body.tanggal = moment().format("YYYY-MM-DD");
                            body.jam_masuk = moment().format("HH:mm:ss");
                            body.jam_keluar = null;
                            body.jam_check1 = null;
                            body.jam_check2 = null;
                            body.shift = null;
                          
    
                            var duration = '';
                            var durationminutes = '';
                            if(beginningTime.isBefore(endTime)){
    
                                duration = moment.utc(moment(check2,"DD/MM/YYYY HH:mm:ss").diff(moment(check1,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                                minutes = Math.ceil(moment.duration(duration).asMinutes());
                                body.terlambat = minutes;
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
                                        berhasil:true,
                                        data:results,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        duration:duration
                                    })
                                });
                            }else{
                                duration = moment.utc(moment(check1,"DD/MM/YYYY HH:mm:ss").diff(moment(check2,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                                minutes = Math.ceil(moment.duration(duration).asMinutes());
                                if(minutes < 30){
                                    body.terlambat = minutes;
                                    body.status = 2;
                                    storeAbsenMasuk(body,(err,results) => {
                                        if(err){
                                            console.log(err);
                                            return res.json({
                                                berhasil:false,
                                                pesan:"Koneksi database error",
                                                error:err
                                            });
                                        }
                                        return res.json({
                                            berhasil:true,
                                            pesan:"Anda berhasil mengambil absen",
                                            tanggal:moment().format("YYYY-MM-DD"),
                                            jam:moment().format("HH:mm:ss"),
                                            data:results,
                                            duration:duration
                                        })
                                    });
                                  
                                }else if(minutes > 45){
                                    body.terlambat = minutes;
                                    body.status = 3;
                                    storeAbsenMasuk(body,(err,results) => {
                                        if(err){
                                            return res.json({
                                                berhasil:false,
                                                pesan:"Koneksi database error",
                                                error:err
                                            });
                                        }
                                        return res.json({
                                            berhasil:true,
                                            data:results,
                                            pesan:"Anda berhasil mengambil absen",
                                            tanggal:moment().format("YYYY-MM-DD"),
                                            jam:moment().format("HH:mm:ss"),
                                            duration:duration
                                        })
                                    });
                                }
                            
                            }
                        }else{
                            return res.json({
                                berhasil:false,
                                pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                            })
                        }
                    })
                }else if(body.shift === 2){
                    checkDevice(body,(err,results)=>{
                        if(err){
                            return res.json({
                                berhasil:false,
                                pesan:'Gangguan Jaringan',
                            })
                        }
                        if(results.length > 0){
                            var jam_masuk = moment().format("HH:mm");
                            var check1 = moment().format("DD/MM/YYYY HH:mm:ss");
                            var check2 = moment().format("DD/MM/YYYY 18:00:00");
    
                            var beginningTime = moment(jam_masuk, 'h:mm');
                            var endTime = moment('18:00', 'h:mm');
                            console.log(beginningTime.isAfter(endTime)); 
    
                            
                            body.tanggal = moment().format("YYYY-MM-DD");
                            body.jam_masuk = moment().format("HH:mm:ss");
                            body.jam_keluar = null;
                            body.jam_check1 = null;
                            body.jam_check2 = null;
                            body.shift = null;
                          
    
                            var duration = '';
                            var durationminutes = '';
                            if(beginningTime.isBefore(endTime)){
    
                                duration = moment.utc(moment(check2,"DD/MM/YYYY HH:mm:ss").diff(moment(check1,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                                minutes = Math.ceil(moment.duration(duration).asMinutes());
                                body.terlambat = minutes;
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
                                        berhasil:true,
                                        data:results,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        duration:duration
                                    })
                                });
                            }else{
                                duration = moment.utc(moment(check1,"DD/MM/YYYY HH:mm:ss").diff(moment(check2,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                                minutes = Math.ceil(moment.duration(duration).asMinutes());
                                if(minutes < 30){
                                    body.terlambat = minutes;
                                    body.status = 2;
                                    storeAbsenMasuk(body,(err,results) => {
                                        if(err){
                                            console.log(err);
                                            return res.json({
                                                berhasil:false,
                                                pesan:"Koneksi database error",
                                                error:err
                                            });
                                        }
                                        return res.json({
                                            berhasil:true,
                                            pesan:"Anda berhasil mengambil absen",
                                            tanggal:moment().format("YYYY-MM-DD"),
                                            jam:moment().format("HH:mm:ss"),
                                            data:results,
                                            duration:duration
                                        })
                                    });
                                  
                                }else if(minutes > 45){
                                    body.terlambat = minutes;
                                    body.status = 3;
                                    storeAbsenMasuk(body,(err,results) => {
                                        if(err){
                                            return res.json({
                                                berhasil:false,
                                                pesan:"Koneksi database error",
                                                error:err
                                            });
                                        }
                                        return res.json({
                                            berhasil:true,
                                            data:results,
                                            pesan:"Anda berhasil mengambil absen",
                                            tanggal:moment().format("YYYY-MM-DD"),
                                            jam:moment().format("HH:mm:ss"),
                                            duration:duration
                                        })
                                    });
                                }
                            
                            }
                        }else{
                            return res.json({
                                berhasil:false,
                                pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                            })
                        }
                    })
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
    
                    checkDevice(body,(err,results)=>{
                        if(err){
                            return res.json({
                                berhasil:false,
                                pesan:'Gangguan Jaringan',
                            })
                        }
                        if(results.length != 0){
                            storeAbsenPulang(body,(err,results) => {
                                if(err){
                                    return res.json({
                                        berhasil:false,
                                        pesan:"Koneksi database error",
                                        error:err
                                    });
                                }
                                return res.json({
                                    berhasil:true,
                                    data:results,
                                    tanggal:moment().format("YYYY-MM-DD"),
                                    jam:moment().format("HH:mm:ss"),
                                })
                            });
                        }else{
                            return res.json({
                                berhasil:false,
                                pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                            })
                        }
                    })
                }else if(body.shift === 2){
                    var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                    var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
                
                    var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    var minutes = Math.ceil(moment.duration(duration).asMinutes());
                  
                    body.tanggal = moment().format("YYYY-MM-DD");
                    body.jam_keluar = moment().format("HH:mm:ss");
                    body.total = duration;
    
                    checkDevice(body,(err,results)=>{
                        if(err){
                            return res.json({
                                berhasil:false,
                                pesan:'Gangguan Jaringan',
                            })
                        }
                        if(results.length != 0){
                            storeAbsenPulang(body,(err,results) => {
                                if(err){
                                    return res.json({
                                        berhasil:false,
                                        pesan:"Koneksi database error",
                                        error:err
                                    });
                                }
                                return res.json({
                                    berhasil:true,
                                    data:results,
                                    tanggal:moment().format("YYYY-MM-DD"),
                                    jam:moment().format("HH:mm:ss"),
                                })
                            });
                        }else{
                            return res.json({
                                berhasil:false,
                                pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                            })
                        }
                    })
                }
            }
        }else if(body.tipe === 'CS'){
            if(body.absen === 'masuk'){
                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length > 0){
                        var jam_masuk = moment().format("HH:mm");
                        var check1 = moment().format("DD/MM/YYYY HH:mm:ss");
                        var check2 = moment().format("DD/MM/YYYY 06:30:00");

                        var beginningTime = moment(jam_masuk, 'h:mm');
                        var endTime = moment('06:30', 'h:mm');
                        console.log(beginningTime.isAfter(endTime)); 

                        
                        body.tanggal = moment().format("YYYY-MM-DD");
                        body.jam_masuk = moment().format("HH:mm:ss");
                        body.jam_keluar = null;
                        body.jam_check1 = null;
                        body.jam_check2 = null;
                        body.shift = null;
                      

                        var duration = '';
                        var durationminutes = '';
                        if(beginningTime.isBefore(endTime)){

                            duration = moment.utc(moment(check2,"DD/MM/YYYY HH:mm:ss").diff(moment(check1,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                            minutes = Math.ceil(moment.duration(duration).asMinutes());
                            body.terlambat = minutes;
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
                                    berhasil:true,
                                    data:results,
                                    pesan:"Anda berhasil mengambil absen",
                                    tanggal:moment().format("YYYY-MM-DD"),
                                    jam:moment().format("HH:mm:ss"),
                                    duration:duration
                                })
                            });
                        }else{
                            duration = moment.utc(moment(check1,"DD/MM/YYYY HH:mm:ss").diff(moment(check2,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                            minutes = Math.ceil(moment.duration(duration).asMinutes());
                            if(minutes < 30){
                                body.terlambat = minutes;
                                body.status = 2;
                                storeAbsenMasuk(body,(err,results) => {
                                    if(err){
                                        console.log(err);
                                        return res.json({
                                            berhasil:false,
                                            pesan:"Koneksi database error",
                                            error:err
                                        });
                                    }
                                    return res.json({
                                        berhasil:true,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        data:results,
                                        duration:duration
                                    })
                                });
                              
                            }else if(minutes > 45){
                                body.terlambat = minutes;
                                body.status = 3;
                                storeAbsenMasuk(body,(err,results) => {
                                    if(err){
                                        return res.json({
                                            berhasil:false,
                                            pesan:"Koneksi database error",
                                            error:err
                                        });
                                    }
                                    return res.json({
                                        berhasil:true,
                                        data:results,
                                        pesan:"Anda berhasil mengambil absen",
                                        tanggal:moment().format("YYYY-MM-DD"),
                                        jam:moment().format("HH:mm:ss"),
                                        duration:duration
                                    })
                                });
                            }
                        
                        }
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
                

            }else if(body.absen === 'cek1'){
               
              
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_check = moment().format("HH:mm:ss");
             

                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length != 0){
                        storeAbsenCek1(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:false,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:true,
                                data:results,
                                tanggal:moment().format("YYYY-MM-DD"),
                                jam:moment().format("HH:mm:ss"),
                            })
                        });
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
            }else if(body.absen === 'cek2'){
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_check = moment().format("HH:mm:ss");
             

                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length != 0){
                        storeAbsenCek2(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:false,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:true,
                                data:results,
                                tanggal:moment().format("YYYY-MM-DD"),
                                jam:moment().format("HH:mm:ss"),
                            })
                        });
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
            }else if(body.absen === 'pulang'){
                var jam_keluar = moment().format("DD/MM/YYYY HH:mm:ss");
                var jam_check_keluar = moment().format("DD/MM/YYYY "+body.jam_masuk);
            
                var duration = moment.utc(moment(jam_keluar,"DD/MM/YYYY HH:mm:ss").diff(moment(jam_check_keluar,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                var minutes = Math.ceil(moment.duration(duration).asMinutes());
              
                body.tanggal = moment().format("YYYY-MM-DD");
                body.jam_keluar = moment().format("HH:mm:ss");
                body.total = duration;

                checkDevice(body,(err,results)=>{
                    if(err){
                        return res.json({
                            berhasil:false,
                            pesan:'Gangguan Jaringan',
                        })
                    }
                    if(results.length != 0){
                        storeAbsenPulang(body,(err,results) => {
                            if(err){
                                return res.json({
                                    berhasil:false,
                                    pesan:"Koneksi database error",
                                    error:err
                                });
                            }
                            return res.json({
                                berhasil:true,
                                data:results,
                                tanggal:moment().format("YYYY-MM-DD"),
                                jam:moment().format("HH:mm:ss"),
                            })
                        });
                    }else{
                        return res.json({
                            berhasil:false,
                            pesan:'Device anda tidak sesuai dengan device yang terdaftar',
                        })
                    }
                })
               
            }
        }


    }
   
}