# 📁 Inspire Admin - Quick Folder Reference

## Current Structure

```
inspireadmin/
├── app/
│   ├── (dashboard)/                    # Route group with sidebar/header
│   │   ├── layout.tsx                  # Dashboard layout
│   │   ├── dashboard/                  # Dashboard page
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── Charts.tsx
│   │   │       ├── StatsCard.tsx
│   │   │       └── TransactionTable.tsx
│   │   └── users/                      # Users page
│   │       ├── page.tsx
│   │       └── _components/
│   │           ├── UserFilters.tsx
│   │           ├── UserHeader.tsx
│   │           └── UserTable.tsx
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Root (redirects to /dashboard)
│   └── globals.css
│
├── components/                         # Shared components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── ui/                            # Reusable UI components
│   ├── forms/                         # Form components
│   └── common/                        # Common components
│
├── lib/                               # Utilities
│   ├── api/
│   │   └── client.ts
│   ├── constants/
│   │   └── routes.ts
│   └── utils/
│       ├── formatters.ts
│       └── mock.ts
│
├── types/
│   └── index.ts
│
├── hooks/                             # Custom hooks
├── contexts/                          # React contexts
└── public/                            # Static files
```

## Where to Put Things

### 🎯 New Page
```
app/(dashboard)/[page-name]/
├── page.tsx
└── _components/
    └── [PageComponents].tsx
```

### 🧩 Shared Component
```
components/[category]/
└── [ComponentName].tsx
```

### 🔧 Utility Function
```
lib/utils/
└── [utilityName].ts
```

### 📡 API Related
```
lib/api/
└── [apiName].ts
```

### 🎨 TypeScript Types
```
types/
└── [typeName].ts
```

### 🪝 Custom Hook
```
hooks/
└── use[HookName].ts
```

## Import Examples

```tsx
// Shared layout component
import { AppShell } from "@/components/layout/AppShell";

// Shared UI component
import { Button } from "@/components/ui/Button";

// Page-specific component
import UserTable from "./_components/UserTable";

// Utility
import { formatCurrency } from "@/lib/utils/formatters";

// Type
import type { User } from "@/types";

// Hook
import { useAuth } from "@/hooks/useAuth";

// Constant
import { ROUTES } from "@/lib/constants/routes";
```

## Routes

| Path | Page | Layout |
|------|------|--------|
| `/` | Redirects to `/dashboard` | Root |
| `/dashboard` | Dashboard | AppShell |
| `/users` | Users List | AppShell |

## Path Aliases

- `@/*` → Root directory
- `@/components/*` → `components/`
- `@/lib/*` → `lib/`
- `@/types/*` → `types/`
- `@/hooks/*` → `hooks/`
- `@/contexts/*` → `contexts/`

---

**Pro Tip:** Page-specific components use `_components/` folder (underscore prevents Next.js from treating them as routes)
