import React, { useEffect, useState } from 'react';
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInputGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';
import Modaltambahanggota from '../components/modaltambahanggota';
// import Modaleditanggota from '../components/modaleditanggota';
// import Validasieditanggota from '../components/validasieditanggota';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

export default function Tabelanggota() {
    const [anggotalist, setAnggotalist] = useState([]);
    const [staticModal, setStaticModal] = useState(false);
    const toggleOpen = () => setStaticModal(!staticModal);
    const [formEdit, setFormEdit] = useState({
        nama: '',
        notelp: '',
        kelas: '',
        ttl: '',
        foto: null,
        fotoUrl: ''
    });
    const [editId, setEditId] = useState(null);
    const [sortMode, setSortMode] = useState('none'); // 'none', 'asc', 'desc'
    const [selectedKelas, setSelectedKelas] = useState('Semua');
    const [kelasList, setKelasList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const anggotaPerPage = 30;

    const handleEditOpen = (anggota) => {
        setFormEdit({
            nama: anggota.nama,
            notelp: anggota.notelp,
            kelas: anggota.kelas,
            ttl: anggota.ttl,
            foto: null,
            fotoUrl: anggota.foto || ''
        });
        setEditId(anggota._id);
        setStaticModal(true);
    };

    // Handler untuk input text
    const handleEditOnChange = (e) => {
        const { value, name } = e.target;
        setFormEdit((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler untuk input file foto
    const handleEditFotoChange = (e) => {
        const file = e.target.files[0];
        setFormEdit((prev) => ({
            ...prev,
            foto: file,
            fotoUrl: file ? URL.createObjectURL(file) : prev.fotoUrl
        }));
    };

    // Submit edit anggota dengan FormData
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('_id', editId);
            formData.append('nama', formEdit.nama);
            formData.append('notelp', formEdit.notelp);
            formData.append('kelas', formEdit.kelas);
            formData.append('ttl', formEdit.ttl);
            if (formEdit.foto) {
                formData.append('foto', formEdit.foto);
            }
            const data = await axios.put('/editanggota', formData, {
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

    const handleSort = () => {
        let sorted = [...anggotalist];
        let nextMode = '';
        switch (sortMode) {
            case 'none':
                sorted.sort((a, b) => a.nama.localeCompare(b.nama));
                nextMode = 'asc';
                break;
            case 'asc':
                sorted.sort((a, b) => b.nama.localeCompare(a.nama));
                nextMode = 'desc';
                break;
            case 'desc':
                // Kembali ke urutan awal (tanpa sort)
                sorted = [...anggotalist];
                nextMode = 'none';
                break;
            default:
                nextMode = 'none';
        }
        setAnggotalist(sorted);
        setSortMode(nextMode);
    };

    const getFetchData = async () => {
        const data = await axios.get('/anggota');
        if (data.data.success) {
            setAnggotalist(data.data.data);
            setSortMode('none'); // reset sort saat fetch baru
            // Ambil kelas unik
            const kelasUnik = [
                ...new Set(data.data.data.map((anggota) => anggota.kelas).filter(Boolean))
            ];
            setKelasList(kelasUnik);
        }
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const deleteAnggota = async (id) => {
        var result = window.confirm("Anda yakin?");
        if (result) {
            await axios.delete('/hapusanggota/' + id)
                .then(response => {
                    getFetchData();
                })
                .catch(error => {
                    console.log(error)
                });
        }
    };

    // Filter anggota berdasarkan kelas dan search
    const filteredList = anggotalist.filter((anggota) => {
        const keyword = searchTerm.toLowerCase();
        const match =
            anggota.nama?.toLowerCase().includes(keyword) ||
            anggota.notelp?.toLowerCase().includes(keyword) ||
            anggota.kelas?.toLowerCase().includes(keyword);

        const kelasMatch = selectedKelas === 'Semua' ? true : anggota.kelas === selectedKelas;
        return match && kelasMatch;
    });

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
                                <Modaltambahanggota />
                            </MDBCol>
                            <MDBCol>
                            {/* Dropdown Sortir */}
                                <MDBDropdown>
                                    <MDBDropdownToggle color='dark' size='sm'>
                                    <MDBIcon fas icon='filter' size='1x' />
                                    <span style={{marginLeft: 8, fontSize: 12}}>Sortir</span>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu onClick={handleSort}>
                                    {/* <MDBDropdownItem link childTag='button'>{sortMode === 'none'}Default</MDBDropdownItem> */}
                                    <MDBDropdownItem link childTag='button'>{sortMode === 'asc'}A-Z</MDBDropdownItem>
                                    <MDBDropdownItem link childTag='button'>{sortMode === 'desc'}Z-A</MDBDropdownItem>
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
                            {paginatedAnggota.length > 0 ? (
                                paginatedAnggota.map((anggota, idx) => (
                                    <tr key={anggota._id}>
                                        <td>{(currentPage - 1) * anggotaPerPage + idx + 1}</td>
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src={anggota.foto ? `http://localhost:8080${anggota.foto}` : 'https://mdbootstrap.com/img/new/avatars/8.jpg'}
                                                    alt=''
                                                    style={{ width: '45px', height: '45px' }}
                                                    className='rounded-circle'
                                                />
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{anggota.nama}</p>
                                                    <p className='text-muted mb-0'>{anggota.notelp}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className='fw-normal mb-1'>{anggota.kelas}</p>
                                        </td>
                                        <td>
                                            {/* Untuk Edit Anggota */}
                                            <MDBBtn color='secondary' rounded size='sm' onClick={() => handleEditOpen(anggota)}>
                                                <MDBIcon fas icon='edit' size='2x' />
                                            </MDBBtn>
                                            {/* Untuk Delete Anggota */}
                                            <MDBBtn color='danger' rounded size='sm' onClick={() => deleteAnggota(anggota._id)}>
                                                <MDBIcon fas icon='trash' size='2x' />
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No Data</td>
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
            {/* Modal Edit */}
            <MDBModal staticBackdrop tabIndex='-1' open={staticModal} onClose={toggleOpen}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Edit Anggota</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBValidation className='row g-3' onSubmit={handleEdit}>
                                <MDBValidationItem className='col-md-4'>
                                    <MDBInput
                                        value={formEdit.nama}
                                        name='nama'
                                        onChange={handleEditOnChange}
                                        id='nama'
                                        required
                                        label='Nama'
                                    />
                                </MDBValidationItem>
                                <MDBValidationItem className='col-md-4'>
                                    <MDBInput
                                        value={formEdit.notelp}
                                        name='notelp'
                                        onChange={handleEditOnChange}
                                        id='typePhone'
                                        type='number'
                                        required
                                        label='No. Telpon'
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
                                        type='text'
                                    />
                                </MDBValidationItem>
                                <MDBValidationItem className='col-md-4'>
                                    <MDBInput
                                        value={formEdit.ttl}
                                        name='ttl'
                                        onChange={handleEditOnChange}
                                        id='ttl'
                                        required
                                        label='Tanggal Lahir'
                                        type='date'
                                    />
                                </MDBValidationItem>
                                <MDBValidationItem className='col-md-4'>
                                    <label htmlFor="editFoto" className="form-label">Edit Foto Anggota</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="editFoto"
                                        name="foto"
                                        accept="image/*"
                                        onChange={handleEditFotoChange}
                                    />
                                    {formEdit.fotoUrl && (
                                        <img
                                            src={formEdit.fotoUrl.startsWith('blob:') ? formEdit.fotoUrl : `http://localhost:8080${formEdit.fotoUrl}`}
                                            alt="foto"
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