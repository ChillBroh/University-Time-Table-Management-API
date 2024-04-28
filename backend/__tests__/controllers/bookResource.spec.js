const {
  addBooking,
  getAllBookings,
  updateBooking,
} = require("../../controllers/bookResouceController");
const BookResource = require("../../models/bookResource");
const Resources = require("../../models/resourcesModal");
const AppError = require("../../utils/AppError");
const Filter = require("../../utils/filter");

jest.mock("../../models/bookResource");
jest.mock("../../models/resourcesModal");
jest.mock("../../utils/AppError");
jest.mock("../../utils/filter");

describe("addBooking function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add booking successfully", async () => {
    const req = {
      body: {
        resourceId: "resourceId",
        startTime: new Date(),
        endTime: new Date(),
      },
      user: { _id: "userId" },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockResource = {
      _id: "resourceId",
      availability: true,
    };

    Resources.findOne.mockResolvedValue(mockResource);
    BookResource.findOne.mockResolvedValue(null);
    BookResource.prototype.save.mockResolvedValue({
      _id: "bookingId",
      resourceId: "resourceId",
      bookedBy: "userId",
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    await addBooking(req, res, next);

    expect(Resources.findOne).toHaveBeenCalledWith({
      _id: "resourceId",
      availability: true,
    });
    expect(BookResource.findOne).toHaveBeenCalledWith({
      resourceId: "resourceId",
      $or: [
        {
          $and: [
            { startTime: { $lte: req.body.startTime } },
            { endTime: { $gte: req.body.startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: req.body.endTime } },
            { endTime: { $gte: req.body.endTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: req.body.startTime } },
            { endTime: { $lte: req.body.endTime } },
          ],
        },
      ],
    });
  });
});
