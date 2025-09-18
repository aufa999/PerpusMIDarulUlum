import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MDBBadge, MDBInput, MDBInputGroup, MDBBtn, MDBTable, MDBTableHead, MDBTableBody,
  MDBIcon, MDBCol, MDBRow, MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,
  MDBDropdownItem, MDBPagination, MDBPaginationItem, MDBPaginationLink
} from 'mdb-react-ui-kit';


axios.defaults.baseURL = 'http://localhost:8080/';

export default function Tabelpeminjamantahapanggota() {
  const [anggotaList, setAnggotaList] = useState([]);
  const [selectedAnggota, setSelectedAnggota] = useState([]);
  const [selectedBuku, setSelectedBuku] = useState([]);
  const [sortMode, setSortMode] = useState('none'); // 'none', 'asc', 'desc'
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [kelasList, setKelasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const anggotaPerPage = 30;

  // Ambil data anggota dari backend
  useEffect(() => {
    const fetchAnggota = async () => {
      const res = await axios.get('/anggota');
      if (res.data.success) {
        setAnggotaList(res.data.data);
        // Ambil kelas unik
        const kelasUnik = [
          ...new Set(res.data.data.map((anggota) => anggota.kelas).filter(Boolean))
        ];
        setKelasList(kelasUnik);
      }
    };
    fetchAnggota();

    // Ambil data buku terpilih dari localStorage
    const buku = JSON.parse(localStorage.getItem('selectedBuku')) || [];
    setSelectedBuku(buku);
  }, []);

  // Handler untuk multi-checkbox anggota
  const handleAnggotaCheckbox = (anggotaId) => {
    setSelectedAnggota((prev) =>
      prev.includes(anggotaId)
        ? prev.filter((id) => id !== anggotaId)
        : [...prev, anggotaId]
    );
  };

  // Handler submit peminjaman
  const handleSubmit = async () => {
    if (selectedAnggota.length === 0 || selectedBuku.length === 0) {
      alert('Pilih anggota dan buku terlebih dahulu!');
      return;
    }
    try {
      const res = await axios.post('/tambahpeminjaman', {
        anggotaId: selectedAnggota,
        bukuId: selectedBuku,
      });
      if (res.data.success) {
        alert('Peminjaman berhasil!');
        localStorage.removeItem('selectedBuku');
        window.location.href = '/peminjaman'; // redirect ke halaman utama atau riwayat
      }
    } catch (err) {
      alert('Gagal melakukan peminjaman!');
    }
  };

  // Handler sortir abjad
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

  // Sort dan filter anggota
  let sortedList = [...anggotaList];
  switch (sortMode) {
    case 'asc':
      sortedList.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
      break;
    case 'desc':
      sortedList.sort((a, b) => (b.nama || '').localeCompare(a.nama || ''));
      break;
    default:
      break;
  }
  const filteredList = sortedList
    .filter((anggota) => {
      const keyword = searchTerm.toLowerCase();
      return (
        anggota.nama?.toLowerCase().includes(keyword) ||
        anggota.notelp?.toLowerCase().includes(keyword) ||
        anggota.kelas?.toLowerCase().includes(keyword)
      );
    })
    .filter((anggota) => selectedKelas === 'Semua' || anggota.kelas === selectedKelas);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / anggotaPerPage);
  const paginatedAnggota = filteredList.slice(
    (currentPage - 1) * anggotaPerPage,
    currentPage * anggotaPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedKelas]);

  return (
    <MDBContainer fluid>
      <div>
        <MDBInputGroup>
          <MDBInput
            label='Search'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari anggota"
            />
          <MDBBtn rippleColor='dark' color='dark'>
            <MDBIcon icon='search'/>
          </MDBBtn>
        </MDBInputGroup>
        <div>
          <div className='d-flex p-3 justify-content-sm-end'>
            <MDBRow>
              <MDBCol>
                <MDBBtn color='success' rounded size='sm' onClick={handleSubmit} disabled={selectedAnggota.length === 0 || selectedBuku.length === 0}>
                  <MDBIcon fas icon="check-circle" size='1x'/>
                </MDBBtn>
              </MDBCol>
              <MDBCol>
                <MDBBtn href='/peminjamantahapbuku' color='dark' rounded size='sm'>
                  <MDBIcon fas icon="chevron-circle-left" size='1x'/>
                </MDBBtn>
              </MDBCol>
              <MDBCol>
                {/* Dropdown Sortir Anggota */}
                <MDBDropdown>
                  <MDBDropdownToggle color='dark' size='sm'>
                    <MDBIcon fas icon='filter' size='1x' />
                    <span style={{marginLeft: 8, fontSize: 12}}>Sortir</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu onClick={handleSort}>
                    <MDBDropdownItem link childTag='button' active={sortMode === 'asc'}>A-Z</MDBDropdownItem>
                    <MDBDropdownItem link childTag='button' active={sortMode === 'desc'}>Z-A</MDBDropdownItem>
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
          <MDBTable align='middle'>
            <MDBTableHead>
              <tr>
                <th scope='col'>No</th>
                <th scope='col'>Name</th>
                <th scope='col'>Kelas</th>
                <th scope='col'>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {paginatedAnggota.map((anggota, idx) => (
                <tr key={anggota._id}>
                  <td>{(currentPage - 1) * anggotaPerPage + idx + 1}</td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src={
                          anggota.foto
                            ? `http://localhost:8080${anggota.foto}`
                            : 'https://mdbootstrap.com/img/new/avatars/8.jpg'
                        }
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle'
                      />
                      <div className='ms-3'>
                        <p className='fw-bold mb-1'>{anggota.nama}</p>
                        <p className='text-muted mb-0'>{anggota.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className='fw-normal mb-1'>{anggota.kelas}</p>
                  </td>
                  <td>
                    <div>
                      <input
                        type="checkbox"
                        name="anggota"
                        checked={selectedAnggota.includes(anggota._id)}
                        onChange={() => handleAnggotaCheckbox(anggota._id)}
                      /> Pilih Anggota
                    </div>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
          {/* Pagination di bawah tabel */}
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
      </div>
    </MDBContainer>
  );
}