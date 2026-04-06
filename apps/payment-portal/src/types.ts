export interface PaymentMethod {
  id: number;
  name: string;
  platform: string;
  description?: string;
  icon?: string;
  fee_mode: number;
  fee_percent: number;
  fee_amount: number;
}

export interface CurrentUserSummary {
  email: string;
  balance: number;
}

export interface RechargeRecord {
  id: number;
  orderNo: string;
  tradeNo: string;
  type: number;
  amount: number;
  createdAt: number;
  status: number;
  paymentName?: string;
}

export interface CheckoutInfo {
  type: string;
  checkoutUrl?: string;
  stripe?: {
    method: string;
    client_secret: string;
    publishable_key: string;
  };
}

export interface ActiveOrder {
  id: number;
  orderNo: string;
  tradeNo: string;
  rechargeAmount: number;
  amount: number;
  createdAt: number;
  status: number;
  paymentId: number;
  paymentName: string;
  checkout?: CheckoutInfo;
}

export interface PortalVerifyConfig {
  turnstile_site_key: string;
  captcha_type: string;
  enable_user_login_captcha: boolean;
}
