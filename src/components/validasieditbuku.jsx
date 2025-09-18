import React, { useState } from 'react';
import {
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBInputGroup,
  MDBBtn,
  MDBCheckbox
} from 'mdb-react-ui-kit';

export default function Validasieditbuku() {
  const [formValue, setFormValue] = useState({
    judul: '',
    kelas: '',
    kategori: '',
    tahunterbit: '',
    cover: '',
  });

  const onChange = (e: any) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <MDBValidation className='row g-3'>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.judul}
          name='judul'
          onChange={onChange}
          id='judul'
          required
          label='Judul'
        />
      </MDBValidationItem>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.kelas}
          name='kelas'
          onChange={onChange}
          id='kelas'
          required
          label='Kelas'
        />
      </MDBValidationItem>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.kategori}
          name='kategori'
          onChange={onChange}
          id='kategori'
          required
          label='Kategori'
        />
      </MDBValidationItem>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.tahunterbit}
          name='tahunterbit'
          onChange={onChange}
          id='tahunterbit'
          type='number'
          required
          label='Tahun Terbit'
        />
      </MDBValidationItem>
      <MDBValidationItem
        value={formValue.cover}
        className='mt-3 mb-5'
        feedback='Example invalid form file feedback'
        invalid
      >
        <input type='file' className='form-control' aria-label='file example' required />
      </MDBValidationItem>
    </MDBValidation>
  );
}