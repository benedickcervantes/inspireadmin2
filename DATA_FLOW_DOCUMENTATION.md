# Data Flow: Fetching Different Account Types

## Overview
This document explains the complete data flow when fetching different types of accounts (All, Agents, Investors, Demo, Test) from the frontend through the backend to Firebase and back.

---

## 🔄 Complete Data Flow

### Example: Fetching Demo Accounts

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                               │
│                     inspireadminv2/app/(dashboard)/users                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1. User clicks "Demo Account" tab
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  UserTable.tsx                                                           │
│  ─────────────────────────────────────────────────────────────────────  │
│  const filterParams = userTypeToParams('demo')                          │
│  // Returns: { isDummyAccount: true }                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 2. React Query triggers API call
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  lib/api/firebaseUsers.ts                                               │
│  ─────────────────────────────────────────────────────────────────────  │
│  getFirebaseUsers({                                                     │
│    page: 1,                                                             │
│    limit: 20,                                                           │
│    isDummyAccount: true,  ← Filter parameter                           │
│    sortBy: 'createdAt',                                                 │
│    sortOrder: 'desc'                                                    │
│  })                                                                     │
│                                                                         │
│  Builds URL:                                                            │
│  http://localhost:4000/api/firebase-users?page=1&limit=20              │
│    &isDummyAccount=true&sortBy=createdAt&sortOrder=desc&_t=1234567890  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 3. HTTP GET Request
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                                  │
│              inspirewalletadmin_backend/server.js                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 4. Request passes through middleware
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Middleware Chain                                                        │
│  ─────────────────────────────────────────────────────────────────────  │
│  1. CORS          → Check origin allowed                                │
│  2. Auth          → Verify JWT token                                    │
│  3. Validation    → Validate query params (schemas.js)                  │
│     ✓ isDummyAccount: true is allowed                                   │
│  4. Rate Limiter  → Check request limits                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 5. Route to controller
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  routes/index.js                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│  router.use('/firebase-users', firebaseUserRoutes)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 6. Handle GET request
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  controllers/firebaseUserController.js                                   │
│  ─────────────────────────────────────────────────────────────────────  │
│  async getAllUsers(req, res) {                                          │
│    const { isDummyAccount, page, limit, ... } = req.query              │
│                                                                         │
│    // Convert string to boolean                                         │
│    const isDummyAccountFilter = isDummyAccount === 'true' ? true : ... │
│                                                                         │
│    // Check if filtering is needed                                      │
│    const hasFilters = Boolean(isDummyAccountFilter || ...)             │
│  }                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 7. Query Firestore
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FIREBASE (Firestore)                             │
│                    Google Cloud Firestore Database                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 8. Fetch ALL users from 'users' collection
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  const collectionRef = db.collection('users')                           │
│  const snapshot = await collectionRef.get()                             │
│                                                                         │
│  Returns ALL documents:                                                 │
│  [                                                                      │
│    { id: '1', firstName: 'John', isDummyAccount: false, ... },         │
│    { id: '2', firstName: 'Demo1', isDummyAccount: true, ... },  ✓      │
│    { id: '3', firstName: 'Jane', isDummyAccount: false, ... },         │
│    { id: '4', firstName: 'Demo2', isDummyAccount: true, ... },  ✓      │
│    { id: '5', firstName: 'Bob', isDummyAccount: false, ... },          │
│    ... (644 total users)                                                │
│  ]                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 9. Data returns to backend
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  controllers/firebaseUserController.js (continued)                       │
│  ─────────────────────────────────────────────────────────────────────  │
│  // Normalize documents                                                 │
│  const users = snapshot.docs.map(normalizeUserDoc)                     │
│  // 644 users                                                           │
│                                                                         │
│  // Apply filters IN MEMORY                                             │
│  const filteredUsers = applyFilters(users, {                           │
│    isDummyAccount: true  ← Filter here!                                │
│  })                                                                     │
│  // Now only 50 demo users                                             │
│                                                                         │
│  // Sort the filtered users                                             │
│  const sortedUsers = sortUsers(filteredUsers, 'createdAt', 'desc')    │
│                                                                         │
│  // Apply pagination                                                    │
│  const skip = (1 - 1) * 20 = 0                                         │
│  const pagedUsers = sortedUsers.slice(0, 20)                           │
│  // Returns first 20 demo users                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 10. Build response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Response JSON:                                                          │
│  {                                                                       │
│    "success": true,                                                     │
│    "data": {                                                            │
│      "users": [                                                         │
│        { "_id": "2", "firstName": "Demo1", "isDummyAccount": true },   │
│        { "_id": "4", "firstName": "Demo2", "isDummyAccount": true },   │
│        ... (20 demo users)                                              │
│      ],                                                                 │
│      "pagination": {                                                    │
│        "total": 50,        ← Total demo accounts                       │
│        "page": 1,                                                       │
│        "limit": 20,                                                     │
│        "totalPages": 3     ← 50 / 20 = 3 pages                         │
│      }                                                                  │
│    }                                                                    │
│  }                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 11. HTTP Response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                               │
│                     lib/api/firebaseUsers.ts                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 12. Parse response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  const payload = await response.json()                                  │
│  return payload  // Returns to React Query                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 13. React Query caches and provides data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  UserTable.tsx                                                           │
│  ─────────────────────────────────────────────────────────────────────  │
│  const { data } = useQuery({ ... })                                    │
│                                                                         │
│  const rawUsers = data?.data?.users ?? []                              │
│  // rawUsers = [20 demo accounts]                                       │
│                                                                         │
│  const users = rawUsers                                                 │
│  const total = data?.data?.pagination.total  // 50                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 14. Render UI
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  <Table data={users} />                                                 │
│  <Pagination total={50} currentPage={1} />                             │
│                                                                         │
│  Displays:                                                              │
│  ┌──────────────────────────────────────────┐                          │
│  │ Demo Account (50)                        │                          │
│  ├──────────────────────────────────────────┤                          │
│  │ Demo1  | demo1@test.com  | Active        │                          │
│  │ Demo2  | demo2@test.com  | Active        │                          │
│  │ ...    | ...              | ...           │                          │
│  │ (20 rows shown)                          │                          │
│  ├──────────────────────────────────────────┤                          │
│  │ Page 1 of 3                              │                          │
│  └──────────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparison: Different Account Types

