import React, { useState } from 'react';
import { MDBCheckbox } from 'mdb-react-ui-kit';

export default function Checkboxpeminjamanbuku() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <MDBCheckbox
        id='peminjamanbukuCheckbox'
        label=''
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    </>
  );
}