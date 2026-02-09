# Demo and Test Accounts Implementation

## Overview
This document describes the changes made to enable proper filtering and display of demo and test accounts in the user management system.

## Problem
Demo and test accounts were not appearing correctly when clicking their respective tabs in the user list. The accounts existed in the database but were scattered across different pages or not showing at all.

## Root Cause
1. **Validation Schema Missing Parameters**: The backend validation schema was stripping out `isDummyAccount` and `accountType` query parameters
2. **Client-Side Filtering**: The frontend was filtering data client-side after receiving all users, which didn't work with pagination
3. **Caching Issues**: Browser was caching API responses with 304 status codes

## Solution

### Backend Changes

#### 1. Validation Schema (`inspirewalletadmin_backend/validation/schemas.js`)
**Added missing query parameters to allow filtering:**

```javascript
const userListQuerySchema = z.object({
    page: numericQuery(1, 100000),
    limit: numericQuery(1, 100),
    search: optionalTrimmed(120),
    status: optionalTrimmed(40),
    kycStatus: optionalTrimmed(40),
    agent: z.preprocess(booleanQuery, z.boolean().optional()),
    isDummyAccount: z.preprocess(booleanQuery, z.boolean().optional()),  // ✅ ADDED
    accountType: optionalTrimmed(40),                                      // ✅ ADDED
    sortBy: z.enum(['createdAt', 'lastLogin', 'lastSignedIn', 'emailAddress', 'accountNumber']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});
```

#### 2. Firebase User Controller (`inspirewalletadmin_backend/controllers/firebaseUserController.js`)

**Added filter support in `applyFilters` function:**

```javascript
const applyFilters = (users, { search, status, kycStatus, agent, isDummyAccount, accountType }) => {
    let filtered = users;

    // ... existing filters ...

    // Filter for demo accounts (isDummyAccount field)
    if (isDummyAccount === 'true' || isDummyAccount === true) {
        filtered = filtered.filter((user) => user.isDummyAccount === true);
    } else if (isDummyAccount === 'false' || isDummyAccount === false) {
        filtered = filtered.filter((user) => user.isDummyAccount !== true);
    }

    // Filter for test accounts (isTestAccount field)
    if (accountType === 'test') {
        filtered = filtered.filter((user) => user.isTestAccount === true);
    }

    // ... rest of filters ...

    return filtered;
};
```

**Updated `getAllUsers` to handle new parameters:**

```javascript
async getAllUsers(req, res) {
    const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        kycStatus = '',
        agent,
        isDummyAccount,      // ✅ ADDED
        accountType,         // ✅ ADDED
        sortBy = DEFAULT_SORT_BY,
        sortOrder = 'desc'
    } = req.query;

    // Convert string booleans to actual booleans
    const agentFilter = agent === 'true' ? true : agent === 'false' ? false : agent;
    const isDummyAccountFilter = isDummyAccount === 'true' ? true : isDummyAccount === 'false' ? false : isDummyAccount;
    
    const hasFilters = Boolean(
        search || 
        status || 
        kycStatus || 
        typeof agentFilter === 'boolean' || 
        typeof isDummyAccountFilter === 'boolean' ||  // ✅ ADDED
        accountType                                    // ✅ ADDED
    );

    if (hasFilters) {
        const snapshot = await collectionRef.get();
        const users = snapshot.docs.map(normalizeUserDoc);
        const filteredUsers = applyFilters(users, { 
            search, 
            status, 
            kycStatus, 
            agent: agentFilter, 
            isDummyAccount: isDummyAccountFilter,  // ✅ ADDED
            accountType                            // ✅ ADDED
        });
        // ... rest of logic
    }
}
```

#### 3. User Controller (`inspirewalletadmin_backend/controllers/userController.js`)

**Added same filtering logic for consistency:**

```javascript
async getAllUsers(req, res) {
    const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        kycStatus = '',
        agent,
        isDummyAccount,      // ✅ ADDED
        accountType,         // ✅ ADDED
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (kycStatus) filter.kycStatus = kycStatus;
    if (agent === 'true') filter.agent = true;
    if (agent === 'false') filter.agent = false;
    if (isDummyAccount === 'true') filter.isDummyAccount = true;      // ✅ ADDED
    if (isDummyAccount === 'false') filter.isDummyAccount = false;    // ✅ ADDED

    let users = await User.findMany(filter);

    // Apply test account filter in memory
    if (accountType === 'test') {                                     // ✅ ADDED
        users = users.filter(user => user.isTestAccount === true);
    }
    
    // ... rest of logic
}
```

### Frontend Changes

#### 1. User Table Component (`inspireadminv2/app/(dashboard)/users/_components/UserTable.tsx`)

**Updated `userTypeToParams` to send correct filter parameters:**

```typescript
function userTypeToParams(userType: UserTypeTab): { 
    agent?: boolean; 
    accountType?: string; 
    isDummyAccount?: boolean 
} {
    if (userType === 'all') return {};
    if (userType === 'agent') return { agent: true };
    if (userType === 'demo') return { isDummyAccount: true };  // ✅ CHANGED from {}
    if (userType === 'test') return { accountType: 'test' };   // ✅ CHANGED from {}
    return { agent: false };
}
```

