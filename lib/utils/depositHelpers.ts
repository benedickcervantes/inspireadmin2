/**
 * Helper utilities for deposit request processing
 */

/**
 * Request type for deposit requests (Top Up Balance, Time Deposit, Stock).
 * Matches DepositRequestType from lib/api/depositRequests.
 */
export type DepositRequestType = "top_up_balance" | "time_deposit" | "stock";

/**
 * Determines if a payment method or type is time deposit related
 */
export const isTimeDepositRelated = (paymentMethod?: string, type?: string, depositMethod?: string): boolean => {
  const method = (paymentMethod || '').toLowerCase();
  const typeStr = (type || '').toLowerCase();
  const depositMethodStr = (depositMethod || '').toLowerCase();
  
  return method.includes('time') || 
         typeStr.includes('time deposit') || 
         depositMethodStr.includes('time');
};

/**
 * Derives request type (Top Up Balance, Time Deposit, Stock) from deposit fields.
 * Backend may return requestType directly; otherwise infer from paymentMethod, type, depositMethod, depositType.
 */
export function getDepositRequestType(deposit: {
  requestType?: string;
  paymentMethod?: string;
  type?: string;
  depositMethod?: string;
  depositType?: string;
}): DepositRequestType {
  const rt = (deposit.requestType || '').toLowerCase();
  if (rt === 'top_up_balance' || rt === 'time_deposit' || rt === 'stock' || rt === 'stock_investment') {
    return rt === 'stock_investment' ? 'stock' : (rt as DepositRequestType);
  }

  const pm = (deposit.paymentMethod || '').toLowerCase();
  const t = (deposit.type || '').toLowerCase();
  const dm = (deposit.depositMethod || '').toLowerCase();
  const dt = (deposit.depositType || '').toLowerCase();

  if (
    pm.includes('time') || t.includes('time') || dm.includes('time') || dt.includes('time')
  ) {
    return 'time_deposit';
  }
  if (
    pm.includes('stock') || t.includes('stock') || dm.includes('stock') || dt.includes('stock')
  ) {
    return 'stock';
  }
  if (
    pm.includes('topup') || pm.includes('top up') || t.includes('topup') ||
    t.includes('top up') || dm.includes('topup') || dm.includes('top up') ||
    dt.includes('topup') || dt.includes('top up') || pm.includes('available balance') ||
    t.includes('available balance') || dt.includes('available balance')
  ) {
    return 'top_up_balance';
  }

  return 'top_up_balance';
}

/**
 * Normalizes deposit request field names from Firebase
 * Handles both camelCase and snake_case field names
 */
export const normalizeDepositRequest = <T extends Record<string, any>>(deposit: T): T => {
  return {
    ...deposit,
    maturityDate: deposit.maturityDate ?? deposit.maturity_date,
    contractPeriod: deposit.contractPeriod ?? deposit.contract_period,
    paymentMethod: deposit.paymentMethod ?? deposit.payment_method,
    depositMethod: deposit.depositMethod ?? deposit.deposit_method,
    depositType: deposit.depositType ?? deposit.deposit_type,
  };
};
