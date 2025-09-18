import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Anggota from "./pages/anggota";
import Buku from "./pages/buku";
import Peminjaman from "./pages/peminjaman";
import Peminjamantahapbuku from "./pages/peminjamantahapbuku";
import Peminjamantahapanggota from "./pages/peminjamantahapanggota";
import RiwayatPengembalianBuku from "./pages/riwayatpengembalianbuku";

export default function App() { 
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/anggota" element={<Anggota/>} />
        <Route exact path="/buku" element={<Buku/>} />
        <Route exact path="/peminjaman" element={<Peminjaman/>} />
        <Route exact path="/peminjamantahapbuku" element={<Peminjamantahapbuku/>} />
        <Route exact path="/peminjamantahapanggota" element={<Peminjamantahapanggota/>} />
        <Route exact path="/riwayatpengembalianbuku" element={<RiwayatPengembalianBuku />} />
      </Routes>
    </Router>
  );
};