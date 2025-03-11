import { faker } from '@faker-js/faker';

describe("Create Student Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should allow a user to log in and create a student", () => {
    // Intercept the login API request
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        role_id: "001",
      },
    }).as("loginRequest");

    // Login
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='password']").type("password123");
    cy.get("button[type='submit']").click();
    cy.wait("@loginRequest");

    // Navigate to students page
    cy.visit("http://localhost:5173/students");

    // Click "Add Student" button
    cy.get("#addStudent").should("be.visible").click();

    // Define the course options
    const courseOptions = {
      "Ethical Hacking": "001",
      "Architecture": "002",
      "Cyber Security": "003",
    };

    // Generate random course label and get its value
    const randomCourseLabel = faker.helpers.arrayElement(Object.keys(courseOptions));
    const randomCourseValue = courseOptions[randomCourseLabel];

    // Fill in student details
    cy.get("input[name='student_id']").type(faker.string.numeric(4));
    cy.get("input[name='first_name']").type(faker.person.fullName());
    cy.get("input[name='email']").type(faker.internet.email());
    cy.get("select[name='gender']").select(faker.helpers.arrayElement(["Male", "Female", "Other"]));
    cy.get("input[name='age']").type(faker.string.numeric(2));
    cy.get("select[name='studentcourse_id']").select(randomCourseValue);

    // Intercept the student creation request
    cy.intercept("POST", "/api/add_student", (req) => {
      expect(req.body).to.have.property("studentcourse_id", randomCourseValue);
    }).as("addStudent");

    // Submit the form
    cy.get("button[type='submit']").click();

    // Wait for student to be added
    //cy.wait("@addStudent").its("response.statusCode").should("eq", 200);
  });
});
