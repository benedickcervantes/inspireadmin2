"use client";

import React, { useState } from "react";
import { Modal, Button, Input, InputNumber, SelectPicker, toaster } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  BarChart: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Wallet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface NewDepositRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const depositTypes = [
  { label: "Time Deposit", value: "timedeposit", icon: Icons.Clock, minAmount: 50000 },
  { label: "Stock Investment", value: "stock", icon: Icons.BarChart, minAmount: 2000000 },
  { label: "Top Up Available Balance", value: "topup", icon: Icons.Wallet, minAmount: 0 },
];

export default function NewDepositRequestModal({ open, onClose }: NewDepositRequestModalProps) {
  const [step, setStep] = useState(1); // Step 1: Select type, Step 2: Fill details
  const [accountNumber, setAccountNumber] = useState("");
  const [depositType, setDepositType] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Time Deposit specific fields
  const [depositMethod, setDepositMethod] = useState("Request Amount");
  const [currency, setCurrency] = useState("PHP");
  const [contractPeriod, setContractPeriod] = useState<string | null>(null);

  const selectedType = depositTypes.find(t => t.value === depositType);

  const currencies = [
    { label: "Philippine Peso (₱)", value: "PHP" },
    { label: "Japanese Yen (¥)", value: "JPY" },
    { label: "Saudi Riyal (﷼)", value: "SAR" },
    { label: "Korean Won (₩)", value: "KRW" },
  ];

  const contractPeriods = [
    { label: "6 Months Contract", value: "6 Months" },
    { label: "1 Year Contract", value: "1 Year" },
    { label: "2 Years Contract", value: "2 Years" },
  ];

  const handleTypeSelect = () => {
    if (!depositType) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Validation Error</div>
          <div>Please select a deposit type</div>
        </div>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!accountNumber.trim() || !amount) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Validation Error</div>
          <div>Please fill in all required fields</div>
        </div>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    // Time Deposit specific validation
    if (depositType === "timedeposit" && !contractPeriod) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Validation Error</div>
          <div>Please select a contract period</div>
        </div>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    if (selectedType && amount < selectedType.minAmount) {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Validation Error</div>
          <div>Minimum amount for {selectedType.label} is ₱{selectedType.minAmount.toLocaleString()}</div>
        </div>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual API call here
    setTimeout(() => {
      toaster.push(
        <div className="text-sm">
          <div className="font-semibold">Success</div>
          <div>Deposit request created successfully</div>
        </div>,
        { placement: "topEnd", duration: 4000 }
      );
      
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setStep(1);
      setAccountNumber("");
      setDepositType(null);
      setAmount(null);
      setDepositMethod("Request Amount");
      setCurrency("PHP");
      setContractPeriod(null);
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleBack = () => {
    setStep(1);
    setAccountNumber("");
    setAmount(null);
    setDepositMethod("Request Amount");
    setCurrency("PHP");
    setContractPeriod(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      className="dark-modal"
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              New Deposit Request
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Create a new deposit request for a user
            </p>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        {step === 1 ? (
          // Step 1: Select Deposit Type
          <div className="flex flex-col gap-4">
            <div className="text-sm text-[var(--text-muted)] text-center mb-2">
              Step 1 of 2: Choose your deposit type
            </div>
            
            {depositTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    onClick={() => setDepositType(type.value)}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${depositType === type.value 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                        : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-strong)]'
                      }
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${depositType === type.value 
                        ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]' 
                        : 'bg-[var(--surface)]'
                      }
                    `}>
                      <IconComponent className={`w-6 h-6 ${depositType === type.value ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)]">{type.label}</div>
                      {type.minAmount > 0 && (
                        <div className="text-xs text-[var(--text-muted)]">
                          Minimum: ₱{type.minAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${depositType === type.value 
                        ? 'border-[var(--primary)] bg-[var(--primary)]' 
                        : 'border-[var(--border)]'
                      }
                    `}>
                      {depositType === type.value && (
                        <Icons.Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Step 2: Fill Details
          <div className="flex flex-col gap-4">
            <div className="text-sm text-[var(--text-muted)] text-center mb-2">
              Step 2 of 2: Enter deposit details
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Account Number <span className="text-[var(--danger)]">*</span>
              </label>
              <Input
                placeholder="Enter account number"
                value={accountNumber}
                onChange={setAccountNumber}
                disabled={isSubmitting}
                className="!bg-[var(--surface-soft)] !border-[var(--border)] !text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Currency <span className="text-[var(--danger)]">*</span>
              </label>
              <SelectPicker
                data={currencies}
                value={currency}
                onChange={setCurrency}
                placeholder="Select currency"
                block
                disabled={isSubmitting}
                className="!bg-[var(--surface-soft)]"
              />
            </div>

            {/* Time Deposit Specific Fields */}
            {depositType === "timedeposit" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Deposit Method <span className="text-[var(--danger)]">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <div
                      onClick={() => setDepositMethod("Request Amount")}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${depositMethod === "Request Amount" 
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                          : 'border-[var(--border)] bg-[var(--surface-soft)]'
                        }
                      `}
                    >
                      <div className={`
                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${depositMethod === "Request Amount" ? 'border-[var(--primary)]' : 'border-[var(--border)]'}
                      `}>
                        {depositMethod === "Request Amount" && (
                          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        )}
                      </div>
                      <span className="text-sm text-[var(--text-primary)]">Request Amount</span>
                    </div>
                    <div
                      onClick={() => setDepositMethod("Available Balance")}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${depositMethod === "Available Balance" 
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                          : 'border-[var(--border)] bg-[var(--surface-soft)]'
                        }
                      `}
                    >
                      <div className={`
                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${depositMethod === "Available Balance" ? 'border-[var(--primary)]' : 'border-[var(--border)]'}
                      `}>
                        {depositMethod === "Available Balance" && (
                          <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        )}
                      </div>
                      <span className="text-sm text-[var(--text-primary)]">Available Balance</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Contract Period <span className="text-[var(--danger)]">*</span>
                  </label>
                  <SelectPicker
                    data={contractPeriods}
                    value={contractPeriod}
                    onChange={setContractPeriod}
                    placeholder="Select contract period"
                    block
                    disabled={isSubmitting}
                    className="!bg-[var(--surface-soft)]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Amount (₱) <span className="text-[var(--danger)]">*</span>
              </label>
              <InputNumber
                placeholder="Enter amount"
                value={amount}
                onChange={setAmount}
                disabled={isSubmitting}
                min={0}
                step={1000}
                formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                className="!bg-[var(--surface-soft)] !border-[var(--border)] !text-[var(--text-primary)] w-full"
              />
              {selectedType && selectedType.minAmount > 0 && (
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Minimum amount: ₱{selectedType.minAmount.toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-xs text-[var(--text-muted)] bg-[var(--surface-soft)] p-3 rounded-lg border border-[var(--border-subtle)]">
              <strong>Note:</strong> This will create a new deposit request that requires approval.
            </div>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="!bg-[var(--surface)] !border-t !border-[var(--border)] !pt-4 !pb-4">
        <div className="flex gap-3 justify-end mx-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={step === 1 ? handleClose : handleBack}
              appearance="subtle"
              disabled={isSubmitting}
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={step === 1 ? handleTypeSelect : handleSubmit}
              appearance="primary"
              disabled={isSubmitting || (step === 1 && !depositType)}
              loading={isSubmitting}
              className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)] hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                {step === 1 ? (
                  <>
                    Continue
                    <Icons.Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Icons.Check className="w-4 h-4" />
                    {isSubmitting ? "Creating..." : "Create Request"}
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
