const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 8080;

//Anggota schema
const schemaDataAnggota = mongoose.Schema({
    nama: String,
    notelp: String,
    kelas: String,
    ttl: String,
    foto: String,
},{
    timestamps: true,
});

const anggotaModel = mongoose.model('anggota', schemaDataAnggota);

//read anggota
//http://localhost:8080/anggota
app.get('/anggota',async(req, res) => {
    const data = await anggotaModel.find({});
    res.json({success : true , data : data});
})

// Konfigurasi penyimpanan file foto anggota
const storageAnggota = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nama unik
  }
});
const uploadAnggota = multer({ storage: storageAnggota });

// Endpoint tambah anggota dengan foto
app.post('/tambahanggota', uploadAnggota.single('foto'), async (req, res) => {
  try {
    const { nama, notelp, kelas, ttl } = req.body;
    const foto = req.file ? '/uploads/' + req.file.filename : null;
    const data = new anggotaModel({ nama, notelp, kelas, ttl, foto });
    await data.save();
    res.send({ success: true, message: 'Data berhasil disimpan!', data });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Gagal menyimpan data anggota!' });
  }
});

// edit anggota
//http://localhost:8080/editanggota
app.put('/editanggota', uploadAnggota.single('foto'), async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    let updateData = { ...rest };
    if (req.file) {
      updateData.foto = '/uploads/' + req.file.filename;
    }
    const data = await anggotaModel.updateOne({ _id }, updateData);
    res.send({ success: true, message: 'Data berhasil diubah!', data });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Gagal mengubah data anggota!' });
  }
});

//hapus anggota
//http://localhost:8080/hapusanggota/:id
app.delete('/hapusanggota/:id', async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await anggotaModel.deleteOne({_id : id});
    res.send({success: true, message : 'Data berhasil dihapus!', data : data});
})

/////////////////////////////////////////////////////////////////////

//Bukuschema
const schemaDataBuku = mongoose.Schema({
    judul: String,
    kelas: String,
    kategori: String,
    pengarang: String,
    penerbit: String,
    tahun: String,
    isbn: String,
    stok: {
        type: Number,
        default: 0
    },
    coverUrl: String // <--- tambahkan ini
},{
    timestamps: true,
});

const bukuModel = mongoose.model('buku', schemaDataBuku);

//read buku
//http://localhost:8080/buku
app.get('/buku',async(req, res) => {
    const data = await bukuModel.find({});
    res.json({success : true , data : data});
})

//tambah buku
//http://localhost:8080/tambahbuku
// Pastikan sudah install multer: npm install multer
// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nama unik
  }
});
const upload = multer({ storage: storage });

// Endpoint tambah buku
app.post('/tambahbuku', upload.single('cover'), async (req, res) => {
  try {
    const { judul, kelas, kategori, pengarang, penerbit, tahun, isbn, stok } = req.body;
    const coverUrl = req.file ? '/uploads/' + req.file.filename : null;
    const buku = new bukuModel({
      judul, kelas, kategori, pengarang, penerbit, tahun, isbn, stok,
      coverUrl
    });
    await buku.save();
    res.send({ success: true, message: 'Buku berhasil ditambah!' });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Gagal menambah buku!' });
  }
});

// edit buku dengan cover
app.put('/editbuku', upload.single('cover'), async (req, res) => {
    try {
        const { _id, ...rest } = req.body;
        let updateData = { ...rest };
        if (req.file) {
            updateData.coverUrl = '/uploads/' + req.file.filename;
        }
        const data = await bukuModel.updateOne({ _id: _id }, updateData);
        res.send({ success: true, message: 'Data berhasil diubah!', data: data });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Gagal mengubah data buku!' });
    }
});

// hapus buku
app.delete('/hapusbuku/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await bukuModel.deleteOne({ _id: id });
    res.send({ success: true, message: 'Data berhasil dihapus!', data: data });
});

///////////////////////////////////////////////////////////////
//Peminjaman schema
const schemaDataPeminjaman = mongoose.Schema({
    anggotaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anggota',
        required: true
    },
    bukuId: [
        {
            buku: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'buku',
                required: true
            },
            jumlah: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ],
    tanggalPinjam: {
        type: Date,
        default: Date.now
    },
    tanggalKembali: Date
},{
    timestamps: true,
});

const peminjamanModel = mongoose.model('peminjaman', schemaDataPeminjaman);
//read peminjaman
//http://localhost:8080/peminjaman
app.get('/peminjaman', async(req, res) => {
    const data = await peminjamanModel.find({})
        .populate('anggotaId', 'nama notelp kelas ttl foto') // tambahkan 'foto' di sini
        .populate('bukuId.buku', 'judul pengarang penerbit tahun isbn stok');
    res.json({success : true , data : data});
})
//tambah peminjaman
//http://localhost:8080/tambahpeminjaman
app.post('/tambahpeminjaman', async (req, res) => {
    try {
        const { anggotaId, bukuId } = req.body; // anggotaId: array, bukuId: array

        // Kurangi stok buku sesuai jumlah anggota
        for (const id of bukuId) {
            await bukuModel.updateOne(
                { _id: id },
                { $inc: { stok: -anggotaId.length } }
            );
        }

        // Simpan data peminjaman untuk setiap anggota
        for (const idAnggota of anggotaId) {
            const peminjaman = new peminjamanModel({
                anggotaId: idAnggota,
                bukuId: bukuId.map(bid => ({ buku: bid, jumlah: 1 })),
                tanggalPinjam: new Date()
            });
            await peminjaman.save();
        }

        res.send({ success: true, message: 'Peminjaman berhasil!' });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Gagal menyimpan data peminjaman!' });
    }
});
//edit peminjaman
//http://localhost:8080/editpeminjaman
// app.put('/editpeminjaman', async(req, res) => {
//     console.log(req.body);
//     const { _id, anggotaId, bukuId, jumlah } = req.body;

