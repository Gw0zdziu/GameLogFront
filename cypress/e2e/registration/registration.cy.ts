describe('Registration/registration', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('.container__register').get('a').click();
  })

  it('should successful register user', () => {
    cy.get('input[id=username]').type('Tester');
    cy.get('input[id=firstname]').type('Kacper');
    cy.get('input[id=lastname]').type('Nowak');
    cy.get('input[id=user-email]').type('pogevif323@cadebek.com');
    cy.get('input[id=password]').type('confirmPassword');
    cy.get('input[id=confirm-password]').type('confirmPassword').blur();
    cy.get('.form__button').click();
    cy.wait(2000);
    cy.url().should('include', '/confirm-user');
    cy.get('p-toast').should('contain', 'Udało się założyć konto')
  });

  it('should display message with incorrect register when userName exist', () => {
    cy.get('input[id=username]').type('Gw0zdziu');
    cy.get('input[id=firstname]').type('Kacper');
    cy.get('input[id=lastname]').type('Nowak');
    cy.get('input[id=user-email]').type('pogevif323@cadebek.com');
    cy.get('input[id=password]').type('confirmPassword');
    cy.get('input[id=confirm-password]').type('confirmPassword').blur();
    cy.get('.form__button').click();
    cy.get('p-toast').should('contain', 'User with this username already exist')
  });
});
