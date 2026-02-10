"use client";

import { useState, useEffect } from "react";
import { Message, toaster } from "rsuite";
import SettingsHeader from "./_components/SettingsHeader";
import SettingsGrid from "./_components/SettingsGrid";
import ChangeUsernameModal from "./_components/ChangeUsernameModal";
import ChangeEmailModal from "./_components/ChangeEmailModal";
import ChangePasswordModal from "./_components/ChangePasswordModal";
import PasswordVerificationModal from "./_components/PasswordVerificationModal";
import InvestmentRateSec, { InvestmentRates } from "./_components/InvestmentRateSec";
import CustomPushNotif from "./_components/CustomPushNotif";
import EmailPasswordReset from "./_components/EmailPasswordReset";
import MaintenanceMode from "./_components/MaintenanceMode";
import CustomEvents from "./_components/CustomEvents";
import { 
  updateAdminUsername, 
  updateAdminEmail, 
  updateAdminPassword, 
  updateInvestmentRates 
} from "@/lib/api/adminSettings";

export default function SettingsPage() {
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordVerifyOpen, setIsPasswordVerifyOpen] = useState(false);
  const [isInvestmentRateOpen, setIsInvestmentRateOpen] = useState(false);
  const [isPushNotifOpen, setIsPushNotifOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isMaintenanceModeOpen, setIsMaintenanceModeOpen] = useState(false);
  const [isCustomEventsOpen, setIsCustomEventsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  
  // Initialize username from localStorage
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminUsername") || "Admin User";
    }
    return "Admin User";
  });
  
  // Initialize email from localStorage
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("adminEmail");
      if (savedEmail) return savedEmail;
      
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        try {
          const user = JSON.parse(authUser);
          return user.emailAddress || "admin@example.com";
        } catch (error) {
          console.error("Failed to parse auth user:", error);
        }
      }
    }
    return "admin@example.com";
  });

  useEffect(() => {
    // Update email if authUser changes
    if (typeof window !== "undefined") {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        try {
          const user = JSON.parse(authUser);
          if (user.emailAddress && !localStorage.getItem("adminEmail")) {
            setEmail(user.emailAddress);
          }
        } catch (error) {
          console.error("Failed to parse auth user:", error);
        }
      }
    }
  }, []);

  const handleCardClick = (settingId: string) => {
    if (settingId === "1") {
      setIsUsernameModalOpen(true);
    } else if (settingId === "2") {
      setIsEmailModalOpen(true);
    } else if (settingId === "3") {
      setIsPasswordModalOpen(true);
    } else if (settingId === "4") {
      // Require password verification for investment rates
      setPendingAction("investmentRate");
      setIsPasswordVerifyOpen(true);
    } else if (settingId === "5") {
      setIsPushNotifOpen(true);
    } else if (settingId === "6") {
      setIsPasswordResetOpen(true);
    } else if (settingId === "7") {
      setIsMaintenanceModeOpen(true);
    } else if (settingId === "8") {
      setIsCustomEventsOpen(true);
    }
  };

  const handlePasswordVerify = async (password: string): Promise<boolean> => {
    // Verify password
    const storedPassword = localStorage.getItem("adminPassword");
    
    // If no password is set, allow access (first time)
    if (!storedPassword) {
      // Open the requested modal
      if (pendingAction === "investmentRate") {
        setIsInvestmentRateOpen(true);
      }
      setPendingAction(null);
      return true;
    }
    
    // Check if password matches
    if (storedPassword === password) {
      // Open the requested modal
      if (pendingAction === "investmentRate") {
        setIsInvestmentRateOpen(true);
      }
      setPendingAction(null);
      return true;
    }
    
    return false;
  };

  const handleSaveInvestmentRates = async (rates: InvestmentRates) => {
    try {
      // Call API to update investment rates in backend
      await updateInvestmentRates(rates);
      
      // Save to localStorage as cache
      localStorage.setItem("investmentRates", JSON.stringify(rates));
      
      // Show success message
      toaster.push(
        <Message showIcon type="success" closable>
          Investment rates updated successfully!
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update investment rates";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    }
  };

  const handleSaveUsername = async (newUsername: string) => {
    try {
      // Call API to update username in backend
      await updateAdminUsername(newUsername);
      
      setUsername(newUsername);
      // Store in localStorage as cache
      if (typeof window !== "undefined") {
        localStorage.setItem("adminUsername", newUsername);
        // Dispatch custom event to notify AppShell
        window.dispatchEvent(new Event("usernameChanged"));
      }
      
      toaster.push(
        <Message showIcon type="success" closable>
          Username updated successfully!
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update username";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    }
  };

  const handleSaveEmail = async (newEmail: string) => {
    try {
      // Call API to update email in backend
      await updateAdminEmail(newEmail);
      
      setEmail(newEmail);
      // Store in localStorage as cache
      if (typeof window !== "undefined") {
        localStorage.setItem("adminEmail", newEmail);
        // Update authUser in localStorage
        const authUser = localStorage.getItem("authUser");
        if (authUser) {
          try {
            const user = JSON.parse(authUser);
            user.emailAddress = newEmail;
            localStorage.setItem("authUser", JSON.stringify(user));
          } catch (error) {
            console.error("Failed to update auth user:", error);
          }
        }
        // Dispatch custom event to notify AppShell
        window.dispatchEvent(new Event("emailChanged"));
      }
      
      toaster.push(
        <Message showIcon type="success" closable>
          Email updated successfully!
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update email";
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
    }
  };

  const handleSavePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Call API to update password in backend
      await updateAdminPassword(currentPassword, newPassword);
      
      // Save new password locally as cache
      localStorage.setItem("adminPassword", newPassword);
      
      // Show success message
      toaster.push(
        <Message showIcon type="success" closable>
          Password changed successfully!
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password";
      
      // Check if it's an incorrect password error
      if (errorMessage.includes("incorrect") || errorMessage.includes("invalid")) {
        return false; // This will show "Current password is incorrect" in the modal
      }
      
      // Show other errors as toast
      toaster.push(
        <Message showIcon type="error" closable>
          {errorMessage}
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      
      return false;
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <SettingsHeader />
      <SettingsGrid onCardClick={handleCardClick} currentEmail={email} />
      <ChangeUsernameModal
        open={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        currentUsername={username}
        onSave={handleSaveUsername}
      />
      <ChangeEmailModal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={email}
        onSave={handleSaveEmail}
      />
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
      <PasswordVerificationModal
        open={isPasswordVerifyOpen}
        onClose={() => {
          setIsPasswordVerifyOpen(false);
          setPendingAction(null);
        }}
        onVerify={handlePasswordVerify}
        title="Security Verification"
        description="This action requires password verification"
      />
      <InvestmentRateSec
        open={isInvestmentRateOpen}
        onClose={() => setIsInvestmentRateOpen(false)}
        onSave={handleSaveInvestmentRates}
      />
      <CustomPushNotif
        open={isPushNotifOpen}
        onClose={() => setIsPushNotifOpen(false)}
      />
      <EmailPasswordReset
        open={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
      <MaintenanceMode
        open={isMaintenanceModeOpen}
        onClose={() => setIsMaintenanceModeOpen(false)}
      />
      <CustomEvents
        open={isCustomEventsOpen}
        onClose={() => setIsCustomEventsOpen(false)}
      />
    </div>
  );
}
