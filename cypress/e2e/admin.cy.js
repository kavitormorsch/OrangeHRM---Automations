var max;
var rand = Math.floor(Math.random() * 10000);
var username = "reallygoodname." + rand;
describe("Tests in regards to the Admin tab of the site", () => {
  beforeEach(() => {
    cy.login("Admin", "admin123");
    cy.get(".oxd-main-menu-item").contains("Admin").click();
  });
  it("Adds a login to an employee", () => {
    cy.contains(".oxd-button", "Add").click();

    cy.getByInputGroup("User Role").find(".oxd-select-wrapper").click();
    cy.contains(".oxd-select-option", "ESS").click();

    cy.get(".oxd-autocomplete-text-input > input").type("e");
    cy.get(".oxd-autocomplete-option")
      .as("options")
      .should("not.contain", "Searching...");
    //pick a random user from the autocomplete list if there are more than one
    if (cy.get("@options").its("length") != NaN)
      cy.get("@options").then(($option) => {
        max = $option.length;
        rand = Math.floor(Math.random() * max);

        cy.wrap($option).eq(rand).click();
      });
    else {
      cy.get("@options").click();
    }

    cy.getByInputGroup("Status").find(".oxd-select-wrapper").click();
    cy.contains(".oxd-select-option", "Enabled").click();

    cy.getByInputGroup("Username").find(".oxd-input").type(username);

    cy.getByInputGroup("Password").find(".oxd-input").type("goodpassword123");

    cy.getByInputGroup("Confirm Password")
      .find(".oxd-input")
      .type("goodpassword123");

    cy.contains(".oxd-button--secondary", "Save").click();

    //assert the user has been added
    cy.location("pathname", { timeout: 10000 }).should(
      "equal",
      "/web/index.php/admin/viewSystemUsers",
    );
    cy.get(".orangehrm-container")
      .find(".oxd-table-row")
      .should("contain", username);
  });

  it.skip("Deletes a login", () => {
    cy.get(".oxd-table-row").each(($row) => {
      var tableCells = $row.find(".oxd-table-cell > div");
      console.log(tableCells);
      if (tableCells.text().includes(username)) {
        cy.wrap($row).find(".oxd-icon-button").children(".bi-trash").click();
        cy.get(".oxd-dialog-sheet").should("be.visible");
        cy.contains(".oxd-button", "Yes, Delete").click();
        return false;
      }
    });
    //assert that the user has been deleted
    cy.get(".oxd-table-row", { timeout: 7000 }).each(($row) => {
      cy.wrap($row).should("not.contain", username);
    });
  });

  it("Edits a login", () => {
    rand = Math.floor(Math.random() * 10000);
    var newUsername = "reallygoodname." + rand;
    cy.get(".oxd-table-row").each(($row, index, rowArray) => {
      var tableCells = $row.find(".oxd-table-cell > div");
      if (tableCells.text().includes(username)) {
        cy.wrap($row)
          .find(".oxd-icon-button")
          .children(".bi-pencil-fill")
          .click();
        return false;
      }
      if (index === rowArray.length - 1) {
        throw new Error(`username ${username} not found `);
      }
    });

    //assert page change
    cy.location("pathname").should(
      "include",
      "/web/index.php/admin/saveSystemUser",
    );

    cy.getByInputGroup("User Role").find(".oxd-select-wrapper").click();
    cy.contains(".oxd-select-option", "Admin").click();

    cy.get(".oxd-autocomplete-text-input > input").clear().type("a");
    cy.get(".oxd-autocomplete-option")
      .as("options")
      .should("not.contain", "Searching...");
    //pick a random user from the autocomplete list if there are more than one
    if (cy.get("@options").its("length") != NaN)
      cy.get("@options").then(($option) => {
        max = $option.length;
        rand = Math.floor(Math.random() * max);

        cy.wrap($option).eq(rand).click();
      });
    else {
      cy.get("@options").click();
    }

    cy.getByInputGroup("Username").find(".oxd-input").clear().type(newUsername);

    cy.get(".oxd-checkbox-input").click();
    cy.get(".user-password-row").should("be.visible");

    cy.get(".user-password-row")
      .getByInputGroup("Password")
      .find(".oxd-input")
      .type("goodpassword124");

    cy.getByInputGroup("Confirm Password")
      .find(".oxd-input")
      .type("goodpassword124");
    cy.contains(".oxd-button--secondary", "Save").click();

    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      "/web/index.php/admin/viewSystemUser",
    );

    cy.get(".orangehrm-container")
      .find(".oxd-table-row")
      .should("contain", newUsername);
    cy.then(() => {
      username = newUsername;
    })
  });

  it("Filters the records of users", () => {
    cy.getByInputGroup("Username").type(username + "{enter}");
    cy.get(".orangehrm-container")
      .find(".oxd-table-row")
      .should("have.length", 2)
      .and("contain", username);
    cy.contains(".oxd-button", "Reset").click();

    cy.getByInputGroup("User Role").find(".oxd-select-wrapper").click();
    cy.contains(".oxd-select-option", "ESS").click();
    cy.contains(".oxd-button", "Search").click();

    let index = 2;
    cy.get(".oxd-table-row").each(($row) => {
      var tableCells = $row.find(".oxd-table-cell");
      console.log(tableCells);
      if (index > $row.find(".oxd-table-cell").length) {
        return false;
      }
      cy.get(".oxd-table-cell").eq(index).should("not.contain", "Admin");
      index += 6;
    });

    cy.get(".oxd-autocomplete-text-input > input").type("e");
    cy.get(".oxd-autocomplete-option")
      .as("options")
      .should("not.contain", "Searching...");
    //pick a random user from the autocomplete list if there are more than one
    if (cy.get("@options").its("length") != NaN)
      cy.get("@options").then(($option) => {
        max = $option.length;
        rand = Math.floor(Math.random() * max);

        cy.wrap($option).eq(rand).click();
      });
    else {
      cy.get("@options").click();
    }
    let employeeName;
    cy.get(".oxd-autocomplete-text-input > input").then(($input) => {
      employeeName = $input.val();
      var stringArray = employeeName.split(" ");
      employeeName = stringArray[0] + " " + stringArray[stringArray.length - 1];
    });

    cy.contains(".oxd-button", "Search").click();
    cy.get(".oxd-table-row").each(($row, arrayLength) => {
      console.log($row.parent().attr("class"), arrayLength);
      if (arrayLength === 0)
        return false;
      cy.wrap($row).then(() => {
        cy.get(".oxd-table-cell").eq(3).should("contain", employeeName);
      });
    });
  });
});
