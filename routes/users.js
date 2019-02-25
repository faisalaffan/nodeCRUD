const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;

app.get('/', (req, res) => {
	res.render('./index', {title: 'xir6'})
});

app.get('/tampil', function (req, res, next) {
	// mengambil data dari database secara descending
	req.db.collection('user').find().sort({"_id": -1}).toArray(function (err, result) {
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'Daftar Siswa',
				data: ''
			})
		} else {
			// menampilkan views list.ejs
			res.render('user/list', {
				title: 'Daftar Siswa',
				data: result
			})
		}
	})
});

app.get('/add', function (req, res, next) {
	// tampilkan views add.ejs
	res.render('user/add', {
		title: 'TAMBAH DATA',
		nama: '',
		jurusan: '',
		email: '',
		no: ''
	})
})

//proses input data
app.post('/add', function (req, res, next) {
	req.assert('nama', 'Nama is required').notEmpty()
	req.assert('jurusan', 'jurusan is required').notEmpty()
	req.assert('email', 'email is required').notEmpty()
	req.assert('no', 'no is required').notEmpty()

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
			nama: req.sanitize('nama').escape().trim(),
			jurusan: req.sanitize('jurusan').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			no: req.sanitize('no').escape().trim(),
		}
		req.db.collection('user').insert(user, function (err, result) {
			if (err) {
				req.flash('error', err)

				// render to views/user/addEventListener.ejs
				res.render('user/add', {
					title: 'TAMBAH DATA',
					nama: user.nama,
					jurusan: user.jurusan,
					email: user.email,
					no: user.no
				})
			} else {
				req.flash('Berhasil', 'Data berhasil ditambah!')

				// redirect to user list page
				res.redirect('/tampil')
			}
		})
	} else {
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		res.render('user/add', {
			title: "TAMBAH DATA",
			nama: req.body.nama,
			jurusan: req.body.jurusan,
			email: req.body.email,
			no: req.body.no,
		})
	}
})

app.get('/edit/:id', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('user').find({"_id":o_id}).toArray(function (err, result) {
		if (err) return console.log(err)

		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		} else {
			res.render('user/edit', {
				title: "EDIT DATA",
				id: result[0]._id,
				nama: result[0].nama,
				jurusan: result[0].jurusan,
				email: result[0].email,
				no: result[0].no,
			})
		}
	})
})

app.put('/edit/:id', function (req, res, next) {
	req.assert('nama', 'Nama is required').notEmpty()
	req.assert('jurusan', 'Jurusan is required').notEmpty()
	req.assert('email', 'Email is required').notEmpty()
	req.assert('no', 'No is required').notEmpty()

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
			nama: req.sanitize('nama').escape().trim(),
			jurusan: req.sanitize('jurusan').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			no: req.sanitize('no').escape().trim(),
		}

		var o_id = new ObjectId(req.params.id)
		req.db.collection('user').update({"id":o_id}, user, function (err, result) {
			if (err) {
				req.flash('error', err)

				res.render('user/edit', {
					title: 'EDIT DATA',
					id:req.params.id,
					nama:req.body.nama,
					jurusan:req.body.jurusan,
					email:req.body.email,
					no:req.body.no,
				})
			} else {
				req.flash('Berhasil', 'Data berhasil diupdate')
				res.redirect('/tampil')
			}
		})
	} else {
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		res.render('user/edit', {
			title: "EDIT DATA",
			id: req.params.id,
			nama: req.body.nama,
			jurusan: req.body.jurusan,
			email: req.body.email,
			no: req.body.no
		})
	}
})

app.delete('/delete/:id', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('user').remove({"_id": o_id}, function (err, result) {
		if (err) {
			req.flash('error', err)
			res.redirect('/users')
		} else {
			req.flash('Berhasil', 'Data berhasil dihapus')
			res.redirect('/tampil')
		}
	})
})

module.exports = app;