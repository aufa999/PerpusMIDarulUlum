import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBInput, MDBInputGroup, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon, MDBCol, MDBRow, MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import Searchpeminjaman from '../components/searchpeminjaman';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function Tabelpeminjaman() {
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [sortMode, setSortMode] = useState('none'); // 'none', 'asc', 'desc'
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [kelasList, setKelasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 30;

  const fetchPeminjaman = async () => {
    try {
      const res = await axios.get('/peminjaman');
      if (res.data.success) {
        setPeminjamanList(res.data.data);
        // Ambil kelas unik dari anggotaId
        const kelasUnik = [
          ...new Set(res.data.data.map((item) => item.anggotaId?.kelas).filter(Boolean))
        ];
        setKelasList(kelasUnik);
      }
    } catch (err) {
      setPeminjamanList([]);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  // Sort dan filter
  let sortedList = [...peminjamanList];
  switch (sortMode) {
    case 'asc':
      sortedList.sort((a, b) => (a.anggotaId?.nama || '').localeCompare(b.anggotaId?.nama || ''));
      break;
    case 'desc':
      sortedList.sort((a, b) => (b.anggotaId?.nama || '').localeCompare(a.anggotaId?.nama || ''));
      break;
    default:
      break;
  }
  const filteredList = sortedList.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    const anggota = item.anggotaId || {};
    const match =
      anggota.nama?.toLowerCase().includes(keyword) ||
      anggota.notelp?.toLowerCase().includes(keyword) ||
      anggota.kelas?.toLowerCase().includes(keyword);

    const kelasMatch = selectedKelas === 'Semua' ? true : anggota.kelas === selectedKelas;
    return match && kelasMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / dataPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedKelas]);

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

  // Fungsi hapus peminjaman
  // const handleDelete = async (id) => {
  //   if (window.confirm('Yakin ingin menghapus data peminjaman ini?')) {
  //     try {
  //       const res = await axios.delete(`/hapuspeminjaman/${id}`);
  //       if (res.data.success) {
  //         fetchPeminjaman();
  //         alert('Data peminjaman berhasil dihapus!');
  //       }
  //     } catch (err) {
  //       alert('Gagal menghapus data peminjaman!');
  //     }
  //   }
  // };

  // Fungsi konfirmasi pengembalian
  const handleReturn = async (id) => {
    if (window.confirm('Konfirmasi pengembalian buku untuk peminjaman ini?')) {
      try {
        const res = await axios.delete(`/hapuspeminjaman/${id}`);
        if (res.data.success) {
          fetchPeminjaman();
          alert('Pengembalian berhasil dikonfirmasi!');
        }
      } catch (err) {
        alert('Gagal konfirmasi pengembalian!');
      }
    }
  };

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
                <MDBBtn href='/peminjamantahapbuku' color='secondary' rounded size='sm'>
                  <MDBIcon fas icon="plus" size='1x'/>
                </MDBBtn>
              </MDBCol>
              <MDBCol>
                <MDBBtn href='/riwayatpengembalianbuku' color='info' rounded size='sm'>
                  <MDBIcon fas icon="history" size='1x'/>
                </MDBBtn>
              </MDBCol>
              <MDBCol>
                {/* Dropdown Sortir Abjad Anggota */}
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
                <th scope='col'>Nama Peminjam</th>
                <th scope='col'>Kelas</th>
                <th scope='col'>Buku Dipinjam</th>
                <th scope='col'>Tanggal Pinjam</th>
                <th scope='col'>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {paginatedList.length > 0 ? (
                paginatedList.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * dataPerPage + idx + 1}</td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <img
                          src={
                            item.anggotaId?.foto
                              ? `http://localhost:8080${item.anggotaId.foto}`
                              : 'https://mdbootstrap.com/img/new/avatars/8.jpg'
                          }
                          alt=''
                          style={{ width: '45px', height: '45px' }}
                          className='rounded-circle'
                        />
                        <div className='ms-3'>
                          <p className='fw-bold mb-1'>{item.anggotaId?.nama}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className='fw-normal mb-1'>{item.anggotaId?.kelas}</p>
                    </td>
                    <td>
                      <ul>
                        {item.bukuId.map((b, idx) => (
                          <li key={idx}>{b.buku?.judul} ({b.jumlah || 1}x)</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {new Date(item.tanggalPinjam).toLocaleDateString()}
                    </td>
                    <td>
                      <MDBBtn
                        color='success'
                        rounded
                        size='sm'
                        title="Konfirmasi Pengembalian"
                        onClick={() => handleReturn(item._id)}
                      >
                        <MDBIcon far icon='check-circle' size='2x'/>
                      </MDBBtn>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>Tidak ada data peminjaman</td>
                </tr>
              )}
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