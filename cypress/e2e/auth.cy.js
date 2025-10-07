describe('template spec', () => {
  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
  })
  it('Sucessfully logs in', () => {
    cy.get(`[name='username']`).type("Admin")
    cy.get(`[name='password']`).type("admin123")

    cy.get(".oxd-button").contains("Login").click()
  })

  it.only('Should display error message for each field', () => {
    cy.get(`[name='username']`).type(" ")
    cy.contains(".oxd-input-group", "Username").contains(".oxd-text", "Required")
    cy.get(`[name='password']`).type(" ")
    cy.contains(".oxd-input-group", "Password").contains(".oxd-text", "Required")
  })
})