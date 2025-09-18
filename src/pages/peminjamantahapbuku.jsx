import React from "react";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import Cardpeminjamantahapbuku from "../layouts/cardpeminjamantahapbuku";
import { MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";

export default function Peminjamantahapbuku() {
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
                        <Cardpeminjamantahapbuku />
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