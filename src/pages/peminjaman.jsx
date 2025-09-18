import React from "react";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import Tabelpeminjaman from "../layouts/tabelpeminjaman";
import { MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";

export default function Peminjaman() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <MDBContainer fluid>
        <header>
            <MDBRow className='mb-3'> 
            <div className='d-flex p-3 justify-content-sm-start align-items-start'>
                <MDBCol>
                    <div className='text-dark'>
                        <Tabelpeminjaman />
                    </div>
                </MDBCol>
            </div>
            </MDBRow>
        </header>
      </MDBContainer>
      <div>
        <Footer />
      </div>
    </div>
  );
}