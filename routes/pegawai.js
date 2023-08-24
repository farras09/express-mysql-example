var express = require('express');
var router=express.Router();

var connection=require('../library/database');

// GET
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM exp_pegawai ORDER BY peg_id DESC', function(err, rows){
    if(err){
      res.flash('error', err);
      res.render('pegawai', {
        data:''
      });
    } else {
      res.render('pegawai/index', {
        data:rows
      });
    }
  });
});

// CREATE
router.get('/create', function(req, res, next){
    res.render('pegawai/create', {
      name:''
    })
})

// STORE
router.post('/store', function(req, res, next) {
  let name= req.body.name;
  let errors = false;

  if(name.length===0) {
    errors=true;

    // set flash messages
    req.flash('error', 'Silahkan masukkan nama pegawai');

    res.render('pegawai/create', {
      name:name
    })
  }

  if(!errors) {
    let formData= {
      peg_nama: name
    }

    connection.query('INSERT INTO exp_pegawai SET ?', formData, function(err, result) {
      // throw error
      if (err){
        req.flash("error", err)

        // render to add.js
        res.render('pegawai/create', {
          name: formData.name
        })
      } else {
        req.flash('success', 'Data Berhasil Disimpan!');
        res.redirect('/pegawai');
      }
    })
  }
})
// EDIT

router.get('/edit/(:id)', function(req, res, next) {
  let id=req.params.id;
  connection.query('SELECT * FROM exp_pegawai WHERE peg_id = ' + id, function(err, rows, fields){
    // throw err
    if(err)throw err

    // if not found
    if(rows.length <= 0){
      req.flash('error', 'Data pegawai tidak ditemukan');
      res.redirect('/pegawai');
    }
    else {
      res.render(
        'pegawai/edit', {
          id:rows[0].peg_id,
          name: rows[0].peg_nama
        }
      )
    }
  })

})

// UPDATE
router.post('/update/:id', function(req, res, next) {
  let id=req.params.id;
  let name=req.body.name;
let errors=false;
  if(name.length===0){
    errors=true;

    // set flash messages
    req.flash('error', 'Silahkan masukkan nama pegawai');

    res.render('pegawai/edit', {
      id:req.params.id,
      name:name
    })
  }

  if(!errors){
  let formData= {
    peg_nama:name
  }
  connection.query('UPDATE exp_pegawai SET ? WHERE peg_id = '+id, formData, function(err, result) {
    if(err){
      req.flash('error', err)

      res.render('/pegawai/edit',{
        id : req.params.id,
        name: formData.name
      })
    } else {
      req.flash('success', 'Berhasil update');
      res.redirect(
        '/pegawai'
      )
    }

  })
}
})

// DELETE

router.get('/delete/(:id)', function(req, res, next) {
  let id=req.params.id;

  connection.query('DELETE FROM exp_pegawai WHERE peg_id = '+id, function(err, result){
    // throw error

    if(err){
      req.flash('error', err)
      res.redirect('/pegawai')
    } else {
      req.flash('succes', 'Berhasil hapus')
      res.redirect('/pegawai')
    }
  })
})
module.exports=router;
