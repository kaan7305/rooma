# 🧪 NestQuarter API Testing Guide

## 🚀 Quick Start

### Server is Running!
✅ **URL:** `http://localhost:3001`
✅ **Status:** Server is live and ready for testing

---

## 📥 Import Postman Collection

### Option 1: Using Postman Desktop
1. Open **Postman**
2. Click **Import** (top left)
3. Select **File** tab
4. Choose: `NestQuarter-API.postman_collection.json`
5. Click **Import**

### Option 2: Drag & Drop
- Drag `NestQuarter-API.postman_collection.json` into Postman window

---

## 🧪 Test Your First Endpoint

### 1. Login with Test Account

**Endpoint:** `POST http://localhost:3001/api/auth/login`

**Body (JSON):**
```json
{
  "email": "test@nestquarter.com",
  "password": "Password123!"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid-here",
      "email": "test@nestquarter.com",
      "first_name": "Test",
      "last_name": "User"
    }
  }
}
```

✨ **The Postman collection automatically saves your access token!**

---

## 🎯 Testing Flow (Recommended Order)

### Step 1: Authentication ✅
1. **Login** - Get your access token
2. **Get My Profile** - Verify auth is working

### Step 2: Universities (Public) 🏫
3. **Search Universities** - Find Harvard
4. **Get University By ID** - See details

### Step 3: Properties 🏠
5. **Get All Properties** - Browse listings (no auth needed)
6. **Create Property** - Add a new listing (requires auth)
7. **Get Property By ID** - View your listing
8. **Update Property** - Edit your listing

### Step 4: Bookings 📅
9. **Create Booking** - Book a property
10. **Get My Bookings** - See your reservations
11. **Get Booking By ID** - View booking details

### Step 5: Wishlists ❤️
12. **Create Wishlist** - Make a favorites list
13. **Add to Wishlist** - Save properties
14. **Get My Wishlists** - View saved items

### Step 6: Messages 💬
15. **Create Conversation** - Start chatting
16. **Send Message** - Message a host
17. **Get My Conversations** - View inbox

### Step 7: Payments 💳
18. **Create Payment Intent** - Initialize payment
19. **Get Payment Details** - Check payment status

---

## 🔐 Authentication

### How It Works
1. Login returns `accessToken` and `refreshToken`
2. Postman automatically adds `accessToken` to **all requests**
3. Token is sent in header: `Authorization: Bearer <token>`

### If Token Expires
- Use **Refresh Token** endpoint
- Or simply **Login** again

---

## 📝 Test Data Available

### Test User Account
- **Email:** `test@nestquarter.com`
- **Password:** `Password123!`
- **Type:** Both guest and host

### Universities
- **Harvard University** (Cambridge, MA)
  - ID is in database, find via Search

---

## 🛠️ Postman Tips

### Collection Variables
The collection automatically manages these for you:
- `{{baseUrl}}` - API base URL (http://localhost:3001/api)
- `{{accessToken}}` - Your auth token (auto-saved after login)
- `{{userId}}` - Your user ID (auto-saved after login)
- `{{propertyId}}` - Last created property ID
- `{{bookingId}}` - Last created booking ID

### Switching Environments
To test against **Railway cloud database**:
1. Edit collection variable `baseUrl`
2. Or change `PORT` in your `.env` file

---

## 🧪 Manual Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nestquarter.com",
    "password": "Password123!"
  }'
```

### Get Properties (Public)
```bash
curl http://localhost:3001/api/properties
```

### Get Profile (Authenticated)
```bash
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Server Not Responding?
```bash
# Check if server is running
lsof -i :3001

# Restart server
cd "/Users/kaaneroltu/Desktop/Sublet Project/backend"
PORT=3001 npm run dev
```

### 401 Unauthorized?
- Your token expired → Login again
- Token not in header → Check Postman auth settings

### 404 Not Found?
- Check the endpoint URL
- Verify `baseUrl` is `http://localhost:3001/api`

### 500 Server Error?
- Check server logs in terminal
- Verify database is running: `psql -d nestquarter`

---

## 📊 All Available Endpoints

### Authentication (5 endpoints)
- POST `/auth/register`
- POST `/auth/login` ⭐
- POST `/auth/refresh`
- POST `/auth/logout`
- POST `/auth/reset-password`

### Users (5 endpoints)
- GET `/users/me` ⭐
- PATCH `/users/me`
- POST `/users/me/photo`
- GET `/users/:id`
- POST `/users/verify-identity`

### Properties (9 endpoints)
- POST `/properties`
- GET `/properties` ⭐ (Public)
- GET `/properties/:id` (Public)
- PATCH `/properties/:id`
- DELETE `/properties/:id`
- POST `/properties/:id/photos`
- POST `/properties/:id/availability`
- GET `/properties/search`
- GET `/properties/host/:hostId`

### Bookings (7 endpoints)
- POST `/bookings`
- GET `/bookings`
- GET `/bookings/:id`
- PATCH `/bookings/:id/status`
- POST `/bookings/:id/cancel`
- POST `/bookings/check-availability`
- GET `/bookings/user/:userId`

### Reviews (6 endpoints)
- POST `/reviews`
- GET `/reviews/property/:propertyId`
- GET `/reviews/user/:userId`
- PATCH `/reviews/:id`
- DELETE `/reviews/:id`
- POST `/reviews/:id/response`

### Wishlists (8 endpoints)
- POST `/wishlists`
- GET `/wishlists`
- GET `/wishlists/:id`
- PATCH `/wishlists/:id`
- DELETE `/wishlists/:id`
- POST `/wishlists/:id/items`
- DELETE `/wishlists/:id/items/:propertyId`
- GET `/wishlists/check/:propertyId`

### Universities (2 endpoints)
- GET `/universities` ⭐ (Public)
- GET `/universities/:id` (Public)

### Messages (6 endpoints)
- POST `/conversations`
- GET `/conversations`
- GET `/conversations/:id`
- POST `/conversations/:id/messages`
- GET `/conversations/:id/messages`
- PATCH `/conversations/:id/read`

### Payments (5 endpoints)
- POST `/payments/create-intent`
- POST `/payments/:bookingId/confirm`
- GET `/payments/:bookingId`
- POST `/payments/:bookingId/refund`
- POST `/payments/webhook`

### Payouts (3 endpoints)
- GET `/payouts`
- GET `/payouts/:id`
- POST `/payouts/request`

**Total: 50 endpoints** ✅

---

## 🎉 Happy Testing!

Your NestQuarter API is fully functional and ready to test!

### Need Help?
- Check server logs for errors
- Verify database connection
- Ensure all environment variables are set

### Next Steps
1. Test all endpoints in Postman
2. Build your frontend
3. Add Stripe API keys for real payments
4. Deploy to production!
