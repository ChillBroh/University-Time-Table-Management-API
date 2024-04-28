const {
  addResource,
  getAllResources,
  updateResource,
  deleteResource,
} = require("../../controllers/resourceController");
const Resources = require("../../models/resourcesModal");
const AppError = require("../../utils/AppError");
const Filter = require("../../utils/filter");

jest.mock("../models/resourcesModal");
jest.mock("../utils/AppError");
jest.mock("../utils/filter");

describe("addResource function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add resource successfully", async () => {
    const req = {
      body: {
        resourceId: "resourceId",
        name: "Resource Name",
        type: "ClassRoom",
        availability: true,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockResource = {
      resourceId: "resourceId",
      name: "Resource Name",
      type: "ClassRoom",
      availability: true,
    };

    Resources.prototype.save.mockResolvedValue(mockResource);

    await addResource(req, res, next);

    expect(Resources.prototype.save).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: mockResource,
      Message: "Resource Created",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
