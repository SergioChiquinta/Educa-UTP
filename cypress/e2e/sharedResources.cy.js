
describe('Página SharedResources', () => {
  const mockResources = [
    {
      id_recurso: 1,
      titulo: 'Recurso PDF',
      descripcion: 'Descripción PDF',
      nombre_curso: 'Curso 1',
      nombre_categoria: 'Categoría A',
      tipo_archivo: 'PDF',
      fecha_subida: '2024-06-28T12:00:00Z',
      archivo_url: 'recurso1.pdf'
    },
    {
      id_recurso: 2,
      titulo: 'Recurso Word',
      descripcion: 'Descripción Word',
      nombre_curso: 'Curso 2',
      nombre_categoria: 'Categoría B',
      tipo_archivo: 'DOCX',
      fecha_subida: '2024-06-27T10:00:00Z',
      archivo_url: 'recurso2.docx'
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/profile', {
      statusCode: 200,
      body: { nombre: 'Carlos Docente', rol: 'docente' }
    }).as('getProfile');

    cy.intercept('GET', 'http://localhost:3000/api/docente/datos-utiles', {
      statusCode: 200,
      body: {}
    }).as('getDatosUtiles');

    cy.intercept('GET', 'http://localhost:3000/api/general/estadisticas', {
      statusCode: 200,
      body: {}
    }).as('getEstadisticas');

    cy.intercept('GET', 'http://localhost:3000/api/general/recursos-compartidos', {
      statusCode: 200,
      body: mockResources
    }).as('getRecursos');

    cy.intercept('POST', 'http://localhost:3000/api/general/registrar-descarga', {
      statusCode: 200,
      body: { success: true }
    }).as('registrarDescarga');

    // Guardar token y user en localStorage
    window.localStorage.setItem('token', 'fake-token');
    window.localStorage.setItem('user', JSON.stringify({ nombre: 'Carlos Docente', rol: 'docente' }));

    cy.visit('http://localhost:3001/docente-dashboard');
  });

  it('Carga recursos y muestra tabla', () => {
    cy.contains('Recursos Compartidos').click();
    cy.wait('@getRecursos');
    cy.contains('Recurso PDF').should('be.visible');
    cy.contains('Recurso Word').should('be.visible');
    cy.contains('Recursos Académicos').should('be.visible');
  });

  it('Filtra correctamente por título', () => {
    cy.contains('Recursos Compartidos').click();
    cy.wait('@getRecursos');
    cy.get('input[placeholder="Buscar por titulo"]').type('PDF');
    cy.get('button').contains('Filtrar').click();
    cy.contains('Recurso PDF').should('be.visible');
    cy.contains('Recurso Word').should('not.exist');
  });

  it('Simula previsualizar PDF', () => {
    cy.contains('Recursos Compartidos').click();
    cy.wait('@getRecursos');

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.contains('Recurso PDF')
      .parent()
      .parent()
      .find('button')
      .first()
      .click();

    cy.get('@windowOpen').should('be.calledWithMatch', /recurso1\.pdf/);
  });

it('Simula descargar desde botón directo', () => {
  cy.contains('Recursos Compartidos').click();
  cy.wait('@getRecursos');

  cy.window().then((win) => {
    const originalCreateElement = win.document.createElement;

    cy.stub(win.document, 'createElement').callsFake((tagName) => {
      if (tagName === 'a') {
        return {
          set href(val) {},
          set download(val) {},
          click: () => {},
          style: {},
          remove: () => {},
          setAttribute: () => {},
          appendChild: () => {},
        };
      }
      return originalCreateElement.call(win.document, tagName);
    });
  });

  cy.contains('Recurso PDF')
    .parent()
    .parent()
    .find('button')
    .eq(1)
    .click();

  cy.wait('@registrarDescarga').its('response.statusCode').should('eq', 200);
});


});
