# Quickstart: Add User Time Deposit

**Branch**: `001-user-time-deposit`  
**Date**: 2026-02-17  
**Spec**: `C:\Projects\companyprojects\inspireadmin2\specs\001-user-time-deposit\spec.md`

## Prerequisites

- Node.js 18+ installed
- Firestore project access via Firebase Admin SDK service account credentials

## Backend (Express API)

**Location**: `C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend\`

1. Configure environment variables (example keys, do not commit secrets):

```env
PORT=4000
NODE_ENV=development

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

2. Start the API:

```powershell
cd C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend
npm install
npm run dev
```

The API should be reachable at `http://localhost:4000/api/health`.

## Frontend (Next.js Admin)

**Location**: `C:\Projects\companyprojects\inspireadmin2\`

1. Set the API base URL:

```env
NEXT_PUBLIC_LOCAL_API_URL=http://localhost:4000
```

2. Start the app:

```powershell
cd C:\Projects\companyprojects\inspireadmin2
npm install
npm run dev
```

## Seed Rate Configuration (Firestore)

Preferred option (script):

```powershell
cd C:\Projects\companyprojects\inspireadmin2\inspirewalletadmin_backend
npm run seed:investment-rates
```

Fallback option (manual): create a document at `investmentRates/default` with the tier-based shape used for interpolation:

```json
{
  "sixMonths": { "0": 2.5, "50000": 3.0, "100000": 3.5 },
  "oneYear": { "0": 5.0, "50000": 6.0, "100000": 7.0 },
  "twoYears": { "50000": 8.0, "100000": 9.0 },
  "agentRates": { "0": 5.0, "50000": 6.0, "100000": 7.0 }
}
```

Notes:

- Keys must be numeric (stored as strings in Firestore maps).
- Rates are percent values.

## Required Env/CORS Notes

- Ensure `NEXT_PUBLIC_LOCAL_API_URL` points to the running backend (default `http://localhost:4000`).
- Ensure backend `CORS_ORIGINS` (or `CORS_DEV_ORIGINS`) includes your frontend origin when not using defaults.
- The new create endpoint supports and echoes `X-Request-Id`; keep this header allowed in CORS.

## Manual API Test (Quote + Create)

1. Quote (preview) - replace `$TOKEN`:

```powershell
$TOKEN = "<admin-jwt>"
curl -Method POST "http://localhost:4000/api/time-deposits/quote" `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json" } `
  -Body '{ "amount": 75000, "term": "oneYear" }'
```

2. Create time deposit - replace `$TOKEN` and `$USER_ID`:

```powershell
$TOKEN = "<admin-jwt>"
$USER_ID = "<firebase-uid>"
$REQUEST_ID = [guid]::NewGuid().ToString()

curl -Method POST "http://localhost:4000/api/firebase-users/$USER_ID/time-deposits" `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json"; "X-Request-Id" = $REQUEST_ID } `
  -Body '{ "amount": 75000, "term": "oneYear", "initialDate": "2026-02-17" }'
```

Optional (referral + contract):

```powershell
$TOKEN = "<admin-jwt>"
$USER_ID = "<firebase-uid>"
$REFERRER_ID = "<referrer-firebase-uid>"
$REQUEST_ID = [guid]::NewGuid().ToString()

curl -Method POST "http://localhost:4000/api/firebase-users/$USER_ID/time-deposits" `
  -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json"; "X-Request-Id" = $REQUEST_ID } `
  -Body "{ `"amount`": 75000, `"term`": `"oneYear`", `"initialDate`": `"2026-02-17`", `"referral`": { `"referrerUserId`": `"$REFERRER_ID`", `"commissionPercentage`": 5, `"mode`": `"manual`" }, `"contract`": { `"enabled`": true, `"strict`": false } }"
```
