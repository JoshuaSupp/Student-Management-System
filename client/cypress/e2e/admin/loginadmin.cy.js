describe("Login Page Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173"); // Adjust the URL based on your app
  });

  it("should allow a user to log in successfully", () => {
    // Intercept the login API request and mock a response
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        role_id: "001",
      },
    }).as("loginRequest");

    // Fill in the email and password fields
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='password']").type("password123");

    // Click the login button
    cy.get("button[type='submit']").click();

    // Wait for the API call
    cy.wait("@loginRequest");

    // Assert that the toast notification appears
    cy.contains("Login Successful!").should("be.visible");

    // Check that the token and role are stored in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.exist;
      expect(win.localStorage.getItem("role_id")).to.equal("001");
    });

    cy.wait(5000); //wait for dashboard

    // Ensure it redirects to the correct page
    cy.url().should("include", "/dashboard");
  });

  it("should show an error for invalid credentials", () => {
    // Intercept login request with failure response
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { message: "Invalid email or password" },
    }).as("loginRequest");

    // Enter incorrect login details
    cy.get("input[type='email']").type("wrong@example.com");
    cy.get("input[type='password']").type("wrongpassword");

    // Click the login button
    cy.get("button[type='submit']").click();

    // Wait for the API call
    cy.wait("@loginRequest");

    // Verify error toast message appears
    cy.contains("Invalid email or password").should("be.visible");

    // Ensure it does NOT redirect
    cy.url().should("include", "/");
  });
});
