const { registerUser } = require("../../controllers/userController");
const User = require("../../models/usersModal");
const authController = require("../../controllers/userController");
const passwordHash = require("../../utils/passwordHash");
const AppError = require("../../utils/AppError");

jest.mock("../../models/usersModal"); // Mocking User model
jest.mock("../../controllers/authController"); // Mocking authController
jest.mock("../../utils/passwordHash"); // Mocking passwordHash function
jest.mock("../../utils/AppError"); // Mocking AppError class

describe("registerUser function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  test("should register a new user and return a token", async () => {
    const req = {
      body: {
        userName: "testUser",
        email: "test@example.com",
        mobileNo: "1234567890",
        password: "password123",
        role: "Student",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mocking findOne to return null, indicating user doesn't exist
    User.findOne.mockResolvedValue(null);

    // Mocking create method of User model to return a mock user
    const mockUser = {
      userName: "testUser",
      email: "test@example.com",
      mobileNo: "1234567890",
      role: "Student",
      createdDate: new Date(),
    };
    User.create.mockResolvedValue(mockUser);

    // Call the function
    await registerUser(req, res, next);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  test("should return an error if user already exists", async () => {
    const req = {
      body: {
        email: "existing@example.com",
      },
    };
    const res = {};
    const next = jest.fn();

    // Mocking findOne to return an existing user
    User.findOne.mockResolvedValue({
      email: "existing@example.com",
    });

    // Call the function
    await registerUser(req, res, next);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({
      email: "existing@example.com",
    });
    expect(AppError).toHaveBeenCalledWith("User Already Exists!", 400);
  });

  test("should return an error if hashing password fails", async () => {
    const req = {
      body: {
        userName: "testUser",
        email: "test@example.com",
        mobileNo: "1234567890",
        password: "password123",
        role: "Student",
      },
    };
    const res = {};
    const next = jest.fn();

    // Mocking findOne to return null, indicating user doesn't exist
    User.findOne.mockResolvedValue(null);

    // Mocking passwordHash to throw an error
    passwordHash.mockRejectedValue(new Error("Hashing error"));

    // Call the function
    await registerUser(req, res, next);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(passwordHash).toHaveBeenCalledWith("password123");
    expect(User.create).not.toHaveBeenCalled();
    expect(authController.createSendToken).not.toHaveBeenCalled();
    expect(AppError).toHaveBeenCalledWith("Error hashing password", 400);
  });
});
