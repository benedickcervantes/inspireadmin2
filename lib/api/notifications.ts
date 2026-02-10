import { API_BASE_URL } from "./client";

export interface SendNotificationPayload {
  title: string;
  description: string;
  sendToAll?: boolean;
  userIds?: string[];
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
}

/**
 * Send push notification to users
 */
export async function sendPushNotification(
  payload: SendNotificationPayload
): Promise<NotificationResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

/**
 * Get notification history
 */
export async function getNotificationHistory(page = 1, limit = 50) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notification history");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notification history:", error);
    throw error;
  }
}
