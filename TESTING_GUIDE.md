# Testing the Role-Based API Routes

## Setting User Roles in Development

Since we're using mock authentication, you can test different roles by modifying the Authorization header.

### Testing with Different Roles

#### 1. Test as Normal User

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer user-token" \
  -H "Content-Type: application/json"
```

#### 2. Test as Creator

To test creator endpoints, modify the middleware temporarily or implement proper JWT:

```javascript
// In middleware/auth.js, change:
req.user = {
  id: "creator123",
  email: "creator@example.com",
  role: "creator", // Change this to test different roles
};
```

#### 3. Test as Admin

```javascript
req.user = {
  id: "admin123",
  email: "admin@example.com",
  role: "admin",
};
```

---

## Example API Calls

### 1. Normal User Operations

#### View Profile

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer token"
```

#### Book an Event

```bash
curl -X POST http://localhost:3000/booking/bookings \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event123",
    "participants": 2
  }'
```

#### View Own Bookings

```bash
curl -X GET http://localhost:3000/booking/bookings \
  -H "Authorization: Bearer token"
```

#### Cancel a Booking

```bash
curl -X DELETE http://localhost:3000/booking/bookings/booking456 \
  -H "Authorization: Bearer token"
```

---

### 2. Creator Operations

#### Create an Event

```bash
curl -X POST http://localhost:3000/event/events \
  -H "Authorization: Bearer creator-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mountain Hiking",
    "description": "Amazing hiking experience",
    "location": "Colorado",
    "date": "2025-12-15",
    "maxParticipants": 20,
    "price": 150
  }'
```

#### View My Created Events

```bash
curl -X GET http://localhost:3000/event/my-events \
  -H "Authorization: Bearer creator-token"
```

#### Update Own Event

```bash
curl -X PUT http://localhost:3000/event/events/event123 \
  -H "Authorization: Bearer creator-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Mountain Hiking",
    "price": 175
  }'
```

#### Delete Own Event

```bash
curl -X DELETE http://localhost:3000/event/events/event123 \
  -H "Authorization: Bearer creator-token"
```

#### View Bookings for My Event

```bash
curl -X GET http://localhost:3000/event/events/event123/bookings \
  -H "Authorization: Bearer creator-token"
```

---

### 3. Admin Operations

#### View All Users

```bash
curl -X GET http://localhost:3000/user/users \
  -H "Authorization: Bearer admin-token"
```

#### Update User Role

```bash
curl -X PATCH http://localhost:3000/user/users/user123/role \
  -H "Authorization: Bearer admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "creator"
  }'
```

#### Delete User

```bash
curl -X DELETE http://localhost:3000/user/users/user123 \
  -H "Authorization: Bearer admin-token"
```

#### View All Bookings

```bash
curl -X GET http://localhost:3000/booking/admin/bookings \
  -H "Authorization: Bearer admin-token"
```

#### Cancel Any Booking

```bash
curl -X DELETE http://localhost:3000/booking/admin/bookings/booking456 \
  -H "Authorization: Bearer admin-token"
```

---

## Public Endpoints (No Auth Required)

### View All Events

```bash
curl -X GET http://localhost:3000/event/events
```

### View Specific Event

```bash
curl -X GET http://localhost:3000/event/events/event123
```

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## Expected Error Responses

### 401 - No Authorization Header

```bash
curl -X GET http://localhost:3000/user/profile
```

Response:

```json
{
  "error": "Authentication required"
}
```

### 403 - Insufficient Permissions

Try to access admin endpoint as normal user:

```bash
curl -X GET http://localhost:3000/user/users \
  -H "Authorization: Bearer user-token"
```

Response:

```json
{
  "error": "Access denied. Insufficient permissions."
}
```

---

## Testing Workflow

1. **Start the server**

   ```bash
   npm run dev
   ```

2. **Test public endpoints** (no auth)

   - GET /event/events
   - GET /event/events/:eventId
   - POST /auth/register
   - POST /auth/login

3. **Test user endpoints** (requires auth, any role)

   - GET /user/profile
   - POST /booking/bookings
   - GET /booking/bookings

4. **Test creator endpoints** (requires creator or admin role)

   - POST /event/events
   - GET /event/my-events
   - PUT /event/events/:eventId
   - GET /event/events/:eventId/bookings

5. **Test admin endpoints** (requires admin role)
   - GET /user/users
   - DELETE /user/users/:userId
   - PATCH /user/users/:userId/role

---

## Postman Collection

Consider creating a Postman collection with:

- Environment variables for different user tokens
- Pre-configured requests for each endpoint
- Test scripts to verify responses

---

## Next Implementation Steps

1. **Add JWT Authentication**

   ```bash
   npm install jsonwebtoken bcrypt
   ```

2. **Add Database**

   ```bash
   npm install mongoose  # for MongoDB
   # or
   npm install pg sequelize  # for PostgreSQL
   ```

3. **Add Validation**

   ```bash
   npm install express-validator
   ```

4. **Add Environment Variables**

   ```bash
   npm install dotenv
   ```

5. **Add Security**
   ```bash
   npm install helmet cors express-rate-limit
   ```
