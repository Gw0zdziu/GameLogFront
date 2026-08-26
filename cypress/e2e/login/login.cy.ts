describe('Login Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  })

  it('should display container with correct login form', () => {
    cy.get('.container__header').should('contain', 'Zaloguj');
    cy.get('input[id=username]').should('be.visible');
    cy.get('p-password[id=password]').should('be.visible');
    cy.get('button[type=submit]').should('be.visible').should('contain', 'Zaloguj');
  });

  it('should button execute nothing action when inputs is empty', () => {
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/login');
  });

  it('should display message with incorrect log in', () => {
    cy.get('input[id=username]').type('Gw0zdziu');
    cy.get('p-password[id=password]').type('Gw0zdziu1');
    cy.get('button[type=submit]').click();
    cy.wait(1500);
    cy.get('p-toast').should('contain', 'Data of login is incorrect')
  });

  it('should successful log in', () => {
    cy.get('input[id=username]').type('Gw0zdziu');
    cy.get('p-password[id=password]').type('Gw0zdziu');
    cy.get('button[type=submit]').click();
    cy.wait(2000);
    cy.url().should('include', '/home');
  });


});
