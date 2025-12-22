"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyReviews = exports.getAvailability = exports.deletePhoto = exports.addPhoto = exports.deleteProperty = exports.updateProperty = exports.searchProperties = exports.getPropertyById = exports.createProperty = void 0;
var propertyService = require("../services/property.service");
var errors_1 = require("../utils/errors");
// Helper to get authenticated user ID
var getAuthUserId = function (req) {
    var userId = req.userId;
    if (!userId) {
        throw new errors_1.UnauthorizedError('Authentication required');
    }
    return userId;
};
/**
 * POST /api/properties
 * Create new property listing
 */
var createProperty = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var hostId, data, property, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                hostId = getAuthUserId(req);
                data = req.body;
                return [4 /*yield*/, propertyService.createProperty(hostId, data)];
            case 1:
                property = _a.sent();
                res.status(201).json({
                    message: 'Property created successfully. Pending admin verification.',
                    data: property,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createProperty = createProperty;
/**
 * GET /api/properties/:id
 * Get property details by ID
 */
var getPropertyById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, property, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.userId;
                return [4 /*yield*/, propertyService.getPropertyById(id, userId)];
            case 1:
                property = _a.sent();
                res.status(200).json({
                    data: property,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPropertyById = getPropertyById;
/**
 * GET /api/properties
 * Search properties with filters
 */
var searchProperties = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var filters, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                filters = req.query;
                return [4 /*yield*/, propertyService.searchProperties(filters)];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    data: result.properties,
                    pagination: result.pagination,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchProperties = searchProperties;
/**
 * PATCH /api/properties/:id
 * Update property
 */
var updateProperty = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, hostId, data, property, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                hostId = getAuthUserId(req);
                data = req.body;
                return [4 /*yield*/, propertyService.updateProperty(id, hostId, data)];
            case 1:
                property = _a.sent();
                res.status(200).json({
                    message: 'Property updated successfully',
                    data: property,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProperty = updateProperty;
/**
 * DELETE /api/properties/:id
 * Delete property (soft delete)
 */
var deleteProperty = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, hostId, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                hostId = getAuthUserId(req);
                return [4 /*yield*/, propertyService.deleteProperty(id, hostId)];
            case 1:
                result = _a.sent();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProperty = deleteProperty;
/**
 * POST /api/properties/:id/photos
 * Add photo to property
 */
var addPhoto = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, hostId, data, photo, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                hostId = getAuthUserId(req);
                data = req.body;
                return [4 /*yield*/, propertyService.addPhoto(id, hostId, data)];
            case 1:
                photo = _a.sent();
                res.status(201).json({
                    message: 'Photo added successfully',
                    data: photo,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addPhoto = addPhoto;
/**
 * DELETE /api/properties/:id/photos/:photoId
 * Delete photo from property
 */
var deletePhoto = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, photoId, hostId, result, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, id = _a.id, photoId = _a.photoId;
                hostId = getAuthUserId(req);
                return [4 /*yield*/, propertyService.deletePhoto(id, photoId, hostId)];
            case 1:
                result = _b.sent();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePhoto = deletePhoto;
/**
 * GET /api/properties/:id/availability
 * Get property availability (booked dates)
 */
var getAvailability = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, availability, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, propertyService.getAvailability(id)];
            case 1:
                availability = _a.sent();
                res.status(200).json({
                    data: availability,
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAvailability = getAvailability;
/**
 * GET /api/properties/:id/reviews
 * Get property reviews with pagination
 */
var getPropertyReviews = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, page, limit, result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                page = parseInt(req.query.page) || 1;
                limit = parseInt(req.query.limit) || 10;
                return [4 /*yield*/, propertyService.getPropertyReviews(id, page, limit)];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    data: result.reviews,
                    average_ratings: result.average_ratings,
                    pagination: result.pagination,
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPropertyReviews = getPropertyReviews;
