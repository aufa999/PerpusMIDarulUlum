import React from 'react';
import { MDBBtn, MDBIcon, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from '../layouts/navbar';
import Footer from '../layouts/footer';

export default function Home() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <header>
        
        <div
          className='p-5 text-center bg-image'
          style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", height: '400px' }}
        >
          <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className='d-flex justify-content-center align-items-center h-100'>
              <div className='text-white'>
                <h1 className='mb-3'>Manajemen Perpustakaan</h1>
                <h4 className='mb-3'>MI Darul Ulum Grogol</h4>
                <MDBRow>
                  <MDBCol size='md'>
                    <MDBBtn href='/anggota' tag="a" outline color='light' size="lg">
                      <MDBIcon fas icon="user-alt" size='5x' style={{ color: '#FFFFFF' }}/>
                      <br />
                      Anggota
                    </MDBBtn>
                  </MDBCol>
                  <MDBCol size='md'>
                    <MDBBtn href='/buku' tag="a" outline color='light' size="lg">
                      <MDBIcon fas icon="book" size='5x' style={{ color: '#FFFFFF' }}/>
                      <br />
                      Buku
                    </MDBBtn>
                  </MDBCol>
                  <MDBCol size='md'>
                    <MDBBtn href='/peminjaman' tag="a" outline color='light' size="lg">
                      <MDBIcon fas icon="business-time" size='5x' style={{ color: '#FFFFFF' }}/>
                      <br />
                      Peminjaman
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </div>
            </div>
          </div>
        </div>
      </header>
        <div>
          <Footer />
        </div>
    </div>
  );
}