"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyReviews = exports.getAvailability = exports.deletePhoto = exports.addPhoto = exports.deleteProperty = exports.updateProperty = exports.searchProperties = exports.getPropertyById = exports.createProperty = void 0;
var database_1 = require("../config/database");
var errors_1 = require("../utils/errors");
var constants_1 = require("../utils/constants");
/**
 * Create new property listing
 */
var createProperty = function (hostId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var amenity_ids, university_id, distance_to_university_km, propertyData, host, university, property;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amenity_ids = data.amenity_ids, university_id = data.university_id, distance_to_university_km = data.distance_to_university_km, propertyData = __rest(data, ["amenity_ids", "university_id", "distance_to_university_km"]);
                return [4 /*yield*/, database_1.default.user.findUnique({
                        where: { id: hostId },
                        select: { user_type: true },
                    })];
            case 1:
                host = _a.sent();
                if (!host || (host.user_type !== 'host' && host.user_type !== 'both')) {
                    throw new errors_1.ForbiddenError('Only hosts can create properties');
                }
                if (!university_id) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.default.university.findUnique({
                        where: { id: university_id },
                    })];
            case 2:
                university = _a.sent();
                if (!university) {
                    throw new errors_1.NotFoundError('University not found');
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, database_1.default.property.create({
                    data: __assign(__assign({}, propertyData), { host_id: hostId, status: constants_1.PROPERTY_STATUS.PENDING_REVIEW, nearest_university_id: university_id, distance_to_university_km: distance_to_university_km, 
                        // Connect amenities if provided
                        amenities: amenity_ids
                            ? {
                                create: amenity_ids.map(function (amenityId) { return ({
                                    amenity: { connect: { id: amenityId } },
                                }); }),
                            }
                            : undefined }),
                    include: {
                        amenities: {
                            include: {
                                amenity: true,
                            },
                        },
                        nearest_university: true,
                        host: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                profile_photo_url: true,
                                student_verified: true,
                                id_verified: true,
                            },
                        },
                    },
                })];
            case 4:
                property = _a.sent();
                return [2 /*return*/, property];
        }
    });
}); };
exports.createProperty = createProperty;
/**
 * Get property by ID with full details
 */
var getPropertyById = function (propertyId_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([propertyId_1], args_1, true), void 0, function (propertyId, userId) {
        var property, avgRating, reviews, bookings, propertyData;
        if (userId === void 0) { userId = undefined; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                        where: { id: propertyId },
                        include: {
                            host: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                    profile_photo_url: true,
                                    bio: true,
                                    student_verified: true,
                                    id_verified: true,
                                    created_at: true,
                                },
                            },
                            photos: {
                                orderBy: { display_order: 'asc' },
                            },
                            amenities: {
                                include: {
                                    amenity: true,
                                },
                            },
                            nearest_university: true,
                            reviews: {
                                where: { status: 'published' },
                                include: {
                                    reviewer: {
                                        select: {
                                            id: true,
                                            first_name: true,
                                            last_name: true,
                                            profile_photo_url: true,
                                        },
                                    },
                                },
                                orderBy: { created_at: 'desc' },
                                take: 10,
                            },
                            bookings: {
                                where: {
                                    booking_status: { in: ['confirmed', 'completed'] },
                                },
                                select: {
                                    check_in_date: true,
                                    check_out_date: true,
                                    booking_status: true,
                                },
                            },
                        },
                    })];
                case 1:
                    property = _a.sent();
                    if (!property) {
                        throw new errors_1.NotFoundError('Property not found');
                    }
                    // Only show inactive/pending properties to the owner
                    if (property.status !== constants_1.PROPERTY_STATUS.ACTIVE && property.host_id !== userId) {
                        throw new errors_1.NotFoundError('Property not found');
                    }
                    avgRating = property.reviews.length > 0
                        ? property.reviews.reduce(function (sum, r) { return sum + Number(r.overall_rating); }, 0) / property.reviews.length
                        : null;
                    reviews = property.reviews, bookings = property.bookings, propertyData = __rest(property, ["reviews", "bookings"]);
                    return [2 /*return*/, __assign(__assign({}, propertyData), { average_rating: avgRating, total_reviews: reviews.length, reviews: reviews.slice(0, 5), booked_dates: bookings.map(function (b) { return ({
                                start_date: b.check_in_date,
                                end_date: b.check_out_date,
                            }); }) })];
            }
        });
    });
};
exports.getPropertyById = getPropertyById;
/**
 * Search properties with filters and pagination
 */
