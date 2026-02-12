import { API_BASE_URL } from "./client";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const authHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface MaintenanceMode {
  isEnabled: boolean;
  message: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface AppSettings {
  about?: boolean;
  agentdashboard?: boolean;
  agentrequest?: boolean;
  bdo?: boolean;
  buycards?: boolean;
  crypto?: boolean;
  depositcrypto?: boolean;
  helpcenter?: boolean;
  inspirecards?: boolean;
  inspiresecuregrowth?: boolean;
  inspireauto?: boolean;
  maya?: boolean;
  passcode?: boolean;
  privacy?: boolean;
  specialcampaign?: boolean;
  stockholder?: boolean;
  termsandcondition?: boolean;
  transfer?: boolean;
  travel?: boolean;
  [key: string]: boolean | string | undefined;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  imageUrl: string;
  postedBy?: string;
  postedAt?: string;
  status: boolean;
}

export interface PushNotificationResult {
  successfulSends: number;
  failedSends: number;
  totalUsers: number;
}

// Maintenance Mode APIs
export async function getMaintenanceMode(): Promise<MaintenanceMode> {
  const response = await fetch(`${API_BASE_URL}/api/settings/maintenance`, {
    method: "GET",
    headers: authHeaders(),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch maintenance mode");
  }

  return result.data;
}

export async function updateMaintenanceMode(
  isEnabled: boolean,
  message: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/settings/maintenance`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ isEnabled, message }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update maintenance mode");
  }
}

// App Settings APIs
export async function getAppSettings(): Promise<AppSettings> {
  const response = await fetch(`${API_BASE_URL}/api/settings/app-settings`, {
    method: "GET",
    headers: authHeaders(),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch app settings");
  }

  return result.data;
}

export async function updateAppSettings(
  settings: Partial<AppSettings>
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/settings/app-settings`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(settings),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update app settings");
  }
}

// Events APIs
export async function getLatestEvent(): Promise<Event | null> {
  const response = await fetch(`${API_BASE_URL}/api/settings/events/latest`, {
    method: "GET",
    headers: authHeaders(),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch latest event");
  }

  return result.data;
}

export async function postEvent(eventData: {
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  imageUrl: string;
}): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/api/settings/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(eventData),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to post event");
  }

  return result.data;
}

export async function updateEventStatus(
  eventId: string,
  status: boolean
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/settings/events/${eventId}/status`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update event status");
  }
}

// Push Notifications API
export async function sendPushNotification(
  title: string,
  message: string
): Promise<PushNotificationResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/settings/push-notifications`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, message }),
    }
  );

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to send push notification");
  }

  return result.data;
}