### 1. **All Accounts**
```
Frontend: userType = 'all'
  ↓
filterParams = {}  (no filters)
  ↓
API: GET /api/firebase-users?page=1&limit=20
  ↓
Backend: No filtering, returns first 20 users
  ↓
Result: Shows all types mixed (agents, investors, demo, test)
```

### 2. **Agents Only**
```
Frontend: userType = 'agent'
  ↓
filterParams = { agent: true }
  ↓
API: GET /api/firebase-users?page=1&limit=20&agent=true
  ↓
Backend: Filters where user.agent === true
  ↓
Firestore: Fetches all 644 users
  ↓
Backend: Filters in memory → 170 agents found
  ↓
Backend: Returns first 20 agents
  ↓
Result: Shows only agents (page 1 of 9)
```

### 3. **Investors Only**
```
Frontend: userType = 'investor'
  ↓
filterParams = { agent: false }
  ↓
API: GET /api/firebase-users?page=1&limit=20&agent=false
  ↓
Backend: Filters where user.agent === false
  ↓
Firestore: Fetches all 644 users
  ↓
Backend: Filters in memory → 474 investors found
  ↓
Backend: Returns first 20 investors
  ↓
Result: Shows only investors (page 1 of 24)
```

### 4. **Demo Accounts**
```
Frontend: userType = 'demo'
  ↓
filterParams = { isDummyAccount: true }
  ↓
API: GET /api/firebase-users?page=1&limit=20&isDummyAccount=true
  ↓
Backend: Filters where user.isDummyAccount === true
  ↓
Firestore: Fetches all 644 users
  ↓
Backend: Filters in memory → 50 demo accounts found
  ↓
Backend: Returns first 20 demo accounts
  ↓
Result: Shows only demo accounts (page 1 of 3)
```

### 5. **Test Accounts**
```
Frontend: userType = 'test'
  ↓
filterParams = { accountType: 'test' }
  ↓
API: GET /api/firebase-users?page=1&limit=20&accountType=test
  ↓
Backend: Filters where user.isTestAccount === true
  ↓
Firestore: Fetches all 644 users
  ↓
Backend: Filters in memory → 10 test accounts found
  ↓
Backend: Returns first 10 test accounts
  ↓
Result: Shows only test accounts (page 1 of 1)
```

---

## 🔑 Key Points

### Why Fetch ALL Users from Firestore?

Firestore doesn't support complex OR queries or multiple field filters efficiently, so:

1. **Backend fetches ALL users** from Firestore in one query
2. **Filters in memory** (JavaScript) - very fast for 644 users
3. **Sorts in memory** - by createdAt, lastLogin, etc.
4. **Paginates in memory** - returns only requested page

**Performance**: For 644 users, this is fast (~1-2 seconds). For 100,000+ users, you'd need a different approach.

### Filter Locations

| Filter Type | Where Applied | Why |
|------------|---------------|-----|
| `agent: true/false` | Backend (memory) | Simple boolean check |
| `isDummyAccount: true` | Backend (memory) | Simple boolean check |
| `accountType: 'test'` | Backend (memory) | Checks `isTestAccount` field |
| `search: "john"` | Backend (memory) | Regex search across multiple fields |
| `sortBy: "createdAt"` | Backend (memory) | JavaScript array sort |
| Pagination | Backend (memory) | Array slice |

### Caching Strategy

**React Query** caches responses:
- `['firebase-users', { page: 1, isDummyAccount: true }]` → Cached for 5 minutes
- `['firebase-users', { page: 2, isDummyAccount: true }]` → Different cache key
- Switching tabs triggers new API call (different cache key)

---

## 🐛 Common Issues

### Issue 1: Empty Results
**Symptom**: Click Demo tab, no users shown
**Cause**: Validation schema stripped `isDummyAccount` parameter
**Fix**: Added `isDummyAccount` to `userListQuerySchema`

### Issue 2: Wrong Users Shown
**Symptom**: Demo tab shows agents/investors
**Cause**: Client-side filtering after pagination
**Fix**: Removed client-side `filterUsersByType()`, use API filtering

### Issue 3: Cached Old Data
**Symptom**: Changes not reflected, 304 responses
**Cause**: Browser HTTP cache
**Fix**: Added `_t` timestamp to URL for cache-busting

---

## 📁 Related Files

### Frontend
- `inspireadminv2/app/(dashboard)/users/_components/UserTable.tsx` - Main component
- `inspireadminv2/lib/api/firebaseUsers.ts` - API client
- `inspireadminv2/lib/api/users.ts` - Type definitions

### Backend
- `inspirewalletadmin_backend/server.js` - Express server
- `inspirewalletadmin_backend/routes/index.js` - Route definitions
- `inspirewalletadmin_backend/controllers/firebaseUserController.js` - Request handler
- `inspirewalletadmin_backend/validation/schemas.js` - Request validation
- `inspirewalletadmin_backend/config/firebase.js` - Firestore connection

### Database
- Firebase Firestore collection: `users`
- Fields: `isDummyAccount`, `isTestAccount`, `agent`, `accountType`