var searchProperties = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var city, country, university_id, min_price, max_price, bedrooms, bathrooms, property_type, amenity_ids, check_in, check_out, max_distance_km, _a, page, _b, limit, _c, sort_by, where, orderBy, _d, properties, total, propertiesWithRatings;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                city = filters.city, country = filters.country, university_id = filters.university_id, min_price = filters.min_price, max_price = filters.max_price, bedrooms = filters.bedrooms, bathrooms = filters.bathrooms, property_type = filters.property_type, amenity_ids = filters.amenity_ids, check_in = filters.check_in, check_out = filters.check_out, max_distance_km = filters.max_distance_km, _a = filters.page, page = _a === void 0 ? 1 : _a, _b = filters.limit, limit = _b === void 0 ? 20 : _b, _c = filters.sort_by, sort_by = _c === void 0 ? 'created_at' : _c;
                where = {
                    status: constants_1.PROPERTY_STATUS.ACTIVE,
                };
                if (city)
                    where.city = { contains: city, mode: 'insensitive' };
                if (country)
                    where.country = { contains: country, mode: 'insensitive' };
                if (university_id)
                    where.nearest_university_id = university_id;
                if (min_price)
                    where.monthly_price_cents = __assign(__assign({}, where.monthly_price_cents), { gte: min_price });
                if (max_price)
                    where.monthly_price_cents = __assign(__assign({}, where.monthly_price_cents), { lte: max_price });
                if (bedrooms)
                    where.bedrooms = { gte: bedrooms };
                if (bathrooms)
                    where.bathrooms = { gte: bathrooms };
                if (property_type)
                    where.property_type = property_type;
                if (max_distance_km && university_id) {
                    where.distance_to_university_km = { lte: max_distance_km };
                }
                // Filter by amenities (must have all specified amenities)
                if (amenity_ids && amenity_ids.length > 0) {
                    where.amenities = {
                        some: {
                            amenity_id: { in: amenity_ids },
                        },
                    };
                }
                // Filter by availability (no overlapping bookings)
                if (check_in && check_out) {
                    where.bookings = {
                        none: {
                            booking_status: { in: ['confirmed', 'completed'] },
                            OR: [
                                {
                                    // Booking starts during search period
                                    check_in_date: { gte: new Date(check_in), lte: new Date(check_out) },
                                },
                                {
                                    // Booking ends during search period
                                    check_out_date: { gte: new Date(check_in), lte: new Date(check_out) },
                                },
                                {
                                    // Booking completely overlaps search period
                                    AND: [{ check_in_date: { lte: new Date(check_in) } }, { check_out_date: { gte: new Date(check_out) } }],
                                },
                            ],
                        },
                    };
                }
                orderBy = {};
                switch (sort_by) {
                    case 'price_asc':
                        orderBy = { monthly_price_cents: 'asc' };
                        break;
                    case 'price_desc':
                        orderBy = { monthly_price_cents: 'desc' };
                        break;
                    case 'distance':
                        orderBy = { distance_to_university_km: 'asc' };
                        break;
                    case 'created_at':
                    default:
                        orderBy = { created_at: 'desc' };
                }
                return [4 /*yield*/, Promise.all([
                        database_1.default.property.findMany({
                            where: where,
                            orderBy: orderBy,
                            skip: (page - 1) * limit,
                            take: limit,
                            include: {
                                host: {
                                    select: {
                                        id: true,
                                        first_name: true,
                                        last_name: true,
                                        profile_photo_url: true,
                                        student_verified: true,
                                        id_verified: true,
                                    },
                                },
                                photos: {
                                    take: 1,
                                    orderBy: { display_order: 'asc' },
                                },
                                nearest_university: {
                                    select: {
                                        id: true,
                                        name: true,
                                        city: true,
                                        country: true,
                                    },
                                },
                                reviews: {
                                    where: { status: 'published' },
                                    select: {
                                        overall_rating: true,
                                    },
                                },
                            },
                        }),
                        database_1.default.property.count({ where: where }),
                    ])];
            case 1:
                _d = _e.sent(), properties = _d[0], total = _d[1];
                propertiesWithRatings = properties.map(function (property) {
                    var avgRating = property.reviews.length > 0
                        ? property.reviews.reduce(function (sum, r) { return sum + Number(r.overall_rating); }, 0) / property.reviews.length
                        : null;
                    var reviews = property.reviews, propertyData = __rest(property, ["reviews"]);
                    return __assign(__assign({}, propertyData), { average_rating: avgRating, total_reviews: reviews.length });
                });
                return [2 /*return*/, {
                        properties: propertiesWithRatings,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: total,
                            total_pages: Math.ceil(total / limit),
                        },
                    }];
        }
    });
}); };
exports.searchProperties = searchProperties;
/**
 * Update property
 */
