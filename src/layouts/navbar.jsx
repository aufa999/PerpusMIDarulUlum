import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBIcon,
  MDBCollapse
} from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [openNavSecond, setOpenNavSecond] = useState(false);

  return (
    <MDBNavbar expand='lg' dark bgColor='dark'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/'><MDBIcon fas icon="book-reader" size='2x'/></MDBNavbarBrand>
        <MDBNavbarToggler
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenNavSecond(!openNavSecond)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/anggota"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Anggota
            </NavLink>
            <NavLink
              to="/buku"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Buku
            </NavLink>
            <NavLink
              to="/peminjaman"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Peminjaman
            </NavLink>
            <NavLink
              to="/riwayatpengembalianbuku"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Riwayat
            </NavLink>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}