"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ApiError = void 0;
/**
 * Base API Error class
 */
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(statusCode, message, isOperational) {
        if (isOperational === void 0) { isOperational = true; }
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.isOperational = isOperational;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
/**
 * 400 Bad Request
 */
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        if (message === void 0) { message = 'Bad Request'; }
        return _super.call(this, 400, message) || this;
    }
    return BadRequestError;
}(ApiError));
exports.BadRequestError = BadRequestError;
/**
 * 401 Unauthorized
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        if (message === void 0) { message = 'Unauthorized'; }
        return _super.call(this, 401, message) || this;
    }
    return UnauthorizedError;
}(ApiError));
exports.UnauthorizedError = UnauthorizedError;
/**
 * 403 Forbidden
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        if (message === void 0) { message = 'Forbidden'; }
        return _super.call(this, 403, message) || this;
    }
    return ForbiddenError;
}(ApiError));
exports.ForbiddenError = ForbiddenError;
/**
 * 404 Not Found
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = 'Resource not found'; }
        return _super.call(this, 404, message) || this;
    }
    return NotFoundError;
}(ApiError));
exports.NotFoundError = NotFoundError;
/**
 * 409 Conflict
 */
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError(message) {
        if (message === void 0) { message = 'Conflict'; }
        return _super.call(this, 409, message) || this;
    }
    return ConflictError;
}(ApiError));
exports.ConflictError = ConflictError;
/**
 * 422 Unprocessable Entity (Validation Error)
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, errors) {
        if (message === void 0) { message = 'Validation failed'; }
        var _this = _super.call(this, 422, message) || this;
        _this.errors = errors;
        return _this;
    }
    return ValidationError;
}(ApiError));
exports.ValidationError = ValidationError;
/**
 * 500 Internal Server Error
 */
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        if (message === void 0) { message = 'Internal Server Error'; }
        return _super.call(this, 500, message, false) || this;
    }
    return InternalServerError;
}(ApiError));
exports.InternalServerError = InternalServerError;
