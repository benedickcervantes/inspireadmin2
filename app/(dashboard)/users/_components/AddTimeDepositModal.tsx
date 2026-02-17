"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Input, Loader, Message, Modal, SelectPicker, Toggle } from "rsuite";
import { getFirebaseUsers } from "@/lib/api/firebaseUsers";
import {
  createUserTimeDeposit,
  quoteTimeDeposit,
  type TimeDepositCreateRequest,
  type TimeDepositCreateResponse,
  type TimeDepositQuoteData,
  type TimeDepositTerm,
} from "@/lib/api/timeDeposits";
import CalculatorKeypad from "./CalculatorKeypad";
import InvestmentGrowthChart from "./InvestmentGrowthChart";
import CycleBreakdownChart from "./CycleBreakdownChart";
import InvestmentSummary from "./InvestmentSummary";
import RateEditorModal from "./RateEditorModal";
import { calculateCycleData } from "@/lib/utils/cycleCalculations";

type UserSummary = {
  _id: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
};

interface AddTimeDepositModalProps {
  open: boolean;
  onClose: () => void;
  user: UserSummary | null;
  onSuccess?: (response: TimeDepositCreateResponse) => void;
}

const termOptions: Array<{ label: string; value: TimeDepositTerm }> = [
  { label: "6 Months", value: "sixMonths" },
  { label: "1 Year", value: "oneYear" },
  { label: "2 Years", value: "twoYears" },
];

const referralModeOptions = [
  { label: "Manual", value: "manual" },
  { label: "Hierarchy", value: "hierarchy" },
] as const;

const formatPeso = (value: number) =>
  value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

