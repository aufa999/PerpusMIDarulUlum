import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBCol
} from 'mdb-react-ui-kit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function Modaltambahanggota() {
  const [staticModal, setStaticModal] = useState(false);
  const toggleOpen = () => setStaticModal(!staticModal);

  const [formValue, setFormValue] = useState({
    nama: '',
    notelp: '',
    kelas: '',
    ttl: '',
    foto: null,
    fotoPreview: ''
  });

  // Handler input text
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler input file foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFormValue((prev) => ({
      ...prev,
      foto: file,
      fotoPreview: file ? URL.createObjectURL(file) : ''
    }));
  };

  // Handler submit
  const handleTambah = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nama', formValue.nama);
      formData.append('notelp', formValue.notelp);
      formData.append('kelas', formValue.kelas);
      formData.append('ttl', formValue.ttl);
      if (formValue.foto) {
        formData.append('foto', formValue.foto);
      }
      const data = await axios.post('/tambahanggota', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.data.success) {
        setStaticModal(false);
        alert(data.data.message);
        window.location.reload();
      }
    } catch (error) {
      alert('Gagal menambah anggota!');
    }
  };

  return (
    <>
      <MDBBtn color='secondary' rounded size='sm' onClick={toggleOpen}>
        <MDBIcon fas icon='plus' size='1x'/>
      </MDBBtn>

      <MDBModal staticBackdrop tabIndex='-1' open={staticModal} onClose={() => setStaticModal(false)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Tambah Anggota</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={()=>setStaticModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBValidation onSubmit={handleTambah} className='row g-3'>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.nama}
                    onChange={handleOnChange}
                    name='nama'
                    id='nama'
                    required
                    label='Nama'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.notelp}
                    onChange={handleOnChange}
                    name='notelp'
                    id='typePhone'
                    type='number'
                    required
                    label='No. Telpon'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.kelas}
                    onChange={handleOnChange}
                    name='kelas'
                    id='kelas'
                    required
                    label='Kelas'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.ttl}
                    onChange={handleOnChange}
                    name='ttl'
                    id='ttl'
                    required
                    label='Tanggal Lahir'
                    type='date'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <label htmlFor="foto" className="form-label">Foto Anggota</label>
                  <input
                    type="file"
                    className="form-control"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    onChange={handleFotoChange}
                  />
                  {formValue.fotoPreview && (
                    <img
                      src={formValue.fotoPreview}
                      alt="preview"
                      style={{ width: 80, marginTop: 8, borderRadius: 4 }}
                    />
                  )}
                </MDBValidationItem>
                <MDBModalFooter>
                  <MDBBtn type='submit' color='primary'>Tambah</MDBBtn>
                </MDBModalFooter>
              </MDBValidation>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}