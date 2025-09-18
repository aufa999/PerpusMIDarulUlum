import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer, MDBBtn, MDBIcon, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function TabelPengembalian() {
  const [pengembalianList, setPengembalianList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 30;

  const fetchPengembalian = async () => {
    try {
      const res = await axios.get('/pengembalian');
      if (res.data.success) {
        setPengembalianList(res.data.data);
      }
    } catch (err) {
      setPengembalianList([]);
    }
  };

  useEffect(() => {
    fetchPengembalian();
  }, []);

  // Fungsi hapus riwayat pengembalian
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus riwayat pengembalian ini?')) {
      try {
        const res = await axios.delete(`/hapuspengembalian/${id}`);
        if (res.data.success) {
          fetchPengembalian();
          alert('Riwayat pengembalian berhasil dihapus!');
        }
      } catch (err) {
        alert('Gagal menghapus riwayat pengembalian!');
      }
    }
  };

  // Urutkan data terbaru ke terlama
  const sortedList = [...pengembalianList].sort((a, b) => 
    new Date(b.tanggalKembali) - new Date(a.tanggalKembali)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedList.length / dataPerPage);
  const paginatedList = sortedList.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <MDBContainer fluid>
      <div>
        <h4 className="my-3">Riwayat Pengembalian Buku</h4>
        <MDBTable align='middle'>
          <MDBTableHead>
            <tr>
              <th scope='col'>No</th>
              <th scope='col'>Nama Peminjam</th>
              <th scope='col'>Kelas</th>
              <th scope='col'>Buku Dikembalikan</th>
              <th scope='col'>Tanggal Pinjam</th>
              <th scope='col'>Tanggal Kembali</th>
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
                    {item.tanggalPinjam ? new Date(item.tanggalPinjam).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {new Date(item.tanggalKembali).toLocaleDateString()}
                  </td>
                  <td>
                    <MDBBtn color='danger' rounded size='sm' onClick={() => handleDelete(item._id)}>
                      <MDBIcon fas icon='trash' size='2x'/>
                    </MDBBtn>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>Tidak ada data pengembalian</td>
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
    </MDBContainer>
  );
}