
const bcrypt = require('bcrypt');

const contraseñaPlana = 'estudiante123'; // la que quieres usar
bcrypt.hash(contraseñaPlana, 10, (err, hash) => {
  if (err) {
    console.error('Error generando hash:', err);
  } else {
    console.log('Hash generado:', hash);
  }
});
