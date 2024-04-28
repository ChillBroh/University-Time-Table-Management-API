const { login } = require("../../controllers/authController");
const User = require("../../models/usersModal");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/AppError");

jest.mock("../../models/usersModal");
jest.mock("bcrypt");
jest.mock("../../utils/AppError");

describe("login function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return an error if userName or password is missing", async () => {
    const req = {
      body: {},
    };
    const res = {};
    const next = jest.fn();
    await login(req, res, next);

    // Assertions
    expect(AppError).toHaveBeenCalledWith(
      "Please provide email and password!",
      400
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
  test("should return an error if user does not exist", async () => {
    const req = {
      body: {
        userName: "nonExistentUser",
        password: "password123",
      },
    };
    const res = {};
    const next = jest.fn();

    User.findOne.mockResolvedValue(null);
    await login(req, res, next);

    // Assertions
    expect(AppError).toHaveBeenCalledWith("Unauthorized", 401);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  test("should return an error if password is incorrect", async () => {
    const req = {
      body: {
        userName: "testUser",
        password: "incorrectPassword",
      },
    };
    const res = {};
    const next = jest.fn();

    const mockUser = {
      userName: "testUser",
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res, next);

    expect(AppError).toHaveBeenCalledWith("Unauthorized", 401);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