**Removed client-side filtering (now handled by API):**

```typescript
// BEFORE:
const rawUsers = (data?.data?.users ?? []) as User[];
const users = filterUsersByType(rawUsers, userType);  // ❌ Client-side filtering

// AFTER:
const rawUsers = (data?.data?.users ?? []) as User[];
const users = rawUsers;  // ✅ Use API-filtered data directly
```

**Why this change was necessary:**

The old approach had a critical flaw with pagination:

1. **Old Flow (Client-Side Filtering)**:
   - Frontend requests: "Give me page 1 with 20 users"
   - Backend returns: 20 random users (not filtered)
   - Frontend filters: "Show only demo accounts from these 20 users"
   - **Problem**: If none of those 20 users are demo accounts, page appears empty!
   - Demo accounts might be on page 4, 5, or scattered across pages

2. **New Flow (Server-Side Filtering)**:
   - Frontend requests: "Give me page 1 with 20 demo accounts" (`isDummyAccount=true`)
   - Backend filters first: Finds ALL demo accounts in database
   - Backend paginates: Returns first 20 demo accounts
   - Frontend displays: All 20 users shown are guaranteed to be demo accounts
   - **Result**: Demo accounts properly appear on page 1, paginated correctly

**Example Scenario:**

Imagine you have 1000 users total, with 50 demo accounts scattered throughout:

```
Old Way (Client-Side):
- Request page 1 → Get users 1-20 → Filter → Maybe 0-2 demo accounts shown
- Request page 2 → Get users 21-40 → Filter → Maybe 1-3 demo accounts shown
- Demo accounts appear randomly across many pages

New Way (Server-Side):
- Request page 1 → Backend finds all 50 demo accounts → Returns demo accounts 1-20
- Request page 2 → Backend finds all 50 demo accounts → Returns demo accounts 21-40
- Request page 3 → Backend finds all 50 demo accounts → Returns demo accounts 41-50
- All demo accounts properly organized in 3 pages
```

**Code Explanation:**

```typescript
const rawUsers = (data?.data?.users ?? []) as User[];
```

This line extracts the user array from the API response:
- `data?.data?.users` - Safely access nested API response structure
- `?? []` - If undefined/null, use empty array as fallback
- `as User[]` - TypeScript type assertion for type safety

Since the API now returns pre-filtered data, we don't need the `filterUsersByType()` function anymore - the backend already did the filtering!

**Updated badge display logic:**

```typescript
const isDemo = rowData.isDummyAccount === true;
const isTest = (rowData as any).isTestAccount === true;
```

#### 2. Firebase Users API (`inspireadminv2/lib/api/firebaseUsers.ts`)

**Added cache-busting timestamp:**

```typescript
const buildQueryString = (params: GetUsersParams): string => {
    const queryParams = new URLSearchParams();
    // ... existing parameters ...
    if (params.isDummyAccount === true) queryParams.append("isDummyAccount", "true");
    if (params.isDummyAccount === false) queryParams.append("isDummyAccount", "false");
    // Add timestamp to prevent caching
    queryParams.append("_t", Date.now().toString());  // ✅ ADDED
    return queryParams.toString();
};
```

## Database Fields

The system identifies demo and test accounts using these Firestore fields:

- **Demo Accounts**: `isDummyAccount: true`
- **Test Accounts**: `isTestAccount: true`

## How It Works

1. **User clicks Demo tab** → Frontend sends `isDummyAccount=true` parameter
2. **Backend receives request** → Validation schema allows the parameter through
3. **Controller filters data** → Only users with `isDummyAccount === true` are returned
4. **Frontend displays results** → Paginated demo accounts are shown

Same flow applies for Test accounts using `accountType=test` and `isTestAccount` field.

## Testing

To verify the implementation:

1. **Demo Accounts Tab**: Click the "Demo Account" tab - should show only users with `isDummyAccount: true`
2. **Test Accounts Tab**: Click the "Test Account" tab - should show only users with `isTestAccount: true`
3. **Pagination**: Navigate through pages - demo/test accounts should be properly paginated
4. **Search**: Search within demo/test tabs - filtering should work correctly

## Notes

- The old version (inspireadmin v1) was not modified - it uses direct Firestore access and client-side filtering
- Cache-busting timestamp ensures fresh data on each request
- Both `/api/users` and `/api/firebase-users` endpoints support the new filters
- Validation middleware was the key blocker - it was silently removing the filter parameters

## Related Files

### Backend
- `inspirewalletadmin_backend/validation/schemas.js`
- `inspirewalletadmin_backend/controllers/firebaseUserController.js`
- `inspirewalletadmin_backend/controllers/userController.js`

### Frontend
- `inspireadminv2/app/(dashboard)/users/_components/UserTable.tsx`
- `inspireadminv2/lib/api/firebaseUsers.ts`
