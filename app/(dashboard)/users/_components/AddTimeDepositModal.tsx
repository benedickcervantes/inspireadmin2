"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Input, InputNumber, Loader, Message, Modal, SelectPicker, Toggle } from "rsuite";
import { getFirebaseUsers } from "@/lib/api/firebaseUsers";
import {
  createUserTimeDeposit,
  quoteTimeDeposit,
  type TimeDepositCreateRequest,
  type TimeDepositCreateResponse,
  type TimeDepositQuoteData,
  type TimeDepositTerm,
} from "@/lib/api/timeDeposits";

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

const termOptions = [
  { label: "6 Months", value: "sixMonths" },
  { label: "1 Year", value: "oneYear" },
  { label: "2 Years", value: "twoYears" },
] as const;

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

const asNumber = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : NaN;

const isFutureDate = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return date.getTime() > endOfToday.getTime();
};

export default function AddTimeDepositModal({ open, onClose, user, onSuccess }: AddTimeDepositModalProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [term, setTerm] = useState<TimeDepositTerm>("sixMonths");
  const [initialDate, setInitialDate] = useState<string>(toDateInputValue());

  const [estimatedRate, setEstimatedRate] = useState<number>(0);
  const [finalInterestRate, setFinalInterestRate] = useState<number | null>(null);
  const [isFinalRateDirty, setIsFinalRateDirty] = useState(false);

  const [quoteData, setQuoteData] = useState<TimeDepositQuoteData | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!open) {
      return;
    }

    setAmount(null);
    setTerm("sixMonths");
    setInitialDate(toDateInputValue());
    setEstimatedRate(0);
    setFinalInterestRate(null);
    setIsFinalRateDirty(false);
    setQuoteData(null);
    setQuoteError(null);
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

  useEffect(() => {
    if (!open) return;

    const parsedAmount = asNumber(amount);
    const parsedRate = asNumber(finalInterestRate);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
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
          amount: parsedAmount,
          term,
          initialDate,
          finalInterestRate: Number.isFinite(parsedRate) && parsedRate >= 0 ? parsedRate : undefined,
          referral:
            isReferralEnabled && referrerUserId
              ? {
                  referrerUserId,
                  commissionPercentage:
                    Number.isFinite(asNumber(commissionPercentage)) && asNumber(commissionPercentage) >= 0
                      ? asNumber(commissionPercentage)
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

  const parsedAmount = asNumber(amount);
  const parsedFinalRate = asNumber(finalInterestRate);
  const parsedCommission = asNumber(commissionPercentage);

  const isRateUnavailable = Boolean(quoteError);
  const requiresReferrer = isReferralEnabled && !referrerUserId;
  const invalidFutureDate = isFutureDate(initialDate);

  const disableSubmit =
    isSubmitting ||
    isQuoting ||
    !user ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    !Number.isFinite(parsedFinalRate) ||
    parsedFinalRate < 0 ||
    invalidFutureDate ||
    requiresReferrer ||
    isRateUnavailable;

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

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
        amount: parsedAmount,
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

  return (
    <Modal open={open} onClose={onClose} size="md" className="dark-modal">
      <Modal.Header>
        <Modal.Title>Add Time Deposit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="text-xs text-[var(--text-muted)]">Target User</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">{displayName}</div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Amount (PHP)</label>
              <InputNumber
                value={amount}
                min={0}
                step={1000}
                formatter={(value) => (value ? value.toString() : "")}
                onChange={(value) => setAmount(typeof value === "number" ? value : null)}
                className="w-full"
                placeholder="Enter principal amount"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Term</label>
              <SelectPicker
                data={termOptions.map((option) => ({ ...option }))}
                value={term}
                cleanable={false}
                searchable={false}
                onChange={(value) => {
                  if (value) {
                    setTerm(value as TimeDepositTerm);
                  }
                }}
                block
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Initial Date</label>
              <Input
                type="date"
                value={initialDate}
                max={todayDate}
                onChange={setInitialDate}
              />
              {invalidFutureDate && <p className="mt-1 text-xs text-[var(--danger)]">Initial date cannot be in the future.</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Final Interest Rate (%)</label>
              <InputNumber
                value={finalInterestRate}
                min={0}
                step={0.0001}
                onChange={(value) => {
                  setIsFinalRateDirty(true);
                  setFinalInterestRate(typeof value === "number" ? value : null);
                }}
                className="w-full"
                placeholder="Final interest rate"
              />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">Estimated: {estimatedRate.toFixed(4)}%</p>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Estimate</h4>
              {isQuoting && (
                <span className="text-xs text-[var(--text-muted)]">
                  <Loader inline size="xs" content="Updating" />
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-2">
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Net Per Cycle</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{formatPeso(quoteData?.annualNetInterest || 0)}</div>
              </div>
              <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-2">
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Total Net Gain</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{formatPeso(quoteData?.totalNetInterestForTerm || 0)}</div>
              </div>
              <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-2">
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Total Return</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{formatPeso(quoteData?.totalReturnAmount || 0)}</div>
              </div>
            </div>
          </div>

          <Divider className="!my-2" />

          <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Referral</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Optional commission processing</p>
              </div>
              <Toggle checked={isReferralEnabled} onChange={setIsReferralEnabled} />
            </div>

            {isReferralEnabled && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                  />
                </div>

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
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Commission (%)</label>
                  <InputNumber
                    value={commissionPercentage}
                    min={0}
                    max={100}
                    step={0.01}
                    onChange={(value) => {
                      setIsCommissionDirty(true);
                      setCommissionPercentage(typeof value === "number" ? value : null);
                    }}
                    className="w-full"
                  />
                </div>

                <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-2">
                  <div className="text-[10px] uppercase text-[var(--text-muted)]">Net Commission</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {formatPeso(quoteData?.referralNetCommission || 0)}
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">Estimated agent rate: {(quoteData?.estimatedAgentRate || 0).toFixed(4)}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Contract</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Optional contract generation</p>
              </div>
              <Toggle checked={generateContract} onChange={setGenerateContract} />
            </div>

            {generateContract && (
              <Checkbox checked={strictContract} onChange={(_, checked) => setStrictContract(checked)}>
                <span className="text-xs">Block creation if contract generation fails</span>
              </Checkbox>
            )}
          </div>

          {quoteError && <Message type="error" showIcon>{quoteError}</Message>}
          {submitError && <Message type="error" showIcon>{submitError}</Message>}
          {submitSuccess && <Message type="success" showIcon>{submitSuccess}</Message>}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button appearance="subtle" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <Button appearance="primary" onClick={handleSubmit} loading={isSubmitting} disabled={disableSubmit}>
          Add Time Deposit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}