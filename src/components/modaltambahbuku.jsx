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

export default function Modaltambahbuku() {
  const [staticModal, setStaticModal] = useState(false);
  const toggleOpen = () => setStaticModal(!staticModal);

  // const [nama, setNama] = useState('');
  // const [notelp, setNotelp] = useState('');
  // const [kelas, setKelas] = useState('');
  // const [ttl, setTtl] = useState('');

  // const handleTambah = async(e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('nama', nama);
  //   formData.append('notelp', notelp);
  //   formData.append('kelas', kelas);
  //   formData.append('ttl', ttl);
  //   try {
  //     await axios.post('http://localhost:8080/tambahbuku', formData);
  //     window.location.reload();
  //     // console.log(data);
  //     // if(data.data.success){
  //     //   setStaticModal(false);
  //     //   alert(data.data.message);
  //     //   window.location.reload();
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const [formValue, setFormValue] = useState({
    judul: '',
    kelas: '',
    kategori: '',
    pengarang: '',
    penerbit: '',
    tahun: '',
    isbn: '',
    stok: 0
  });
  const [cover, setCover] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormValue((preve)=>{
      return{
      ...preve,
      [name]: value,
      }
    });
  };

  const handleTambah = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(formValue).forEach((key) => {
      formData.append(key, formValue[key]);
    });
    if (cover) {
      formData.append('cover', cover);
    }
    try {
      const data = await axios.post('/tambahbuku', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if(data.data.success){
        setStaticModal(false);
        alert(data.data.message);
        window.location.reload();
      }
    } catch (error) {
      alert('Gagal menambah buku!');
    }
  }

  return (
    <>
      <MDBBtn color='secondary' rounded size='sm' onClick={toggleOpen}>
        <MDBIcon fas icon='plus' size='1x'/>
      </MDBBtn>

      <MDBModal staticBackdrop tabIndex='-1' open={staticModal} onClose={() => setStaticModal(false)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Tambah buku</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={()=>setStaticModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBValidation onSubmit={handleTambah} className='row g-3'>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.judul}
                    onChange={handleOnChange}
                    // value={nama}
                    // onChange={(e)=>setNama(e.target.value)}
                    name='judul'
                    id='judul'
                    required
                    label='Judul'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.kelas}
                    onChange={handleOnChange}
                    // value={notelp}
                    // onChange={(e)=>setNotelp(e.target.value)}
                    name='kelas'
                    id='kelas'
                    type='number'
                    required
                    label='Kelas'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.kategori}
                    onChange={handleOnChange}
                    // value={kelas}
                    // onChange={(e)=>setKelas(e.target.value)}
                    name='kategori'
                    id='kategori'
                    required
                    label='Kategori'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.pengarang}
                    onChange={handleOnChange}
                    // value={ttl}
                    // onChange={(e)=>setTtl(e.target.value)}
                    name='pengarang'
                    id='pengarang'
                    required
                    label='Pengarang'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.penerbit}
                    onChange={handleOnChange}
                    // value={ttl}
                    // onChange={(e)=>setTtl(e.target.value)}
                    name='penerbit'
                    id='penerbit'
                    required
                    label='Penerbit'
                    type='text'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.tahun}
                    onChange={handleOnChange}
                    // value={ttl}
                    // onChange={(e)=>setTtl(e.target.value)}
                    name='tahun'
                    id='tahun'
                    required
                    label='Tahun'
                    type='number'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.isbn}
                    onChange={handleOnChange}
                    // value={ttl}
                    // onChange={(e)=>setTtl(e.target.value)}
                    name='isbn'
                    id='isbn'
                    required
                    label='ISBN'
                    type='number'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <MDBInput
                    value={formValue.stok}
                    onChange={handleOnChange}
                    name='stok'
                    id='stok'
                    required
                    label='Stok'
                    type='number'
                  />
                </MDBValidationItem>
                <MDBValidationItem className='col-md-4'>
                  <label htmlFor="cover" className="form-label">Cover Buku</label>
                  <input
                    type="file"
                    className="form-control"
                    id="cover"
                    name="cover"
                    accept="image/*"
                    onChange={e => setCover(e.target.files[0])}
                  />
                </MDBValidationItem>
                {/* <MDBValidationItem
                  // value={formValue.foto}
                  // onChange={handleOnChange}
                  value=''
                  name='foto'
                  id='foto'
                  className='mt-3 mb-5'
                  feedback='Example invalid form file feedback'
                  invalid
                >
                  <input type='file' className='form-control' aria-label='file example' required />
                </MDBValidationItem> */}
                {/* <MDBCol size="12">
                  <MDBBtn onClick={toggleOpen} type='submit'>Submit form</MDBBtn>
                </MDBCol> */}
                <MDBModalFooter>
                  <MDBBtn onClick={toggleOpen} color='primary'>Tambah</MDBBtn>
                </MDBModalFooter>
              </MDBValidation>
            </MDBModalBody>
            
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}