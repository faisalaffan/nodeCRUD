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
		req.db.collection('coba').insert(user, function (err, result) {
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
	req.db.collection('coba')
})

module.exports = app;