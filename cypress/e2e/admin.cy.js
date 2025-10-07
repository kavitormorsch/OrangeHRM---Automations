describe('template spec', () => {
  beforeEach(() => {
    cy.login("Admin", "admin123")
    cy.get('.oxd-main-menu-item').contains("Admin").click()
  })
  it('Adds a login to an employee', () => {
    var max;
    var rand = Math.floor(Math.random() * 10000);
    var username = "reallygoodname." + rand;

    cy.contains(".oxd-button", "Add").click()

    cy.contains(".oxd-input-group", "User Role").find(".oxd-select-wrapper").click()
    cy.contains(".oxd-select-option", "ESS").click()

    cy.get(".oxd-autocomplete-text-input > input").type("e")
    cy.get(".oxd-autocomplete-option").should("not.contain", "Searching...")
    //pick a random user from the autocomplete list if there are more than one
    if(cy.get(".oxd-autocomplete-option").its('length') != NaN)
      cy.get(".oxd-autocomplete-option").then(($option)=>{
        max = $option.length
        console.log(max)
        rand = Math.floor(Math.random() * max)
        
        cy.get(".oxd-autocomplete-option").eq(rand).click()
      })
    else{
      cy.get(".oxd-autocomplete-option").click()
    }

    cy.contains(".oxd-input-group", "Status").find(".oxd-select-wrapper").click()
    cy.contains(".oxd-select-option", "Enabled").click()

    cy.contains(".oxd-input-group", "Username")
      .find(".oxd-input")
      .type(username)
    
    cy.contains(".oxd-input-group", "Password")
      .find(".oxd-input")
      .type("goodpassword123")

    cy.contains(".oxd-input-group", "Confirm Password")
      .find(".oxd-input")
      .type("goodpassword123")

    cy.contains(".oxd-button--secondary", "Save").click()

    //assert the user has been added
    cy.location("pathname", {timeout: 10000}).should("equal", "/web/index.php/admin/viewSystemUsers")
    cy.get(".orangehrm-container").find(".oxd-table-row").should("contain", username)
  })
})