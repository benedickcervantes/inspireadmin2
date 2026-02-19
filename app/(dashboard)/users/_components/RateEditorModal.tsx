"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Loader, Message, Modal, toaster } from "rsuite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvestmentRates,
  updateInvestmentRates,
  type UpdateInvestmentRatesPayload,
} from "@/lib/api/investmentRates";
import TrashIcon from "@rsuite/icons/Trash";
import PlusIcon from "@rsuite/icons/Plus";

interface RateEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  docId?: string;
}

type TermType = "sixMonths" | "oneYear" | "twoYears";

interface RateTier {
  amount: number;
  rate: number;
}

const TERM_LABELS: Record<TermType, string> = {
  sixMonths: "6 Months",
  oneYear: "1 Year",
  twoYears: "2 Years",
};

const formatAmount = (value: number): string => {
  return value.toLocaleString("en-PH");
};

const parseAmount = (value: string): number => {
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
};

export default function RateEditorModal({
  open,
  onClose,
  onSave,
  docId = "eFy3nFCysIC824WKNfKW",
}: RateEditorModalProps) {
  const queryClient = useQueryClient();
  const [activeTerm, setActiveTerm] = useState<TermType>("sixMonths");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  // Editable rate tiers by term
  const [rateTiers, setRateTiers] = useState<Record<TermType, RateTier[]>>({
    sixMonths: [],
    oneYear: [],
    twoYears: [],
  });

  // Original data for reset
  const [originalRates, setOriginalRates] = useState<Record<TermType, RateTier[]>>({
    sixMonths: [],
    oneYear: [],
    twoYears: [],
  });

  // Fetch rates from backend
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["investment-rates", docId],
    queryFn: () => getInvestmentRates(docId),
    enabled: open,
  });

  // Convert Firestore format to editable array
  useEffect(() => {
    if (data?.data) {
      const convertToArray = (rateMap: Record<string, number> | undefined): RateTier[] => {
        if (!rateMap) return [];
        return Object.entries(rateMap)
          .map(([amount, rate]) => ({ amount: Number(amount), rate }))
          .sort((a, b) => a.amount - b.amount);
      };

      const converted = {
        sixMonths: convertToArray(data.data.sixMonths),
        oneYear: convertToArray(data.data.oneYear),
        twoYears: convertToArray(data.data.twoYears),
      };

      setRateTiers(converted);
      setOriginalRates(JSON.parse(JSON.stringify(converted))); // Deep copy
      setHasUnsavedChanges(false);
    }
  }, [data]);

  // Current term's tiers
  const currentTiers = rateTiers[activeTerm];

  // Update tier value
  const updateTier = (index: number, field: "amount" | "rate", value: string) => {
    const numericValue = field === "amount" ? parseAmount(value) : parseFloat(value) || 0;

    setRateTiers((prev) => {
      const updated = { ...prev };
      updated[activeTerm] = [...updated[activeTerm]];
      updated[activeTerm][index] = {
        ...updated[activeTerm][index],
        [field]: numericValue,
      };
      // Auto-sort by amount
      updated[activeTerm].sort((a, b) => a.amount - b.amount);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Add new tier
  const addTier = () => {
    setRateTiers((prev) => {
      const updated = { ...prev };
      updated[activeTerm] = [...updated[activeTerm], { amount: 0, rate: 0 }];
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Delete tier
  const deleteTier = (index: number) => {
    if (currentTiers.length <= 1) {
      toaster.push(
        <Message showIcon type="warning">
          Cannot delete the last tier. At least one tier is required.
        </Message>,
        { placement: "topCenter", duration: 3000 }
      );
      return;
    }

    setRateTiers((prev) => {
      const updated = { ...prev };
      updated[activeTerm] = updated[activeTerm].filter((_, i) => i !== index);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Reset to original
  const handleReset = () => {
    setRateTiers(JSON.parse(JSON.stringify(originalRates)));
    setHasUnsavedChanges(false);
    toaster.push(
      <Message showIcon type="info">
        Changes reset to original values
      </Message>,
      { placement: "topCenter", duration: 2000 }
    );
  };

  // Validate before save
  const validateTiers = (): { valid: boolean; error?: string } => {
    for (const term of Object.keys(rateTiers) as TermType[]) {
      const tiers = rateTiers[term];

      if (tiers.length === 0) {
        return { valid: false, error: `${TERM_LABELS[term]} must have at least one tier` };
      }

      // Check for negative values
      for (const tier of tiers) {
        if (tier.amount < 0 || tier.rate < 0) {
          return { valid: false, error: "Amount and rate must be non-negative" };
        }
      }

      // Check for duplicates
      const amounts = tiers.map((t) => t.amount);
      const uniqueAmounts = new Set(amounts);
      if (amounts.length !== uniqueAmounts.size) {
        return { valid: false, error: `${TERM_LABELS[term]} has duplicate amount thresholds` };
      }
    }

    return { valid: true };
  };

  // Save changes
  const handleSave = async () => {
    const validation = validateTiers();
    if (!validation.valid) {
      toaster.push(
        <Message showIcon type="error">
          {validation.error}
        </Message>,
        { placement: "topCenter", duration: 4000 }
      );
      return;
    }

    // Convert back to Firestore format
    const convertToObject = (tiers: RateTier[]): Record<string, number> => {
      return Object.fromEntries(tiers.map((tier) => [String(tier.amount), tier.rate]));
    };

    const payload: UpdateInvestmentRatesPayload = {
      sixMonths: convertToObject(rateTiers.sixMonths),
      oneYear: convertToObject(rateTiers.oneYear),
      twoYears: convertToObject(rateTiers.twoYears),
    };

    setIsSaving(true);
    try {
      await updateInvestmentRates(docId, payload);

      toaster.push(
        <Message showIcon type="success">
          Investment rates updated successfully
        </Message>,
        { placement: "topCenter", duration: 3000 }
      );

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["investment-rates"] });

      setHasUnsavedChanges(false);
      onSave?.();
      onClose();
    } catch (error: any) {
      toaster.push(
        <Message showIcon type="error">
          Failed to save: {error.message}
        </Message>,
        { placement: "topCenter", duration: 4000 }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle close with unsaved warning
  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardWarning(true);
    } else {
      onClose();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardWarning(false);
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} size="lg" overflow={false}>
        <Modal.Header>
          <Modal.Title>Edit Investment Rate Tiers</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader size="md" content="Loading rates..." />
            </div>
          )}

          {error && (
            <Message showIcon type="error">
              Failed to load rates. Please try again.
            </Message>
          )}

          {!isLoading && !error && (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-4 border-b border-[var(--border-subtle)] pb-2">
                {(Object.keys(TERM_LABELS) as TermType[]).map((term) => (
                  <button
                    key={term}
                    onClick={() => setActiveTerm(term)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                      activeTerm === term
                        ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
                        : "bg-[#2a2d34] text-gray-400 hover:text-white"
                    }`}
                  >
                    {TERM_LABELS[term]}
                    {hasUnsavedChanges && <span className="ml-1 text-yellow-400">*</span>}
                  </button>
                ))}
              </div>

              {/* Rate Tiers Table */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-[2fr_1.5fr_auto] gap-3 pb-2 border-b border-[var(--border-subtle)] text-xs font-semibold text-gray-400 uppercase">
                  <div>Amount Threshold</div>
                  <div>Interest Rate %</div>
                  <div>Actions</div>
                </div>

                {currentTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-[2fr_1.5fr_auto] gap-3 items-center">
                    <Input
                      value={formatAmount(tier.amount)}
                      onChange={(value) => updateTier(index, "amount", value)}
                      placeholder="e.g., 50,000"
                      disabled={isSaving}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      value={tier.rate}
                      onChange={(value) => updateTier(index, "rate", value)}
                      placeholder="e.g., 1.24"
                      step="0.01"
                      disabled={isSaving}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      appearance="ghost"
                      color="red"
                      onClick={() => deleteTier(index)}
                      disabled={isSaving || currentTiers.length === 1}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Tier Button */}
              <Button
                appearance="ghost"
                startIcon={<PlusIcon />}
                onClick={addTier}
                disabled={isSaving}
                className="mt-3 w-full"
              >
                Add New Tier
              </Button>

              {/* Info Message */}
              <Message showIcon type="info" className="mt-4">
                <strong>Interpolation:</strong> Rates between tiers are automatically calculated.
                <br />
                Example: If ₱50,000 = 0.78% and ₱70,000 = 0.85%, then ₱60,000 will get ~0.815%.
              </Message>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleReset} appearance="subtle" disabled={!hasUnsavedChanges || isSaving}>
            Reset
          </Button>
          <Button onClick={handleClose} appearance="subtle" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            appearance="primary"
            loading={isSaving}
            disabled={!hasUnsavedChanges || isSaving}
            className="!bg-gradient-to-r !from-[var(--primary)] !to-[var(--accent)]"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Discard Warning Dialog */}
      <Modal open={showDiscardWarning} onClose={() => setShowDiscardWarning(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-gray-300">
            You have unsaved changes. Are you sure you want to discard them?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDiscardWarning(false)} appearance="subtle">
            Keep Editing
          </Button>
          <Button onClick={confirmDiscard} appearance="primary" color="red">
            Discard Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
