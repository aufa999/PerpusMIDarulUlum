import React, { useState } from 'react';
import {
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBInputGroup,
  MDBBtn,
  MDBCheckbox
} from 'mdb-react-ui-kit';

export default function Validasieditanggota({ id, onSuccess }) {
  const [formValue, setFormValue] = useState({
    nama: '',
    notelp: '',
    kelas: '',
    ttl: '',
    foto: '',
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Function to handle edit (submit)
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // If you need to handle file upload, use FormData
      const formData = new FormData();
      formData.append('nama', formValue.nama);
      formData.append('notelp', formValue.notelp);
      formData.append('kelas', formValue.kelas);
      formData.append('ttl', formValue.ttl);
      if (formValue.foto) {
        formData.append('foto', formValue.foto);
      }

      await axios.put(`/editanggota/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (onSuccess) onSuccess();
      alert('Data berhasil diupdate!');
    } catch (error) {
      alert('Gagal mengupdate data!');
    }
  };

  return (
    <MDBValidation className='row g-3' onSubmit={handleEdit}>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.nama}
          name='nama'
          onChange={onChange}
          id='nama'
          required
          label='Nama'
        />
      </MDBValidationItem>
      <MDBValidationItem className='col-md-4'>
        <MDBInput
          value={formValue.notelp}
          name='notelp'
          onChange={onChange}
          id='typePhone'
          type='tel'
          required
          label='No. Telpon'
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
          value={formValue.ttl}
          name='ttl'
          onChange={onChange}
          id='ttl'
          required
          label='Ttl'
        />
      </MDBValidationItem>
      <MDBValidationItem
        className='mt-3 mb-5'
        feedback='Example invalid form file feedback'
        invalid
      >
        <input
          type='file'
          className='form-control'
          aria-label='file example'
          name='foto'
          onChange={e => setFormValue({ ...formValue, foto: e.target.files[0] })}
        />
      </MDBValidationItem>
      <MDBBtn type='submit' color='primary'>Edit</MDBBtn>
    </MDBValidation>
  );
}