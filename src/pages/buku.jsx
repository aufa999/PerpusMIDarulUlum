import React from "react";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import { MDBContainer } from "mdb-react-ui-kit";
import CardBuku from "../layouts/cardbuku";

export default function Buku() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <MDBContainer fluid>
        <div className="d-flex justify-content-center">
          <h1 className="mt-1"></h1>
        </div>
        <div className="d-flex justify-content-end">
          <CardBuku />
        </div>
      </MDBContainer>
      <div>
        <div className="d-flex justify-content-center">
          <h1 className="mt-3"></h1>
        </div>
        <Footer />
      </div>
    </div>
  );
}