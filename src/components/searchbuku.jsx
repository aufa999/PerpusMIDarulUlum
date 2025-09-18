import React from 'react';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

export default function Searchbuku() {
  return (
    <MDBInputGroup>
      <MDBInput label='Search'/>
      <MDBBtn rippleColor='dark' color='dark'>
        <MDBIcon icon='search'/>
      </MDBBtn>
    </MDBInputGroup>
  );
}