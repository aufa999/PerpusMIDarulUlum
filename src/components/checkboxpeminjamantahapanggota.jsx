import React, { useState } from 'react';
import { MDBCheckbox } from 'mdb-react-ui-kit';

export default function Checkboxpeminjamantahapanggota() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <MDBCheckbox
        id='peminjamantahapanggotaCheckbox'
        label=''
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    </>
  );
}