var updateProperty = function (propertyId, hostId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var existingProperty, amenity_ids, university_id, distance_to_university_km, propertyData, university, property;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                    where: { id: propertyId },
                    select: { host_id: true },
                })];
            case 1:
                existingProperty = _a.sent();
                if (!existingProperty) {
                    throw new errors_1.NotFoundError('Property not found');
                }
                if (existingProperty.host_id !== hostId) {
                    throw new errors_1.ForbiddenError('You can only update your own properties');
                }
                amenity_ids = data.amenity_ids, university_id = data.university_id, distance_to_university_km = data.distance_to_university_km, propertyData = __rest(data, ["amenity_ids", "university_id", "distance_to_university_km"]);
                if (!university_id) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.default.university.findUnique({
                        where: { id: university_id },
                    })];
            case 2:
                university = _a.sent();
                if (!university) {
                    throw new errors_1.NotFoundError('University not found');
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, database_1.default.property.update({
                    where: { id: propertyId },
                    data: __assign(__assign({}, propertyData), { nearest_university_id: university_id, distance_to_university_km: distance_to_university_km, updated_at: new Date(), 
                        // Update amenities if provided
                        amenities: amenity_ids !== undefined
                            ? {
                                deleteMany: {}, // Remove all existing amenities
                                create: amenity_ids.map(function (amenityId) { return ({
                                    amenity: { connect: { id: amenityId } },
                                }); }),
                            }
                            : undefined }),
                    include: {
                        amenities: {
                            include: {
                                amenity: true,
                            },
                        },
                        nearest_university: true,
                        photos: {
                            orderBy: { display_order: 'asc' },
                        },
                    },
                })];
            case 4:
                property = _a.sent();
                return [2 /*return*/, property];
        }
    });
}); };
exports.updateProperty = updateProperty;
/**
 * Delete property
 */
var deleteProperty = function (propertyId, hostId) { return __awaiter(void 0, void 0, void 0, function () {
    var existingProperty, activeBookings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                    where: { id: propertyId },
                    select: { host_id: true },
                })];
            case 1:
                existingProperty = _a.sent();
                if (!existingProperty) {
                    throw new errors_1.NotFoundError('Property not found');
                }
                if (existingProperty.host_id !== hostId) {
                    throw new errors_1.ForbiddenError('You can only delete your own properties');
                }
                return [4 /*yield*/, database_1.default.booking.count({
                        where: {
                            property_id: propertyId,
                            booking_status: { in: ['confirmed', 'completed'] },
                        },
                    })];
            case 2:
                activeBookings = _a.sent();
                if (activeBookings > 0) {
                    throw new errors_1.BadRequestError('Cannot delete property with active bookings');
                }
                // Soft delete by setting status to inactive
                return [4 /*yield*/, database_1.default.property.update({
                        where: { id: propertyId },
                        data: {
                            status: constants_1.PROPERTY_STATUS.INACTIVE,
                            updated_at: new Date(),
                        },
                    })];
            case 3:
                // Soft delete by setting status to inactive
                _a.sent();
                return [2 /*return*/, { message: 'Property deleted successfully' }];
        }
    });
}); };
exports.deleteProperty = deleteProperty;
/**
 * Add photo to property
 */
var addPhoto = function (propertyId, hostId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var property, displayOrder, photo;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                    where: { id: propertyId },
                    select: { host_id: true, photos: true },
                })];
            case 1:
                property = _b.sent();
                if (!property) {
                    throw new errors_1.NotFoundError('Property not found');
                }
                if (property.host_id !== hostId) {
                    throw new errors_1.ForbiddenError('You can only add photos to your own properties');
                }
                // Limit to 20 photos per property
                if (property.photos.length >= 20) {
                    throw new errors_1.BadRequestError('Maximum 20 photos per property');
                }
                displayOrder = (_a = data.display_order) !== null && _a !== void 0 ? _a : property.photos.length;
                return [4 /*yield*/, database_1.default.propertyPhoto.create({
                        data: {
                            property_id: propertyId,
                            photo_url: data.photo_url,
                            caption: data.caption,
                            display_order: displayOrder,
                        },
                    })];
            case 2:
                photo = _b.sent();
                return [2 /*return*/, photo];
        }
    });
}); };
exports.addPhoto = addPhoto;
/**
 * Delete photo from property
 */
