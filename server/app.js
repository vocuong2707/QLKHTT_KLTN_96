"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const question_route_1 = __importDefault(require("./routes/question.route"));
const express_rate_limit_1 = require("express-rate-limit");
// body parser
exports.app.use(express_1.default.json({ limit: "500mb" }));
const origin = process.env.ORIGIN;
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000/', // Cho phép frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
    credentials: true, // Gửi cookie hoặc thông tin xác thực
}));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
// routes
exports.app.use("/api/v1", user_route_1.default, order_route_1.default, course_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default, question_route_1.default);
exports.app.options('*', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).send(); // Không có nội dung
});
// socketio
const io = require("socket.io")(8080, {
    cors: {
        origin: "http://localhost:3000/", // Địa chỉ front-end
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
});
// testing api
exports.app.get("/KHTT", (req, res, next) => {
    res.status(200).json({
        success: true,
        mesage: "API is working"
    });
    console.log('====================================');
    console.log("Server connectio");
    console.log('====================================');
});
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
