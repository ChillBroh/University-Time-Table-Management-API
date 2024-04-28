const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const rateLimit = require("express-rate-limit");

const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const courseRoute = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/studentEnrollmentRoutes");
const resourceRoutes = require("./routes/resourceRoute");
const bookResourceRoutes = require("./routes/bookResourceRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const {
  removeExpiredTimetables,
} = require("./controllers/timeTableController");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
//to accept body data
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Configure the cors
const app_url = process.env.APP_URL;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "50mb", extended: true }));

app.use(cookieParser());

const base = "/api/v1";

app.use(`${base}/auth`, authRoute);
app.use(`${base}/user`, userRoute);
app.use(`${base}/course`, courseRoute);
app.use(`${base}/enroll`, enrollmentRoutes);
app.use(`${base}/resource`, resourceRoutes);
app.use(`${base}/book-resource`, bookResourceRoutes);
app.use(`${base}/time-tables`, timeTableRoutes);

//remove expired timetables
const interval = 60 * 60 * 60;
setInterval(removeExpiredTimetables, interval);

app.use(errorHandler);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