var deletePhoto = function (propertyId, photoId, hostId) { return __awaiter(void 0, void 0, void 0, function () {
    var property, photo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                    where: { id: propertyId },
                    select: { host_id: true },
                })];
            case 1:
                property = _a.sent();
                if (!property) {
                    throw new errors_1.NotFoundError('Property not found');
                }
                if (property.host_id !== hostId) {
                    throw new errors_1.ForbiddenError('You can only delete photos from your own properties');
                }
                return [4 /*yield*/, database_1.default.propertyPhoto.findFirst({
                        where: {
                            id: photoId,
                            property_id: propertyId,
                        },
                    })];
            case 2:
                photo = _a.sent();
                if (!photo) {
                    throw new errors_1.NotFoundError('Photo not found');
                }
                return [4 /*yield*/, database_1.default.propertyPhoto.delete({
                        where: { id: photoId },
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, { message: 'Photo deleted successfully' }];
        }
    });
}); };
exports.deletePhoto = deletePhoto;
/**
 * Get property availability (booked dates)
 */
var getAvailability = function (propertyId) { return __awaiter(void 0, void 0, void 0, function () {
    var property;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                    where: { id: propertyId },
                    select: {
                        id: true,
                        bookings: {
                            where: {
                                booking_status: { in: ['confirmed', 'completed'] },
                            },
                            select: {
                                check_in_date: true,
                                check_out_date: true,
                                booking_status: true,
                            },
                            orderBy: {
                                check_in_date: 'asc',
                            },
                        },
                    },
                })];
            case 1:
                property = _a.sent();
                if (!property) {
                    throw new errors_1.NotFoundError('Property not found');
                }
                return [2 /*return*/, {
                        property_id: property.id,
                        booked_dates: property.bookings.map(function (booking) { return ({
                            start_date: booking.check_in_date,
                            end_date: booking.check_out_date,
                            status: booking.booking_status,
                        }); }),
                    }];
        }
    });
}); };
exports.getAvailability = getAvailability;
/**
 * Get property reviews
 */
var getPropertyReviews = function (propertyId_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([propertyId_1], args_1, true), void 0, function (propertyId, page, limit) {
        var property, _a, reviews, total, allReviews, avgRatings;
        if (page === void 0) { page = 1; }
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, database_1.default.property.findUnique({
                        where: { id: propertyId },
                        select: { id: true, status: true },
                    })];
                case 1:
                    property = _b.sent();
                    if (!property) {
                        throw new errors_1.NotFoundError('Property not found');
                    }
                    return [4 /*yield*/, Promise.all([
                            database_1.default.review.findMany({
                                where: {
                                    property_id: propertyId,
                                    status: 'published',
                                },
                                include: {
                                    reviewer: {
                                        select: {
                                            id: true,
                                            first_name: true,
                                            last_name: true,
                                            profile_photo_url: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    created_at: 'desc',
                                },
                                skip: (page - 1) * limit,
                                take: limit,
                            }),
                            database_1.default.review.count({
                                where: {
                                    property_id: propertyId,
                                    status: 'published',
                                },
                            }),
                        ])];
                case 2:
                    _a = _b.sent(), reviews = _a[0], total = _a[1];
                    return [4 /*yield*/, database_1.default.review.findMany({
                            where: {
                                property_id: propertyId,
                                status: 'published',
                            },
                            select: {
                                overall_rating: true,
                                cleanliness_rating: true,
                                accuracy_rating: true,
                                communication_rating: true,
                                location_rating: true,
                                value_rating: true,
                            },
                        })];
                case 3:
                    allReviews = _b.sent();
                    avgRatings = allReviews.length > 0
                        ? {
                            overall: allReviews.reduce(function (sum, r) { return sum + Number(r.overall_rating); }, 0) / allReviews.length,
                            cleanliness: allReviews.reduce(function (sum, r) { return sum + Number(r.cleanliness_rating); }, 0) / allReviews.length,
                            accuracy: allReviews.reduce(function (sum, r) { return sum + Number(r.accuracy_rating); }, 0) / allReviews.length,
                            communication: allReviews.reduce(function (sum, r) { return sum + Number(r.communication_rating); }, 0) / allReviews.length,
                            location: allReviews.reduce(function (sum, r) { return sum + Number(r.location_rating); }, 0) / allReviews.length,
                            value: allReviews.reduce(function (sum, r) { return sum + Number(r.value_rating); }, 0) / allReviews.length,
                        }
                        : null;
                    return [2 /*return*/, {
                            reviews: reviews,
                            average_ratings: avgRatings,
                            pagination: {
                                page: page,
                                limit: limit,
                                total: total,
                                total_pages: Math.ceil(total / limit),
                            },
                        }];
            }
        });
    });
};
exports.getPropertyReviews = getPropertyReviews;
