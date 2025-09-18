import React, { useEffect, useState } from 'react';
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
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInputGroup,
  MDBInput,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function Cardpeminjamantahapbuku() {
  const [bukulist, setBukuList] = useState([]);
  const [selectedBuku, setSelectedBuku] = useState([]);
  const [sortMode, setSortMode] = useState('none'); // 'none', 'asc', 'desc'
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [kategoriList, setKategoriList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [kelasList, setKelasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 21;

  const getFetchData = async () => {
    const data = await axios.get('/buku');
    if (data.data.success) {
      setBukuList(data.data.data);
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

  // Sort dan filter
  let sortedList = [...bukulist];
  switch (sortMode) {
    case 'asc':
      sortedList.sort((a, b) => a.judul.localeCompare(b.judul));
      break;
    case 'desc':
      sortedList.sort((a, b) => b.judul.localeCompare(a.judul));
      break;
    default:
      break;
  }
  const filteredList = bukulist
    .filter((buku) => {
      const keyword = searchTerm.toLowerCase();
      return (
        buku.judul?.toLowerCase().includes(keyword) ||
        buku.kategori?.toLowerCase().includes(keyword) ||
        buku.kelas?.toLowerCase().includes(keyword) ||
        buku.pengarang?.toLowerCase().includes(keyword) ||
        buku.penerbit?.toLowerCase().includes(keyword) ||
        buku.isbn?.toLowerCase().includes(keyword)
      );
    })
    .filter((buku) => selectedKategori === 'Semua' || buku.kategori === selectedKategori)
    .filter((buku) => selectedKelas === 'Semua' || buku.kelas === selectedKelas);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / booksPerPage);
  const paginatedBooks = filteredList.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Handler sortir
  const handleSort = () => {
    let nextMode = '';
    switch (sortMode) {
      case 'none':
        nextMode = 'asc';
        break;
      case 'asc':
        nextMode = 'desc';
        break;
      case 'desc':
        nextMode = 'none';
        break;
      default:
        nextMode = 'none';
    }
    setSortMode(nextMode);
  };

  // Handler untuk checkbox
  const handleCheckboxChange = (bukuId) => {
    setSelectedBuku((prev) =>
      prev.includes(bukuId)
        ? prev.filter((id) => id !== bukuId)
        : [...prev, bukuId]
    );
  };

  // Handler untuk lanjut ke tahap anggota
  const handleNext = () => {
    // Simpan pilihan buku ke localStorage
    localStorage.setItem('selectedBuku', JSON.stringify(selectedBuku));
    // Redirect ke tahap anggota
    window.location.href = '/peminjamantahapanggota';
  };

  return (
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
            <MDBBtn onClick={handleNext} color='dark' rounded size='sm' disabled={selectedBuku.length === 0}>
              <MDBIcon fas icon="chevron-circle-right" size='1x' />
            </MDBBtn>
          </MDBCol>
          <MDBCol>
            {/* Dropdown Sortir */}
            <MDBDropdown>
              <MDBDropdownToggle color='dark' size='sm'>
                <MDBIcon fas icon='filter' size='1x' />
                <span style={{marginLeft: 8, fontSize: 12}}>Sortir</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu onClick={handleSort}>
                <MDBDropdownItem link childTag='button'>{sortMode === 'asc'}A-Z</MDBDropdownItem>
                <MDBDropdownItem link childTag='button'>{sortMode === 'desc'}Z-A</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBCol>
          <MDBCol>
            {/* Dropdown Kategori */}
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
            {/* Dropdown Kelas */}
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
      <div className='d-flex p-3 justify-content-sm-end'>
        <MDBRow className='row-cols-1 row-cols-md-3 g-4 w-100'>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((buku) => (
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
                    <div className='d-flex justify-content-sm-end'>
                      <input
                        type="checkbox"
                        checked={selectedBuku.includes(buku._id)}
                        onChange={() => handleCheckboxChange(buku._id)}
                        disabled={buku.stok < 1}
                      /> Pilih
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))
          ) : (
            <p>Loading...</p>
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
  );
}