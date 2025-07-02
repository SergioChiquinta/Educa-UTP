
describe('Flujo completo del formulario de Login', () => {
  beforeEach(() => {
    // Visita la URL de tu app
    cy.visit('http://localhost:3001');
  });

  it('Prueba los botones, luego login fallido y finalmente login correcto', () => {
    // Verificar que carga bien
    cy.contains('Email').should('be.visible');
    cy.contains('Contraseña').should('be.visible');
    cy.get('button').contains('Iniciar sesión').should('be.visible');
    cy.contains('¿Olvidaste tu contraseña?').should('be.visible');
    cy.wait(1000);

    // Permite escribir en los campos
    cy.get('input#correo').type('test@example.com');
    cy.get('input#password').type('123456');
    cy.wait(1000);

    // Mostrar contraseña
    cy.get('span.input-group-text').click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    cy.wait(1000);

    // Probar formulario de reset
    cy.contains('¿Olvidaste tu contraseña?').click();
    cy.contains('Restablecer contraseña').should('be.visible');
    cy.get('input#resetEmail').should('exist');
    cy.wait(2000);
    cy.get('button').contains('Volver').click();

    // Volver al login
    cy.get('button').contains('Iniciar sesión').should('be.visible');
    cy.wait(1000);

    // -------- LOGIN FALLIDO --------
    cy.intercept('POST', 'http://localhost:3000/api/login', {
      statusCode: 401,
      body: {
        message: 'Credenciales inválidas'
      }
    }).as('loginError');

    cy.get('input#correo').clear().type('usuario@mal.com');
    cy.get('input#password').clear().type('wrongpassword');
    cy.get('button').contains('Iniciar sesión').click();
    cy.wait(1000);

    cy.wait('@loginError');
    cy.get('.Toastify__toast--error').should('contain.text', 'Credenciales inválidas');

    // -------- LOGIN CORRECTO --------
    cy.intercept('POST', 'http://localhost:3000/api/login', {
      statusCode: 200,
      body: {
        token: 'real-jwt-token',
        user: {
          nombre: 'Administrador',
          rol: 'admin'
        }
      }
    }).as('loginSuccess');
    cy.wait(1000);

    cy.get('input#correo').clear().type('admin@utp.edu.pe');
    cy.get('input#password').clear().type('admin123');
    cy.get('button').contains('Iniciar sesión').click();
    cy.wait(1000);

    cy.wait('@loginSuccess');
    cy.wait(5000);
  });
});