//     // Find the existing peminjaman record
//     const existingPeminjaman = await peminjamanModel.findById(_id);
//     if (!existingPeminjaman) {
//         return res.status(404).send({ success: false, message: 'Peminjaman tidak ditemukan.' });
//     }

//     // Update anggotaId
//     existingPeminjaman.anggotaId = anggotaId;

//     // Update bukuId and jumlah
//     existingPeminjaman.bukuId = bukuId.map((buku, idx) => ({
//         buku,
//         jumlah: Array.isArray(jumlah) ? (jumlah[idx] || 1) : (jumlah || 1)
//     }));

//     await existingPeminjaman.save();
//     res.send({ success: true, message: 'Data berhasil diubah!', data: existingPeminjaman });
// });
//hapus peminjaman & pindahkan ke pengembalian
app.delete('/hapuspeminjaman/:id', async(req, res) => {
    const { id } = req.params;

    // Find the existing peminjaman recordzz
    const existingPeminjaman = await peminjamanModel.findById(id);
    if (!existingPeminjaman) {
        return res.status(404).send({ success: false, message: 'Peminjaman tidak ditemukan.' });
    }

    // Restore stock for each book
    for (const item of existingPeminjaman.bukuId) {
        await bukuModel.updateOne(
            { _id: item.buku },
            { $inc: { stok: item.jumlah } }
        );
    }

    // Simpan ke koleksi pengembalian
    const pengembalian = new pengembalianModel({
      anggotaId: existingPeminjaman.anggotaId,
      bukuId: existingPeminjaman.bukuId,
      tanggalPinjam: existingPeminjaman.tanggalPinjam, // <-- pastikan ini ikut
      tanggalKembali: new Date()
    });
    await pengembalian.save();

    // Hapus dari koleksi peminjaman
    await peminjamanModel.deleteOne({ _id: id });

    res.send({ success: true, message: 'Pengembalian berhasil dan dicatat di riwayat!', data: pengembalian });
});

//Pengembalian schema
const schemaDataPengembalian = mongoose.Schema({
    anggotaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anggota',
        required: true
    },
    bukuId: [
        {
            buku: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'buku',
                required: true
            },
            jumlah: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ],
    tanggalPinjam: { // <--- tambahkan ini
        type: Date
    },
    tanggalKembali: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true,
});
const pengembalianModel = mongoose.model('pengembalian', schemaDataPengembalian);
//read pengembalian
//http://localhost:8080/pengembalian
app.get('/pengembalian', async (req, res) => {
    const data = await pengembalianModel.find({})
        .populate('anggotaId', 'nama notelp kelas ttl foto') // tambahkan 'foto' di sini
        .populate('bukuId.buku', 'judul pengarang penerbit tahun isbn');
    res.json({ success: true, data });
});
//konfirmasi pengembalian
//http://localhost:8080/konfirmasipengembalian
// app.post('/konfirmasipengembalian', async (req, res) => {
//     const { id } = req.body;

//     // Find the existing pengembalian record
//     const existingPengembalian = await pengembalianModel.findById(id);
//     if (!existingPengembalian) {
//         return res.status(404).send({ success: false, message: 'Pengembalian tidak ditemukan.' });
//     }

//     // Tambahkan stok buku sesuai jumlah yang dikembalikan
//     for (const item of existingPengembalian.bukuId) {
//         await bukuModel.updateOne(
//             { _id: item.buku },
//             { $inc: { stok: item.jumlah } }
//         );
//     }

//     // Update the status of the pengembalian (optional, jika ada field status)
//     // existingPengembalian.status = 'Dikembalikan';
//     // await existingPengembalian.save();

//     res.send({ success: true, message: 'Pengembalian berhasil dikonfirmasi dan stok buku diperbarui!', data: existingPengembalian });
// });
//hapus pengembalian
//http://localhost:8080/hapuspengembalian/:id
app.delete('/hapuspengembalian/:id', async (req, res) => {
    const { id } = req.params;

    // Find the existing pengembalian record
    const existingPengembalian = await pengembalianModel.findById(id);
    if (!existingPengembalian) {
        return res.status(404).send({ success: false, message: 'Pengembalian tidak ditemukan.' });
    }

    await pengembalianModel.deleteOne({ _id: id });
    res.send({ success: true, message: 'Data berhasil dihapus!' });
});


// Connect to MongoDB and start the server
mongoose.connect('mongodb://127.0.0.1:27017/perpustakaan')
.then(() => {
    console.log('Connected to the database!')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})

.catch((err) => console.log(err));