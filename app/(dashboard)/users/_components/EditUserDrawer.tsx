"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Drawer, Button, Input, SelectPicker, Checkbox } from "rsuite";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  User: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Shield: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Settings: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  company?: string;
  agent?: boolean;
  agentCode?: string;
  agentNumber?: string;
  status?: string;
  accountType?: string;
  isDummyAccount?: boolean;
}

interface EditUserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

type TabKey = "personal" | "agent" | "account";

export default function EditUserDrawer({ open, onClose, user }: EditUserDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emailAddress: user?.emailAddress || "",
    company: user?.company || "",
    agentCode: user?.agentCode || "",
    agentNumber: user?.agentNumber || "",
    status: user?.status || "Active",
    accountType: user?.accountType || "Premium",
    isDemoAccount: user?.isDummyAccount || false,
    isTestAccount: user?.accountType === "test" || false,
  });

  const handleSave = () => {
    console.log("Saving user data:", formData);
    // Add your save logic here
    onClose();
  };

  const tabs = [
    { key: "personal" as const, label: "Personal Information", icon: Icons.User },
    { key: "agent" as const, label: "Agent Information", icon: Icons.Shield },
    { key: "account" as const, label: "Account Settings", icon: Icons.Settings },
  ];

  const accountStatusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Suspended", value: "Suspended" },
  ];

  const accountTypeOptions = [
    { label: "Premium", value: "Premium" },
    { label: "Standard", value: "Standard" },
    { label: "Basic", value: "Basic" },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      size="sm"
      className="!w-[500px] dark-drawer"
      closeButton={false}
    >
      <Drawer.Header className="!p-0 !border-b-0">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg">
              <Icons.User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Edit User Profile</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Editing: {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] hover:scale-110 hover:rotate-90 flex items-center justify-center text-[var(--text-muted)] transition-all duration-200"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      </Drawer.Header>

      <Drawer.Body className="!p-0 !bg-[var(--surface)]">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--surface-soft)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 text-xs font-medium transition-all relative ${
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[rgba(34,211,238,0.05)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.User className="w-4 h-4 text-[var(--primary)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Personal Information</h4>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        First Name <span className="text-[var(--danger)]">*</span>
                      </label>
                      <Input
                        size="sm"
                        value={formData.firstName}
                        onChange={(value) => setFormData({ ...formData, firstName: value })}
                        placeholder="Jonicia"
                        className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        Last Name <span className="text-[var(--danger)]">*</span>
                      </label>
                      <Input
                        size="sm"
                        value={formData.lastName}
                        onChange={(value) => setFormData({ ...formData, lastName: value })}
                        placeholder="Luna"
                        className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Email Address <span className="text-[var(--danger)]">*</span>
                    </label>
                    <Input
                      size="sm"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(value) => setFormData({ ...formData, emailAddress: value })}
                      placeholder="inspire.luna@inspire.com"
                      className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Company Name
                    </label>
                    <Input
                      size="sm"
                      value={formData.company}
                      onChange={(value) => setFormData({ ...formData, company: value })}
                      placeholder="N/A"
                      className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Agent Information Tab */}
          {activeTab === "agent" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[rgba(34,197,94,0.05)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Shield className="w-4 h-4 text-[var(--success)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Agent Information</h4>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        Agent Code
                      </label>
                      <Input
                        size="sm"
                        value={formData.agentCode}
                        onChange={(value) => setFormData({ ...formData, agentCode: value })}
                        placeholder="pending"
                        className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                        Agent Number
                      </label>
                      <Input
                        size="sm"
                        value={formData.agentNumber}
                        onChange={(value) => setFormData({ ...formData, agentNumber: value })}
                        placeholder="STU6X"
                        className="!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Account Settings Tab */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[rgba(168,85,247,0.05)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Settings className="w-4 h-4 text-[var(--accent)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Account Settings</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Account Status
                    </label>
                    <SelectPicker
                      size="sm"
                      data={accountStatusOptions}
                      value={formData.status}
                      onChange={(value) => setFormData({ ...formData, status: value || "Active" })}
                      searchable={false}
                      cleanable={false}
                      block
                      className="!bg-[var(--surface)] dark-select"
                      renderValue={(value) => (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${value === "Active" ? "bg-[var(--success)]" : "bg-[var(--text-muted)]"}`} />
                          {value}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Account Type
                    </label>
                    <SelectPicker
                      size="sm"
                      data={accountTypeOptions}
                      value={formData.accountType}
                      onChange={(value) => setFormData({ ...formData, accountType: value || "Premium" })}
                      searchable={false}
                      cleanable={false}
                      block
                      className="!bg-[var(--surface)] dark-select"
                    />
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
                      Premium accounts have access to advanced features and priority support.
                    </p>
                    <button className="text-[10px] text-[var(--primary)] hover:underline mt-1">
                      Current: Premium account
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Checkbox
                      checked={formData.isDemoAccount}
                      onChange={(_, checked) => setFormData({ ...formData, isDemoAccount: checked })}
                      className="!text-xs"
                    >
                      <span className="text-xs text-[var(--text-primary)]">Mark as Demo Account</span>
                    </Checkbox>
                    <p className="text-[10px] text-[var(--text-muted)] ml-6">
                      Check this box to mark this user as a Demo for marketing purposes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Checkbox
                      checked={formData.isTestAccount}
                      onChange={(_, checked) => setFormData({ ...formData, isTestAccount: checked })}
                      className="!text-xs"
                    >
                      <span className="text-xs text-[var(--text-primary)]">Mark as Test Account</span>
                    </Checkbox>
                    <p className="text-[10px] text-[var(--text-muted)] ml-6">
                      Check this box to mark this user as a Test for development purposes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-soft)] flex items-center justify-end gap-3">
          <Button
            size="sm"
            appearance="subtle"
            onClick={onClose}
            className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
          >
            <span className="flex items-center gap-2">
              <Icons.X className="w-3.5 h-3.5" />
              Cancel
            </span>
          </Button>
          <Button
            size="sm"
            appearance="primary"
            onClick={handleSave}
            className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <span className="flex items-center gap-2">
              <Icons.Check className="w-3.5 h-3.5" />
              Save Changes
            </span>
          </Button>
        </div>
      </Drawer.Body>
    </Drawer>
  );
}
