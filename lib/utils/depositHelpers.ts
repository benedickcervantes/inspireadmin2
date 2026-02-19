/**
 * Helper utilities for deposit request processing
 */

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
