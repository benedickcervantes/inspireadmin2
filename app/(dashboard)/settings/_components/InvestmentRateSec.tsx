"use client";

import { useState } from "react";
import { Modal, Button, Input, Form, InputNumber } from "rsuite";
import { motion } from "motion/react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icons = {
  TrendingUp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Percent: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
};

interface InvestmentRateSecProps {
  open: boolean;
  onClose: () => void;
  onSave: (rates: InvestmentRates) => void;
}

export interface InvestmentRates {
  monthlyRate: number;
  quarterlyRate: number;
  semiAnnualRate: number;
  annualRate: number;
}

export default function InvestmentRateSec({
  open,
  onClose,
  onSave,
}: InvestmentRateSecProps) {
  const [rates, setRates] = useState<InvestmentRates>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("investmentRates");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Failed to parse investment rates:", error);
        }
      }
    }
    return {
      monthlyRate: 2.5,
      quarterlyRate: 7.5,
      semiAnnualRate: 15.0,
      annualRate: 30.0,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(rates);
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    // Reset to saved values
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("investmentRates");
      if (saved) {
        try {
          setRates(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to parse investment rates:", error);
        }
      }
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      className="dark-modal"
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] border border-[var(--warning)]/20 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Icons.TrendingUp className="w-5 h-5 text-[var(--warning)]" />
          </motion.div>
          <div>
            <Modal.Title className="text-lg font-semibold text-[var(--text-primary)]">
              Investment Rate Settings
            </Modal.Title>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Configure investment return rates
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="!bg-[var(--surface)] !px-6 !py-6">
        <Form fluid>
          <div className="space-y-4">
            {/* Monthly Rate */}
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Icons.Percent className="w-4 h-4" />
                Monthly Rate
              </Form.ControlLabel>
              <InputNumber
                value={rates.monthlyRate}
                onChange={(value) => setRates({ ...rates, monthlyRate: Number(value) || 0 })}
                min={0}
                max={100}
                step={0.1}
                postfix="%"
                className="!w-full"
              />
              <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
                Interest rate for 1-month investments
              </Form.HelpText>
            </Form.Group>

            {/* Quarterly Rate */}
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Icons.Percent className="w-4 h-4" />
                Quarterly Rate (3 months)
              </Form.ControlLabel>
              <InputNumber
                value={rates.quarterlyRate}
                onChange={(value) => setRates({ ...rates, quarterlyRate: Number(value) || 0 })}
                min={0}
                max={100}
                step={0.1}
                postfix="%"
                className="!w-full"
              />
              <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
                Interest rate for 3-month investments
              </Form.HelpText>
            </Form.Group>

            {/* Semi-Annual Rate */}
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Icons.Percent className="w-4 h-4" />
                Semi-Annual Rate (6 months)
              </Form.ControlLabel>
              <InputNumber
                value={rates.semiAnnualRate}
                onChange={(value) => setRates({ ...rates, semiAnnualRate: Number(value) || 0 })}
                min={0}
                max={100}
                step={0.1}
                postfix="%"
                className="!w-full"
              />
              <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
                Interest rate for 6-month investments
              </Form.HelpText>
            </Form.Group>

            {/* Annual Rate */}
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Icons.Percent className="w-4 h-4" />
                Annual Rate (12 months)
              </Form.ControlLabel>
              <InputNumber
                value={rates.annualRate}
                onChange={(value) => setRates({ ...rates, annualRate: Number(value) || 0 })}
                min={0}
                max={100}
                step={0.1}
                postfix="%"
                className="!w-full"
              />
              <Form.HelpText className="text-xs text-[var(--text-muted)] mt-1">
                Interest rate for 12-month investments
              </Form.HelpText>
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="!bg-[var(--surface)] !border-t !border-[var(--border)] !pt-4 !pb-4">
        <div className="flex gap-3 justify-end mx-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleClose}
              appearance="subtle"
              className="!text-[var(--text-secondary)] hover:!bg-[var(--surface-hover)]"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSave}
              appearance="primary"
              loading={isLoading}
              className="!bg-gradient-to-r !from-[var(--warning)] !to-amber-500 hover:!shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icons.Check className="w-4 h-4" />
                Save Changes
              </span>
            </Button>
          </motion.div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
