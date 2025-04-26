
import React from 'react';

function LogoEduca() {
  return (
    <div className="mb-4 d-flex align-items-center">
      <div className="d-flex gap-1">
        {['E', 'D', 'U', 'C', 'A'].map((letter, index) => (
          <div key={index} className="logo-box">
            {letter}
          </div>
        ))}
      </div>
      <div className="ms-2 d-flex align-items-center fs-3 fw-bold">UTP</div>
    </div>
  );
}

export default LogoEduca;

