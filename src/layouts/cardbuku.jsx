import React, { useEffect,useState } from 'react';
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBValidation,
  MDBValidationItem,
  MDBInput, 
  MDBDropdown, 
  MDBDropdownMenu, 
  MDBDropdownToggle, 
  MDBDropdownItem,
  MDBInputGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';
import Modaltambahbuku from '../components/modaltambahbuku';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function Cardbuku() {
  const [bukulist, setBukuList] = useState([]);
  const [sortMode, setSortMode] = useState('none');
  const [staticModal, setStaticModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [kategoriList, setKategoriList] = useState([]);
  const [formEdit, setFormEdit] = useState({
    judul: '',
    kelas: '',
    kategori: '',
    pengarang: '',
    penerbit: '',
    tahun: '',
    isbn: '',
    stok: 0
  });
  const [editId, setEditId] = useState(null);
  const [editCover, setEditCover] = useState(null);
  // Tambahkan state untuk kelas
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [kelasList, setKelasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 21;

  const toggleOpen = () => setStaticModal(!staticModal);

  const handleEditOpen = (buku) => {
        setFormEdit({
          judul: buku.judul,
          kelas: buku.kelas,
          kategori: buku.kategori,
          pengarang: buku.pengarang,
          penerbit: buku.penerbit,
          tahun: buku.tahun,
          isbn: buku.isbn,
          stok: buku.stok
        });
        setEditId(buku._id);
        setStaticModal(true);
      };
  const handleEdit = async (e) => {
          e.preventDefault();
          try {
            const formData = new FormData();
            formData.append('_id', editId);
            Object.keys(formEdit).forEach(key => {
              formData.append(key, formEdit[key]);
            });
            if (editCover) {
              formData.append('cover', editCover);
            }
            const data = await axios.put('/editbuku', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.data.success) {
              getFetchData();
              setStaticModal(false);
              alert(data.data.message);
            }
          } catch (error) {
              alert('Gagal mengupdate data!');
          }
      };
  
  const handleEditOnChange = (e) => {
      const { value, name } = e.target;
      setFormEdit((prev) => ({
          ...prev,
          [name]: value,
      }));
  };

  const handleEditCoverChange = (e) => {
    setEditCover(e.target.files[0]);
  };

  const handleSort = () => {
    let sorted = [...bukulist];
    let nextMode = '';
    switch (sortMode) {
      case 'none':
        sorted.sort((a, b) => a.judul.localeCompare(b.judul));
        nextMode = 'asc';
        break;
      case 'asc':
        sorted.sort((a, b) => b.judul.localeCompare(a.judul));
        nextMode = 'desc';
        break;
      case 'desc':
        // Kembali ke urutan awal (tanpa sort)
        getFetchData();
        nextMode = 'none';
        return setSortMode(nextMode);
      default:
        nextMode = 'none';
    }
    setBukuList(sorted);
    setSortMode(nextMode);
  };

  const getFetchData = async () => {
    const data = await axios.get('/buku');
    if (data.data.success) {
      setBukuList(data.data.data);
      setSortMode('none');
      // Ambil kategori unik
      const kategoriUnik = [
        ...new Set(data.data.data.map((buku) => buku.kategori).filter(Boolean))
      ];
      setKategoriList(kategoriUnik);
      // Ambil kelas unik
      const kelasUnik = [
        ...new Set(data.data.data.map((buku) => buku.kelas).filter(Boolean))
      ];
      setKelasList(kelasUnik);
    }
  };
  useEffect(() => {
    getFetchData();
  }, []);

  // Filter buku berdasarkan kategori & kelas
  const filteredList = bukulist.filter((buku) => {
    const keyword = searchTerm.toLowerCase();
    const match =
      buku.judul?.toLowerCase().includes(keyword) ||
      buku.kategori?.toLowerCase().includes(keyword) ||
      buku.kelas?.toLowerCase().includes(keyword) ||
      buku.pengarang?.toLowerCase().includes(keyword) ||
      buku.penerbit?.toLowerCase().includes(keyword) ||
      buku.isbn?.toLowerCase().includes(keyword);

    const kategoriMatch = selectedKategori === 'Semua' || buku.kategori === selectedKategori;
    const kelasMatch = selectedKelas === 'Semua' || buku.kelas === selectedKelas;
    return match && kategoriMatch && kelasMatch;
  });

  const deleteBuku = async (id) => {
        var result = window.confirm("Anda yakin?");
        if (result) {
            await axios.delete('/hapusbuku/' + id)
                .then(response => {
                    getFetchData();
                })
                .catch(error => {
                    console.log(error)
                });
        }
    };

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredList.length / booksPerPage);

  // Ambil data buku untuk halaman aktif
  const paginatedBooks = filteredList.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Handler ganti halaman
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <MDBContainer fluid>
      <div>
        <MDBInputGroup>
          <MDBInput
            label='Search'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari buku"
          />
          <MDBBtn rippleColor='dark' color='dark'>
            <MDBIcon icon='search'/>
          </MDBBtn>
        </MDBInputGroup>
        <div className='d-flex p-3 justify-content-sm-end'>
          <MDBRow>
            <MDBCol>
              <Modaltambahbuku />
            </MDBCol>
            <MDBCol>
              {/* Dropdown Sortir */}
              {/* <MDBDropdown>
                <MDBDropdownToggle color='dark' size='sm'>
                  <MDBIcon fas icon='filter' size='1x' />
                  <span style={{marginLeft: 8, fontSize: 12}}>Sortir</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu onClick={handleSort}>
                  <MDBDropdownItem link childTag='button'>{sortMode === 'none'}Default</MDBDropdownItem>
                  <MDBDropdownItem link childTag='button'>{sortMode === 'asc'}A-Z</MDBDropdownItem>
                  <MDBDropdownItem link childTag='button'>{sortMode === 'desc'}Z-A</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown> */}
              <MDBBtn color='dark' rounded size='sm' onClick={handleSort}>{sortMode === 'asc'}
                <MDBIcon fas icon='sort-alpha-up' size='1x' />
              </MDBBtn>
            </MDBCol>
            <MDBCol>
              {/* Dropdown Sortir */}
              <MDBDropdown>
                <MDBDropdownToggle color='dark' size='sm'>
                  <MDBIcon fas icon='filter' size='1x' />
                  <span style={{marginLeft: 8, fontSize: 12}}>Kategori</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link childTag='button' onClick={() => setSelectedKategori('Semua')}>Semua Kategori</MDBDropdownItem>
                  {kategoriList.map((kategori, idx) => (
                    <MDBDropdownItem link childTag='button' key={idx} onClick={() => setSelectedKategori(kategori)}>{kategori}</MDBDropdownItem>
                  ))}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
            <MDBCol>
              {/* Dropdown Sortir */}
              <MDBDropdown>
                <MDBDropdownToggle color='dark' size='sm'>
                  <MDBIcon fas icon='filter' size='1x' />
                  <span style={{marginLeft: 8, fontSize: 12}}>Kelas</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link childTag='button' onClick={() => setSelectedKelas('Semua')}>Semua Kelas</MDBDropdownItem>
                  {kelasList.map((kelas, idx) => (
                    <MDBDropdownItem link childTag='button' key={idx} onClick={() => setSelectedKelas(kelas)}>{kelas}</MDBDropdownItem>
                  ))}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
          </MDBRow>
        </div>
        <div className='d-flex p-3'>
          <MDBRow className='row-cols-1 row-cols-md-3 g-4 w-100'>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((buku, idx) => (
                <MDBCol
                  key={buku._id}
                  className={filteredList.length === 1 ? "d-flex justify-content-center" : ""}
                  style={filteredList.length === 1 ? { minWidth: "350px", maxWidth: "600px" } : {}}
                >
                  <MDBCard style={filteredList.length === 1 ? { width: "100%" } : {}}>
                    <MDBBtn color='dark' inline size='sm'>
                      <MDBCardImage
                        src={buku.coverUrl ? `http://localhost:8080${buku.coverUrl}` : 'https://mdbootstrap.com/img/new/standard/city/041.webp'}
                        alt={buku.judul}
                        position='top'
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                    </MDBBtn>
                    <MDBCardBody>
                      <MDBCardTitle>{buku.judul}</MDBCardTitle>
                      <MDBCardText>Kelas {buku.kelas}</MDBCardText>
                      <MDBCardText>Kategori: {buku.kategori}</MDBCardText>
                      <MDBCardText>Jumlah stok: {buku.stok}</MDBCardText>
                      <td className='d-flex justify-content-sm-end'>
                        {/* Untuk Edit Anggota */}
                        <MDBBtn color='secondary' rounded size='sm' onClick={() => handleEditOpen(buku)}>
                          <MDBIcon fas icon='edit' size='2x' />
                        </MDBBtn>
                        <MDBBtn color='danger' rounded size='sm' onClick={() => deleteBuku(buku._id)}>
                          <MDBIcon fas icon='trash' size='2x' />
                        </MDBBtn>
                      </td>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))
            ) : (
              <p>No books available</p>
            )}
          </MDBRow>
        </div>

        {/* Pagination di bawah card */}
        <nav aria-label='Page navigation example' className='d-flex justify-content-center mt-3'>
          <MDBPagination className='mb-0'>
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink href='#' tabIndex={-1} aria-disabled={currentPage === 1}
                onClick={e => { e.preventDefault(); handlePageChange(currentPage - 1); }}>
                Previous
              </MDBPaginationLink>
            </MDBPaginationItem>
            {[...Array(totalPages)].map((_, idx) => (
              <MDBPaginationItem active={currentPage === idx + 1} key={idx}>
                <MDBPaginationLink href='#' onClick={e => { e.preventDefault(); handlePageChange(idx + 1); }}>
                  {idx + 1}
                </MDBPaginationLink>
              </MDBPaginationItem>
            ))}
            <MDBPaginationItem disabled={currentPage === totalPages || totalPages === 0}>
              <MDBPaginationLink href='#' aria-disabled={currentPage === totalPages}
                onClick={e => { e.preventDefault(); handlePageChange(currentPage + 1); }}>
                Next
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </nav>
      </div>
      {/* Modal Edit */}
      <MDBModal staticBackdrop tabIndex='-1' open={staticModal} onClose={toggleOpen}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Buku</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBValidation className='row g-3' onSubmit={handleEdit}>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.judul}
                      name='judul'
                      onChange={handleEditOnChange}
                      id='nama'
                      required
                      label='Nama'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.kelas}
                      name='kelas'
                      onChange={handleEditOnChange}
                      id='kelas'
                      required
                      label='Kelas'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.kategori}
                      name='kategori'
                      onChange={handleEditOnChange}
                      id='kategori'
                      required
                      label='Kategori'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.pengarang}
                      name='pengarang'
                      onChange={handleEditOnChange}
                      id='pengarang'
                      required
                      label='Pengarang'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.penerbit}
                      name='penerbit'
                      onChange={handleEditOnChange}
                      id='penerbit'
                      required
                      label='Penerbit'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.tahun}
                      name='tahun'
                      onChange={handleEditOnChange}
                      id='tahun'
                      required
                      label='Tahun Terbit'
                      type='number'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.isbn}
                      name='isbn'
                      onChange={handleEditOnChange}
                      id='isbn'
                      required
                      label='ISBN'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <MDBInput
                      value={formEdit.stok}
                      name='stok'
                      onChange={handleEditOnChange}
                      id='stok'
                      required
                      label='Stok'
                      type='number'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-4'>
                    <label htmlFor="editCover" className="form-label">Edit Cover Buku</label>
                    <input
                      type="file"
                      className="form-control"
                      id="editCover"
                      name="cover"
                      accept="image/*"
                      onChange={handleEditCoverChange}
                    />
                    {formEdit.coverUrl && (
                      <img
                        src={`http://localhost:8080${formEdit.coverUrl}`}
                        alt="cover"
                        style={{ width: 80, marginTop: 8, borderRadius: 4 }}
                      />
                    )}
                  </MDBValidationItem>
                  <MDBBtn type='submit' color='primary'>Edit</MDBBtn>
                </MDBValidation>
              </MDBModalBody>
                </MDBModalContent>
              </MDBModalDialog>
      </MDBModal>
      </MDBContainer>
  );
}