const toDateInputValue = (value = new Date()) => {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const parseAmountText = (text: string): number => {
  const cleaned = text.replace(/[^0-9]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
};

const formatAmountDisplay = (text: string): string => {
  const num = parseAmountText(text);
  if (num === 0) return '';
  return num.toLocaleString('en-PH');
};

const isFutureDate = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return date.getTime() > endOfToday.getTime();
};

export default function AddTimeDepositModal({ open, onClose, user, onSuccess }: AddTimeDepositModalProps) {
  // Amount as string for calculator
  const [amountText, setAmountText] = useState<string>('');
  const amount = useMemo(() => parseAmountText(amountText), [amountText]);
  
  const [term, setTerm] = useState<TimeDepositTerm>("sixMonths");
  const [initialDate, setInitialDate] = useState<string>(toDateInputValue());

  const [estimatedRate, setEstimatedRate] = useState<number>(0);
  const [finalInterestRate, setFinalInterestRate] = useState<number | null>(null);
  const [isFinalRateDirty, setIsFinalRateDirty] = useState(false);
  const [showRateEditor, setShowRateEditor] = useState(false);

  const [quoteData, setQuoteData] = useState<TimeDepositQuoteData | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  
  // Chart view mode
  const [chartViewMode, setChartViewMode] = useState<"accumulation" | "payout">("accumulation");
  
  // Rate tier editor modal
  const [showRateTierEditor, setShowRateTierEditor] = useState(false);

  // Advanced section
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isReferralEnabled, setIsReferralEnabled] = useState(false);
  const [referrerUserId, setReferrerUserId] = useState<string>("");
  const [referralMode, setReferralMode] = useState<"manual" | "hierarchy">("manual");
  const [commissionPercentage, setCommissionPercentage] = useState<number | null>(null);
  const [isCommissionDirty, setIsCommissionDirty] = useState(false);
  const [generateContract, setGenerateContract] = useState(false);
  const [strictContract, setStrictContract] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const todayDate = useMemo(() => toDateInputValue(), []);

  const { data: referrersData, isLoading: isReferrersLoading } = useQuery({
    queryKey: ["time-deposit-referrers"],
    queryFn: () =>
      getFirebaseUsers({
        page: 1,
        limit: 100,
        agent: true,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: open && isReferralEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const referrerOptions = useMemo(() => {
    const users = referrersData?.data?.users ?? [];
    return users.map((item) => {
      const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.emailAddress || item.userId || item._id;
      return {
        label: `${fullName} (${item.userId || item._id})`,
        value: item.userId || item._id,
      };
    });
  }, [referrersData]);

  // Reset on open
  useEffect(() => {
    if (!open) return;

    setAmountText('');
    setTerm("sixMonths");
    setInitialDate(toDateInputValue());
    setEstimatedRate(0);
    setFinalInterestRate(null);
    setIsFinalRateDirty(false);
    setShowRateEditor(false);
    setQuoteData(null);
    setQuoteError(null);
    setShowAdvanced(false);
    setIsReferralEnabled(false);
    setReferrerUserId("");
    setReferralMode("manual");
    setCommissionPercentage(null);
    setIsCommissionDirty(false);
    setGenerateContract(false);
    setStrictContract(true);
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [open, user?._id]);

  // Quote on changes
  useEffect(() => {
    if (!open) return;

    if (!amount || amount <= 0) {
      setQuoteData(null);
      setQuoteError(null);
      setEstimatedRate(0);
      if (!isFinalRateDirty) {
        setFinalInterestRate(null);
      }
      return;
    }

    if (!initialDate || isFutureDate(initialDate)) {
      setQuoteData(null);
      setQuoteError("Initial date cannot be in the future.");
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsQuoting(true);
      setQuoteError(null);

      try {
        const response = await quoteTimeDeposit({
          amount,
          term,
          initialDate,
          finalInterestRate: Number.isFinite(finalInterestRate) && finalInterestRate! >= 0 ? finalInterestRate! : undefined,
          referral:
            isReferralEnabled && referrerUserId
              ? {
                  referrerUserId,
                  commissionPercentage:
                    Number.isFinite(commissionPercentage) && commissionPercentage! >= 0
                      ? commissionPercentage!
                      : undefined,
                  mode: referralMode,
                }
              : undefined,
        });

        const data = response.data || null;
        setQuoteData(data);

        if (data) {
          setEstimatedRate(data.estimatedInterestRate);
          if (!isFinalRateDirty) {
            setFinalInterestRate(data.estimatedInterestRate);
          }

          if (!isCommissionDirty && typeof data.estimatedAgentRate === "number" && data.estimatedAgentRate >= 0) {
            setCommissionPercentage(data.estimatedAgentRate);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load rate quote.";
        setQuoteData(null);
        setQuoteError(message);
      } finally {
        setIsQuoting(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [
    amount,
    commissionPercentage,
    finalInterestRate,
    initialDate,
    isCommissionDirty,
    isFinalRateDirty,
    isReferralEnabled,
    open,
    referralMode,
    referrerUserId,
    term,
  ]);

  // Keypad handlers
  const handleAppendDigit = (digit: string) => {
    const newText = amountText + digit;
    // Limit to reasonable length (e.g., 10 digits = 9,999,999,999)
    if (newText.length <= 10) {
      setAmountText(newText);
    }
  };

  const handleBackspace = () => {
    setAmountText(amountText.slice(0, -1));
  };

  const handleClear = () => {
    setAmountText('');
  };

  const parsedFinalRate = finalInterestRate !== null && Number.isFinite(finalInterestRate) ? finalInterestRate : 0;
  const parsedCommission = commissionPercentage !== null && Number.isFinite(commissionPercentage) ? commissionPercentage : 0;

  // Calculate cycle data for charts
  const cycleData = useMemo(() => {
    if (!quoteData || amount <= 0) return [];
    return calculateCycleData(
      amount,
      term,
      quoteData.finalInterestRate,
      initialDate
    );
  }, [amount, term, quoteData, initialDate]);
  
  // Calculate completion date
  const completionDate = useMemo(() => {
    if (cycleData.length === 0) return initialDate;
    return cycleData[cycleData.length - 1]?.date || initialDate;
  }, [cycleData, initialDate]);

  const isRateUnavailable = Boolean(quoteError);
  const requiresReferrer = isReferralEnabled && !referrerUserId;
  const invalidFutureDate = isFutureDate(initialDate);

  const disableSubmit =
    isSubmitting ||
    isQuoting ||
    !user ||
    !amount ||
    amount <= 0 ||
    parsedFinalRate < 0 ||
    invalidFutureDate ||
    requiresReferrer ||
    isRateUnavailable;

  const handleSubmit = async () => {
    if (!user) return;

    const userIdentifier = user._id || user.userId;
    if (!userIdentifier) {
      setSubmitError("User identifier is missing.");
      return;
    }

    if (disableSubmit) {
      if (requiresReferrer) {
        setSubmitError("Select a referrer when referral mode is enabled.");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const requestId =
        typeof window !== "undefined" && window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const payload: TimeDepositCreateRequest = {
        amount,
        term,
        initialDate,
        finalInterestRate: parsedFinalRate,
        ...(isReferralEnabled
          ? {
              referral: {
                referrerUserId,
                commissionPercentage: Number.isFinite(parsedCommission) ? parsedCommission : undefined,
                mode: referralMode,
              },
            }
          : {}),
        ...(generateContract
          ? {
              contract: {
                enabled: true,
                strict: strictContract,
              },
            }
          : {}),
      };

      const response = await createUserTimeDeposit(userIdentifier, payload, requestId);
      const created = response.data?.timeDeposit;

      if (!created) {
        throw new Error("Time deposit was created but no payload was returned.");
      }

      let successMessage = `Time deposit ${created.displayId} created successfully.`;
      if (response.data?.contract?.contractId) {
        successMessage += ` Contract ${response.data.contract.contractId} generated.`;
      } else if (response.data?.contractWarning) {
        successMessage += ` ${response.data.contractWarning}`;
      }

      setSubmitSuccess(successMessage);
      onSuccess?.(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create time deposit.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddress || user._id : "";
  const advancedCount = (isReferralEnabled ? 1 : 0) + (generateContract ? 1 : 0);

  return (
    <>
    <Modal open={open} onClose={onClose} size="lg" className="dark-modal">
      <Modal.Header>
        <Modal.Title>Add Time Deposit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {/* Target User */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="text-xs text-[var(--text-muted)]">Target User</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">{displayName}</div>
          </div>

          {/* Two-column Calculator Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT COLUMN: Calculator Input */}
            <div className="space-y-3">
              {/* Amount Display */}
              <div className="rounded-xl border-2 border-[var(--border-accent)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-soft)] p-4">
                <div className="text-xs text-[var(--text-muted)] mb-1">Principal Amount</div>
                <div className="text-2xl font-bold text-[var(--text-primary)] min-h-[2.5rem] flex items-center">
                  {amount > 0 ? formatPeso(amount) : (
                    <span className="text-[var(--text-muted)] text-lg font-normal">₱ 0</span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">Tap keypad or type to enter amount</div>
              </div>

              {/* Calculator Keypad */}
              <CalculatorKeypad
                onAppendDigit={handleAppendDigit}
                onBackspace={handleBackspace}
                onClear={handleClear}
                disabled={isSubmitting}
              />

              {/* Term Selector (Pills) */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Investment Term</label>
                <div className="flex gap-2">
                  {termOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTerm(option.value)}
                      disabled={isSubmitting}
                      className={`
                        flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                        ${term === option.value
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white border-2 border-[var(--primary)] scale-105'
                          : 'bg-[var(--surface)] text-[var(--text-secondary)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:scale-105'
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Date */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
                <Input
                  type="date"
                  value={initialDate}
                  max={todayDate}
                  onChange={setInitialDate}
                  disabled={isSubmitting}
                />
                {invalidFutureDate && (
                  <p className="mt-1 text-xs text-[var(--danger)]">Date cannot be in the future</p>
                )}
              </div>

              {/* Interest Rate Editor (Toggle) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Interest Rate</label>
                  <button
                    type="button"
                    onClick={() => setShowRateEditor(!showRateEditor)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    {showRateEditor ? 'Hide' : 'Edit rate'}
                  </button>
                </div>
                {showRateEditor ? (
                  <input
                    type="number"
                    value={finalInterestRate ?? ''}
                    onChange={(e) => {
                      setIsFinalRateDirty(true);
                      const val = parseFloat(e.target.value);
                      setFinalInterestRate(Number.isFinite(val) ? val : null);
                    }}
                    min="0"
                    step="0.0001"
                    placeholder="Final interest rate %"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm"
                  />
                ) : (
                  <div className="text-sm text-[var(--text-secondary)]">
                    Estimated: <span className="font-semibold">{estimatedRate.toFixed(4)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Projections */}
            <div className="space-y-4">
              {/* Investment Summary Cards */}
              <InvestmentSummary
                quoteData={quoteData}
                amount={amount}
                completionDate={completionDate}
              />

              {/* Growth Chart */}
              {cycleData.length > 0 && (
                <div className="rounded-xl border-2 border-[var(--border-accent)] bg-gradient-to-br from-[var(--surface-soft)] to-[var(--surface)] p-4">
                  <InvestmentGrowthChart
                    cycleData={cycleData}
                    viewMode={chartViewMode}
                    onViewModeChange={setChartViewMode}
                  />
                </div>
              )}

              {/* Cycle Breakdown Chart */}
              {cycleData.length > 0 && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
                  <CycleBreakdownChart cycleData={cycleData} />
                </div>
              )}

              {/* Error Display with Edit Rates Button */}
              {quoteError && (
                <div className="p-3 rounded-lg bg-[var(--danger-soft)] border border-[var(--danger)]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs text-[var(--danger)] flex-1">{quoteError}</p>
                    {quoteError.toLowerCase().includes("rate") && (
                      <Button
                        size="xs"
                        appearance="ghost"
                        onClick={() => setShowRateTierEditor(true)}
                        className="!text-[var(--danger)] !border-[var(--danger)] hover:!bg-[var(--danger)] hover:!text-white"
                      >
                        Edit Rates
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isQuoting && (
                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] py-2">
                  <Loader size="xs" />
                  <span>Updating projections...</span>
                </div>
              )}

              {/* Quick Info */}
              <div className="text-xs text-[var(--text-muted)] space-y-1 px-1">
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Projections update automatically</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>All figures are estimates based on current rates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Section (Collapsible) */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-3 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Advanced</h4>
                {advancedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-medium">
                    {advancedCount}
                  </span>
                )}
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="p-3 pt-0 space-y-3">
                {/* Referral Section */}
                <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--text-secondary)]">Referral</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">Optional commission processing</p>
                    </div>
                    <Toggle checked={isReferralEnabled} onChange={setIsReferralEnabled} disabled={isSubmitting} />
                  </div>

                  {isReferralEnabled && (
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Referrer</label>
                        <SelectPicker
                          data={referrerOptions}
                          value={referrerUserId || null}
                          loading={isReferrersLoading}
                          onChange={(value) => setReferrerUserId((value as string) || "")}
                          block
                          searchable
                          placeholder="Select referrer"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Mode</label>
                          <SelectPicker
                            data={referralModeOptions.map((option) => ({ ...option }))}
                            value={referralMode}
                            searchable={false}
                            cleanable={false}
                            onChange={(value) => {
                              if (value) {
                                setReferralMode(value as "manual" | "hierarchy");
                              }
                            }}
                            block
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Commission (%)</label>
                          <input
                            type="number"
                            value={commissionPercentage ?? ''}
                            onChange={(e) => {
                              setIsCommissionDirty(true);
                              const val = parseFloat(e.target.value);
                              setCommissionPercentage(Number.isFinite(val) ? val : null);
                            }}
                            min="0"
                            max="100"
                            step="0.01"
                            disabled={isSubmitting}
                            className="w-full px-2 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-xs"
                          />
                        </div>
                      </div>

                      <div className="rounded border border-[var(--border)] bg-[var(--surface-soft)] p-2">
                        <div className="text-[10px] uppercase text-[var(--text-muted)]">Net Commission</div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">
                          {formatPeso(quoteData?.referralNetCommission || 0)}
                        </div>
                        <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                          Estimated agent rate: {(quoteData?.estimatedAgentRate || 0).toFixed(4)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contract Section */}
                <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--text-secondary)]">Contract</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">Optional contract generation</p>
                    </div>
                    <Toggle checked={generateContract} onChange={setGenerateContract} disabled={isSubmitting} />
                  </div>

                  {generateContract && (
                    <Checkbox checked={strictContract} onChange={(_, checked) => setStrictContract(checked)} disabled={isSubmitting}>
                      <span className="text-xs">Block creation if contract generation fails</span>
                    </Checkbox>
                  )}
                </div>
              </div>
            )}
          </div>

          {submitError && <Message type="error" showIcon>{submitError}</Message>}
          {submitSuccess && <Message type="success" showIcon>{submitSuccess}</Message>}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button appearance="subtle" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <Button
          appearance="primary"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={disableSubmit}
          className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)]"
        >
          Add Time Deposit
        </Button>
      </Modal.Footer>
    </Modal>
    
    {/* Rate Tier Editor Modal */}
    <RateEditorModal
      open={showRateTierEditor}
      onClose={() => setShowRateTierEditor(false)}
      onSave={() => {
        // After saving rates, clear error and trigger quote refresh
        setQuoteError(null);
        // Quote will auto-refresh via existing debounce logic
      }}
      docId="eFy3nFCysIC824WKNfKW"
    />
    </>
  );
}
