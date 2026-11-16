declare namespace API {
  type Ads = {
    id: string;
    title: string;
    type: string;
    content: string;
    description: string;
    target_url: string;
    start_time: number;
    end_time: number;
    status: number;
    created_at: number;
    updated_at: number;
  };

  type AlipayNotifyResponse = {
    return_code: string;
  };

  type Announcement = {
    id: string;
    title: string;
    content: string;
    show: boolean;
    pinned: boolean;
    popup: boolean;
    created_at: number;
    updated_at: number;
  };

  type AnyTLS = {
    port: number;
    security_config: SecurityConfig;
  };

  type Application = {
    id: string;
    icon: string;
    name: string;
    description: string;
    subscribe_type: string;
  };

  type ApplicationPlatform = {
    ios?: ApplicationVersion[];
    macos?: ApplicationVersion[];
    linux?: ApplicationVersion[];
    android?: ApplicationVersion[];
    windows?: ApplicationVersion[];
    harmony?: ApplicationVersion[];
  };

  type ApplicationResponse = {
    applications: ApplicationResponseInfo[];
  };

  type ApplicationResponseInfo = {
    id: string;
    name: string;
    icon: string;
    description: string;
    subscribe_type: string;
    platform: ApplicationPlatform;
  };

  type ApplicationVersion = {
    id: string;
    url: string;
    version: string;
    description: string;
    is_default: boolean;
  };

  type AppUserSubcbribe = {
    id: string;
    name: string;
    upload: number;
    traffic: number;
    download: number;
    device_limit: number;
    start_time: string;
    expire_time: string;
    list: AppUserSubscbribeNode[];
  };

  type AppUserSubscbribeNode = {
    id: string;
    name: string;
    uuid: string;
    protocol: string;
    relay_mode: string;
    relay_node: string;
    server_addr: string;
    speed_limit: number;
    tags: string[];
    traffic: number;
    traffic_ratio: number;
    upload: number;
    config: string;
    country: string;
    city: string;
    latitude: string;
    longitude: string;
    created_at: number;
    download: number;
  };

  type AuthConfig = {
    mobile: MobileAuthenticateConfig;
    email: EmailAuthticateConfig;
    device: DeviceAuthticateConfig;
    register: PubilcRegisterConfig;
  };

  type AuthMethodConfig = {
    id: string;
    method: string;
    config: Record<string, any>;
    enabled: boolean;
  };

  type BalanceLog = {
    type: number;
    user_id: string;
    amount: number;
    order_no?: string;
    balance: number;
    timestamp: number;
  };

  type BindOAuthCallbackRequest = {
    method: string;
    callback: Record<string, any>;
  };

  type BindOAuthRequest = {
    method: string;
    redirect: string;
  };

  type BindOAuthResponse = {
    redirect: string;
  };

  type BindTelegramResponse = {
    url: string;
    expired_at: number;
  };

  type CheckoutOrderRequest = {
    /** Backend contract field name (proto: order_no). */
    order_no: string;
    /** Backend contract field name (proto: return_url). */
    return_url?: string;
    /** @deprecated legacy camelCase alias, ignored by the current backend. */
    orderNo?: string;
    /** @deprecated legacy camelCase alias, ignored by the current backend. */
    returnUrl?: string;
  };

  type CheckoutOrderResponse = {
    type: string;
    checkout_url?: string;
    stripe?: StripePayment;
  };

  type CloseOrderRequest = {
    /** Backend contract field name (proto: order_no). */
    order_no: string;
    /** @deprecated legacy camelCase alias, ignored by the current backend. */
    orderNo?: string;
  };

  type CommissionLog = {
    type: number;
    user_id: string;
    amount: number;
    order_no: string;
    timestamp: number;
  };

  type CommissionWithdrawRequest = {
    amount: number;
    content: string;
  };

  type Coupon = {
    id: string;
    name: string;
    code: string;
    count: number;
    type: number;
    discount: number;
    start_time: number;
    expire_time: number;
    user_limit: number;
    subscribe: string[];
    used_count: number;
    enable: boolean;
    created_at: number;
    updated_at: number;
  };

  type CreateUserTicketFollowRequest = {
    ticket_id: string;
    from: string;
    type: number;
    content: string;
  };

  type CreateUserTicketRequest = {
    title: string;
    description: string;
  };

  type CurrencyConfig = {
    access_key: string;
    currency_unit: string;
    currency_symbol: string;
  };

  type DeviceAuthticateConfig = {
    enable: boolean;
    show_ads: boolean;
    enable_security: boolean;
    only_real_device: boolean;
  };

  type Document = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    show: boolean;
    created_at: number;
    updated_at: number;
  };

  type DownloadLink = {
    ios?: string;
    android?: string;
    windows?: string;
    mac?: string;
    linux?: string;
    harmony?: string;
  };

  type EmailAuthticateConfig = {
    enable: boolean;
    enable_verify: boolean;
    enable_domain_suffix: boolean;
    domain_suffix_list: string;
  };

  type EPayNotifyRequest = {
    pid: number;
    trade_no: string;
    out_trade_no: string;
    type: string;
    name: string;
    money: string;
    trade_status: string;
    param: string;
    sign: string;
    sign_type: string;
  };

  type Follow = {
    id: string;
    ticket_id: string;
    from: string;
    type: number;
    content: string;
    created_at: number;
  };

  type GetAvailablePaymentMethodsResponse = {
    /** Newer backend contract: the list is returned as `methods`. */
    methods: PaymentMethod[];
    /** Legacy field kept for backwards compatibility with older gateways. */
    list?: PaymentMethod[];
  };

  type GetDeviceListResponse = {
    list: UserDevice[];
    total: number;
  };

  type GetLoginLogParams = {
    page: number;
    size: number;
  };

  type GetLoginLogRequest = {
    page: number;
    size: number;
  };

  type GetLoginLogResponse = {
    list: UserLoginLog[];
    total: number;
  };

  type GetOAuthMethodsResponse = {
    methods: UserAuthMethod[];
  };

  type GetSubscribeLogParams = {
    page: number;
    size: number;
  };

  type GetSubscribeLogRequest = {
    page: number;
    size: number;
  };

  type GetSubscribeLogResponse = {
    list: UserSubscribeLog[];
    total: number;
  };

  type GetSubscriptionParams = {
    language: string;
  };

  type GetSubscriptionRequest = {
    language: string;
  };

  type GetSubscriptionResponse = {
    list: Subscribe[];
  };

  type GetUserSubscribeTrafficLogsRequest = {
    page: number;
    size: number;
    user_id: string;
    subscribe_id: string;
    start_time: number;
    end_time: number;
  };

  type GetUserSubscribeTrafficLogsResponse = {
    list: TrafficLog[];
    total: number;
  };

  type GetUserTicketDetailRequest = {
    id: string;
  };

  type GetUserTicketDetailsParams = {
    id: string;
  };

  type GetUserTicketListParams = {
    page: number;
    size: number;
    status?: number;
    search?: string;
  };

  type GetUserTicketListRequest = {
    page: number;
    size: number;
    status?: number;
    search?: string;
  };

  type GetUserTicketListResponse = {
    total: number;
    list: Ticket[];
  };

  type Hysteria2 = {
    port: number;
    hop_ports: string;
    hop_interval: number;
    obfs_password: string;
    security_config: SecurityConfig;
  };

  type InviteConfig = {
    forced_invite: boolean;
    referral_percentage: number;
    only_first_purchase: boolean;
  };

  type MessageLog = {
    id: string;
    type: number;
    platform: string;
    to: string;
    subject: string;
    content: Record<string, any>;
    status: number;
    created_at: number;
  };

  type MobileAuthenticateConfig = {
    enable: boolean;
    enable_whitelist: boolean;
    whitelist: string[];
  };

  type NodeConfig = {
    node_secret: string;
    node_pull_interval: number;
    node_push_interval: number;
    traffic_report_threshold: number;
    ip_strategy: string;
    dns: NodeDNS[];
    block: string[];
    outbound: NodeOutbound[];
  };

  type NodeDNS = {
    proto: string;
    address: string;
    domains: string[];
  };

  type NodeOutbound = {
    name: string;
    protocol: string;
    address: string;
    port: number;
    password: string;
    rules: string[];
  };

  type NodeRelay = {
    host: string;
    port: number;
    prefix: string;
  };

  type Order = {
    id: string;
    user_id: string;
    order_no: string;
    type: number;
    quantity: number;
    price: number;
    amount: number;
    gift_amount: number;
    discount: number;
    coupon: string;
    coupon_discount: number;
    commission?: number;
    payment: PaymentMethod;
    fee_amount: number;
    trade_no: string;
    status: number;
    subscribe_id: string;
    created_at: number;
    updated_at: number;
  };

  type OrderDetail = {
    id: string;
    user_id: string;
    order_no: string;
    type: number;
    quantity: number;
    price: number;
    amount: number;
    gift_amount: number;
    discount: number;
    coupon: string;
    coupon_discount: number;
    commission?: number;
    payment: PaymentMethod;
    method: string;
    fee_amount: number;
    trade_no: string;
    status: number;
    subscribe_id: string;
    subscribe: Subscribe;
    /** New pricing model: selected tier and its resolved duration. */
    price_option_id?: string;
    price_option_name?: string;
    duration_unit?: string;
    duration_value?: number;
    option_price?: number;
    /** Payment countdown deadline in milliseconds (unpaid orders only). */
    expire_at?: number;
    created_at: number;
    updated_at: number;
  };

  type PaymentConfig = {
    id: string;
    name: string;
    platform: string;
    description: string;
    icon?: string;
    domain?: string;
    config: Record<string, any>;
    fee_mode: number;
    fee_percent?: number;
    fee_amount?: number;
    enable: boolean;
  };

  type PaymentMethod = {
    id: string;
    name: string;
    platform: string;
    description: string;
    icon: string;
    fee_mode: number;
    fee_percent: number;
    fee_amount: number;
  };

  type PaymentMethodDetail = {
    id: string;
    name: string;
    platform: string;
    description: string;
    icon: string;
    domain: string;
    config: Record<string, any>;
    fee_mode: number;
    fee_percent: number;
    fee_amount: number;
    enable: boolean;
    notify_url: string;
  };

  type PlatformInfo = {
    platform: string;
    platform_url: string;
    platform_field_description: Record<string, any>;
  };

  type PlatformResponse = {
    list: PlatformInfo[];
  };

  type PortalPurchaseRequest = {
    auth_type: string;
    identifier: string;
    password?: string;
    /** Selected payment method id (int64 serialized as string). Must not be "". */
    payment: string;
    subscribe_id: string;
    quantity: number;
    /** Selected price tier id (int64 serialized as string). */
    price_option_id?: string;
    coupon?: string;
    invite_code?: string;
    turnstile_token?: string;
  };

  type PortalPurchaseResponse = {
    order_no: string;
  };

  type PreOrderResponse = {
    price: number;
    amount: number;
    discount: number;
    gift_amount: number;
    coupon: string;
    coupon_discount: number;
    fee_amount: number;
  };

  type PrePurchaseOrderRequest = {
    /** Selected payment method id (int64 serialized as string). Must not be "". */
    payment?: string;
    subscribe_id: string;
    quantity: number;
    /** Selected price tier id (int64 serialized as string). */
    price_option_id?: string;
    coupon?: string;
  };

  type PrePurchaseOrderResponse = {
    price: number;
    amount: number;
    discount: number;
    coupon: string;
    coupon_discount: number;
    fee_amount: number;
  };

  type PreRenewalOrderResponse = {
    orderNo: string;
  };

  type PreUnsubscribeRequest = {
    id: string;
  };

  type PreUnsubscribeResponse = {
    deduction_amount: number;
  };

  type PrivacyPolicyConfig = {
    privacy_policy: string;
  };

  type Protocol = {
    type: string;
    port: number;
    enable: boolean;
    security?: string;
    sni?: string;
    allow_insecure?: boolean;
    fingerprint?: string;
    reality_server_addr?: string;
    reality_server_port?: number;
    reality_private_key?: string;
    reality_public_key?: string;
    reality_short_id?: string;
    transport?: string;
    host?: string;
    path?: string;
    service_name?: string;
    cipher?: string;
    server_key?: string;
    flow?: string;
    hop_ports?: string;
    hop_interval?: number;
    obfs_password?: string;
    disable_sni?: boolean;
    reduce_rtt?: boolean;
    udp_relay_mode?: string;
    congestion_controller?: string;
    /** mux, eg: off/low/medium/high */
    multiplex?: string;
    /** padding scheme */
    padding_scheme?: string;
    /** upload speed limit */
    up_mbps?: number;
    /** download speed limit */
    down_mbps?: number;
    /** obfs, 'none', 'http', 'tls' */
    obfs?: string;
    /** obfs host */
    obfs_host?: string;
    /** obfs path */
    obfs_path?: string;
    /** xhttp mode */
    xhttp_mode?: string;
    /** xhttp extra path */
    xhttp_extra?: string;
    /** encryption，'none', 'mlkem768x25519plus' */
    encryption?: string;
    /** encryption mode，'native', 'xorpub', 'random' */
    encryption_mode?: string;
    /** encryption rtt，'0rtt', '1rtt' */
    encryption_rtt?: string;
    /** encryption ticket */
    encryption_ticket?: string;
    /** encryption server padding */
    encryption_server_padding?: string;
    /** encryption private key */
    encryption_private_key?: string;
    /** encryption client padding */
    encryption_client_padding?: string;
    /** encryption password */
    encryption_password?: string;
    /** Traffic ratio, default is 1 */
    ratio?: number;
    /** Certificate mode, `none`｜`http`｜`dns`｜`self` */
    cert_mode?: string;
    /** DNS provider for certificate */
    cert_dns_provider?: string;
    /** Environment for DNS provider */
    cert_dns_env?: string;
  };

  type PubilcRegisterConfig = {
    stop_register: boolean;
    enable_ip_register_limit: boolean;
    ip_register_limit: number;
    ip_register_limit_duration: number;
  };

  type PubilcVerifyCodeConfig = {
    verify_code_interval: number;
  };

  type PurchaseOrderRequest = {
    subscribe_id: string;
    quantity: number;
    /** Selected payment method id (int64 serialized as string). Must not be "". */
    payment?: string;
    /** Selected price tier id (int64 serialized as string). */
    price_option_id?: string;
    coupon?: string;
  };

  type PurchaseOrderResponse = {
    order_no: string;
  };

  type QueryAnnouncementParams = {
    page: number;
    size: number;
    pinned: boolean;
    popup: boolean;
  };

  type QueryAnnouncementRequest = {
    page: number;
    size: number;
    pinned: boolean;
    popup: boolean;
  };

  type QueryAnnouncementResponse = {
    total: number;
    announcements: Announcement[];
  };

  type QueryDocumentDetailParams = {
    id: string;
  };

  type QueryDocumentDetailRequest = {
    id: string;
  };

  type QueryDocumentListResponse = {
    total: number;
    list: Document[];
  };

  type QueryOrderDetailParams = {
    order_no: string;
  };

  type QueryOrderDetailRequest = {
    order_no: string;
  };

  type QueryOrderListParams = {
    page: number;
    size: number;
  };

  type QueryOrderListRequest = {
    page: number;
    size: number;
  };

  type QueryOrderListResponse = {
    total: number;
    list: OrderDetail[];
  };

  type QueryPurchaseOrderParams = {
    auth_type: string;
    identifier: string;
    order_no: string;
  };

  type QueryPurchaseOrderRequest = {
    auth_type: string;
    identifier: string;
    order_no: string;
  };

  type QueryPurchaseOrderResponse = {
    order_no: string;
    subscribe: Subscribe;
    quantity: number;
    price: number;
    amount: number;
    discount: number;
    coupon: string;
    coupon_discount: number;
    fee_amount: number;
    payment: PaymentMethod;
    status: number;
    created_at: number;
    token?: string;
  };

  type QuerySubscribeGroupListResponse = {
    list: SubscribeGroup[];
    total: number;
  };

  type QuerySubscribeListParams = {
    language: string;
  };

  type QuerySubscribeListRequest = {
    language: string;
  };

  type QuerySubscribeListResponse = {
    list: Subscribe[];
    total: number;
  };

  type QueryUserAffiliateCountResponse = {
    registers: number;
    total_commission: number;
  };

  type QueryUserAffiliateListParams = {
    page: number;
    size: number;
  };

  type QueryUserAffiliateListRequest = {
    page: number;
    size: number;
  };

  type QueryUserAffiliateListResponse = {
    list: UserAffiliate[];
    total: number;
  };

  type QueryUserBalanceLogListResponse = {
    list: BalanceLog[];
    total: number;
  };

  type QueryUserCommissionLogListRequest = {
    page: number;
    size: number;
  };

  type QueryUserCommissionLogListResponse = {
    list: CommissionLog[];
    total: number;
  };

  type QueryUserCommissionLogParams = {
    page: number;
    size: number;
  };

  type QueryUserSubscribeListResponse = {
    list: UserSubscribe[];
    total: number;
  };

  type QueryUserSubscribeNodeListResponse = {
    list: UserSubscribeInfo[];
  };

  type QueryWithdrawalLogListRequest = {
    page: number;
    size: number;
  };

  type QueryWithdrawalLogListResponse = {
    list: WithdrawalLog[];
    total: number;
  };

  type QueryWithdrawalLogParams = {
    page: number;
    size: number;
  };

  type RechargeOrderRequest = {
    amount: number;
    payment: string;
  };

  type RechargeOrderResponse = {
    order_no: string;
  };

  type RegisterConfig = {
    stop_register: boolean;
    enable_trial: boolean;
    trial_subscribe: string;
    trial_time: number;
    trial_time_unit: string;
    enable_ip_register_limit: boolean;
    ip_register_limit: number;
    ip_register_limit_duration: number;
  };

  type RenewalOrderRequest = {
    user_subscribe_id: string;
    quantity: number;
    /** Selected payment method id (int64 serialized as string). Must not be "". */
    payment: string;
    /** Selected price tier id (int64 serialized as string). */
    price_option_id?: string;
    coupon?: string;
  };

  type RenewalOrderResponse = {
    order_no: string;
  };

  type ResetSubscribeTrafficLog = {
    id: string;
    type: number;
    user_subscribe_id: string;
    order_no?: string;
    timestamp: number;
  };

  type ResetTrafficOrderRequest = {
    user_subscribe_id: string;
    payment: string;
  };

  type ResetTrafficOrderResponse = {
    order_no: string;
  };

  type ResetUserSubscribeTokenRequest = {
    user_subscribe_id: string;
  };

  type Response = {
    /** 状态码 */
    code?: number;
    /** 消息 */
    msg?: string;
    /** 数据 */
    data?: Record<string, any>;
  };

  type SecurityConfig = {
    sni: string;
    allow_insecure: boolean;
    fingerprint: string;
    reality_server_addr: string;
    reality_server_port: number;
    reality_private_key: string;
    reality_public_key: string;
    reality_short_id: string;
  };

  type ServerGroup = {
    id: string;
    name: string;
    description: string;
    created_at: number;
    updated_at: number;
  };

  type ServerRuleGroup = {
    id: string;
    icon: string;
    name: string;
    type: string;
    tags: string[];
    rules: string;
    enable: boolean;
    default: boolean;
    created_at: number;
    updated_at: number;
  };

  type Shadowsocks = {
    method: string;
    port: number;
    server_key: string;
  };

  type SiteConfig = {
    host: string;
    site_name: string;
    site_desc: string;
    site_logo: string;
    keywords: string;
    custom_html: string;
    custom_data: string;
  };

  type SiteCustomDataContacts = {
    email: string;
    telephone: string;
    address: string;
  };

  type SortItem = {
    id: string;
    sort: number;
  };

  type StripePayment = {
    method: string;
    client_secret: string;
    publishable_key: string;
  };

  type Subscribe = {
    id: string;
    name: string;
    language: string;
    description: string;
    unit_price: number;
    unit_time: string;
    discount: SubscribeDiscount[];
    replacement: number;
    inventory: number;
    traffic: number;
    speed_limit: number;
    device_limit: number;
    quota: number;
    nodes: number[];
    node_tags: string[];
    show: boolean;
    sell: boolean;
    sort: number;
    deduction_ratio: number;
    allow_deduction: boolean;
    reset_cycle: number;
    renewal_reset: boolean;
    show_original_price: boolean;
    created_at: number;
    updated_at: number;
    /** New pricing model: duration/price tiers. Falls back to unit_price+discount when empty. */
    price_options?: SubscribePriceOption[];
    category_id?: number;
    category_name?: string;
    short_description?: string;
    features?: string;
    detail_format?: string;
    detail_content?: string;
  };

  type SubscribePriceOption = {
    id: string;
    subscribe_id: string;
    name: string;
    /** Minute | Hour | Day | Week | Month | Year | NoLimit */
    duration_unit: string;
    duration_value: number;
    /** Price in minor units (cents). */
    price: number;
    /** Original price in minor units (cents). */
    original_price: number;
    /** -1 means unlimited. */
    inventory: number;
    show: boolean;
    sell: boolean;
    is_default: boolean;
    sort: number;
    created_at: number;
    updated_at: number;
    code: string;
    /** duration | traffic_pack | reset_pack */
    type: string;
    version?: number;
  };

  type SubscribeConfig = {
    single_model: boolean;
    subscribe_path: string;
    subscribe_domain: string;
    pan_domain: boolean;
    user_agent_limit: boolean;
    user_agent_list: string;
  };

  type SubscribeDiscount = {
    quantity: number;
    discount: number;
  };

  type SubscribeGroup = {
    id: string;
    name: string;
    description: string;
    created_at: number;
    updated_at: number;
  };

  type SubscribeType = {
    subscribe_types: string[];
  };

  type TelegramConfig = {
    telegram_bot_token: string;
    telegram_group_url: string;
    telegram_notify: boolean;
    telegram_web_hook_domain: string;
  };

  type Ticket = {
    id: string;
    title: string;
    description: string;
    user_id: string;
    follow?: Follow[];
    status: number;
    created_at: number;
    updated_at: number;
  };

  type TimePeriod = {
    start_time: string;
    end_time: string;
    multiplier: number;
  };

  type TosConfig = {
    tos_content: string;
  };

  type TrafficLog = {
    id: string;
    server_id: string;
    user_id: string;
    subscribe_id: string;
    download: number;
    upload: number;
    timestamp: number;
  };

  type TransportConfig = {
    path: string;
    host: string;
    service_name: string;
  };

  type Trojan = {
    port: number;
    transport: string;
    transport_config: TransportConfig;
    security: string;
    security_config: SecurityConfig;
  };

  type Tuic = {
    port: number;
    disable_sni: boolean;
    reduce_rtt: boolean;
    udp_relay_mode: string;
    congestion_controller: string;
    security_config: SecurityConfig;
  };

  type UnbindDeviceRequest = {
    id: string;
  };

  type UnbindOAuthRequest = {
    method: string;
  };

  type UnsubscribeRequest = {
    id: string;
  };

  type UpdateBindEmailRequest = {
    email: string;
  };

  type UpdateBindMobileRequest = {
    area_code: string;
    mobile: string;
    code: string;
  };

  type UpdateUserNotifyRequest = {
    enable_balance_notify: boolean;
    enable_login_notify: boolean;
    enable_subscribe_notify: boolean;
    enable_trade_notify: boolean;
  };

  type UpdateUserPasswordRequest = {
    password: string;
  };

  type UpdateUserRulesRequest = {
    rules: string[];
  };

  type UpdateUserSubscribeNoteRequest = {
    user_subscribe_id: string;
    note: string;
  };

  type UpdateUserTicketStatusRequest = {
    id: string;
    status: number;
  };

  type User = {
    id: string;
    avatar: string;
    balance: number;
    commission: number;
    referral_percentage: number;
    only_first_purchase: boolean;
    gift_amount: number;
    telegram: number;
    refer_code: string;
    referer_id: string;
    enable: boolean;
    is_admin?: boolean;
    enable_balance_notify: boolean;
    enable_login_notify: boolean;
    enable_subscribe_notify: boolean;
    enable_trade_notify: boolean;
    auth_methods: UserAuthMethod[];
    user_devices: UserDevice[];
    rules: string[];
    created_at: number;
    updated_at: number;
    deleted_at?: number;
  };

  type UserAffiliate = {
    avatar: string;
    identifier: string;
    registered_at: number;
    enable: boolean;
  };

  type UserAuthMethod = {
    auth_type: string;
    auth_identifier: string;
    verified: boolean;
  };

  type UserDevice = {
    id: string;
    ip: string;
    identifier: string;
    user_agent: string;
    online: boolean;
    enabled: boolean;
    created_at: number;
    updated_at: number;
  };

  type UserLoginLog = {
    id: string;
    user_id: string;
    login_ip: string;
    user_agent: string;
    success: boolean;
    timestamp: number;
  };

  type UserSubscribe = {
    id: string;
    id_str: string;
    user_id: string;
    order_id: string;
    subscribe_id: string;
    subscribe: Subscribe;
    start_time: number;
    expire_time: number;
    finished_at: number;
    reset_time: number;
    traffic: number;
    download: number;
    upload: number;
    token: string;
    status: number;
    short: string;
    created_at: number;
    updated_at: number;
  };

  type UserSubscribeInfo = {
    id: string;
    user_id: string;
    order_id: string;
    subscribe_id: string;
    start_time: number;
    expire_time: number;
    finished_at: number;
    reset_time: number;
    traffic: number;
    download: number;
    upload: number;
    token: string;
    status: number;
    created_at: number;
    updated_at: number;
    is_try_out: boolean;
    nodes: UserSubscribeNodeInfo[];
  };

  type UserSubscribeLog = {
    id: string;
    user_id: string;
    user_subscribe_id: string;
    token: string;
    ip: string;
    user_agent: string;
    timestamp: number;
  };

  type UserSubscribeNodeInfo = {
    id: string;
    name: string;
    uuid: string;
    protocol: string;
    port: number;
    address: string;
    tags: string[];
    country: string;
    city: string;
    created_at: number;
  };

  type VerifyCodeConfig = {
    verify_code_expire_time: number;
    verify_code_limit: number;
    verify_code_interval: number;
  };

  type VerifyConfig = {
    turnstile_site_key: string;
    turnstile_secret: string;
    enable_login_verify: boolean;
    enable_register_verify: boolean;
    enable_reset_password_verify: boolean;
  };

  type VerifyEmailRequest = {
    email: string;
    code: string;
  };

  type Vless = {
    port: number;
    flow: string;
    transport: string;
    transport_config: TransportConfig;
    security: string;
    security_config: SecurityConfig;
  };

  type Vmess = {
    port: number;
    transport: string;
    transport_config: TransportConfig;
    security: string;
    security_config: SecurityConfig;
  };

  type WithdrawalLog = {
    id: string;
    user_id: string;
    amount: number;
    content: string;
    status: number;
    reason?: string;
    created_at: number;
    updated_at: number;
  };
}
