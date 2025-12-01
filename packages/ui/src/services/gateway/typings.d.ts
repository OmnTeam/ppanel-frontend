declare namespace API {
  type basicCheckServiceVersionParams = {
    /** 服务名称 */
    service_name: string;
    /** 通讯密钥 */
    secret: string;
  };

  type basicHeartbeatParams = {
    /** 服务名称 */
    service_name: string;
    /** 通讯密钥 */
    secret: string;
  };

  type CheckServiceVersionRequest = true;

  type HeartbeatRequest = true;

  type HeartbeatResponse = {
    /** 心跳是否成功 */
    success: boolean;
  };

  type RegisterServiceRequest = {
    /** 心跳地址 */
    heartbeat_url: string;
    /** 代理路径 */
    proxy_path: string;
    /** 服务代码仓库 */
    repository: string;
    /** 通讯密钥 */
    secret: string;
    /** 服务名称 */
    service_name: string;
    /** 服务地址 */
    service_url: string;
    /** 服务版本 */
    service_version: string;
  };

  type RegisterServiceResponse = {
    /** 返回信息 */
    message: string;
    /** 注册是否成功 */
    success: boolean;
  };

  type ServiceVersionResponse = {
    /** 当前版本 */
    current_version: string;
    /** 是否有更新 */
    has_update: boolean;
    /** 最新版本 */
    latest_version: string;
  };

  type UpdateServiceRequest = {
    /** 通讯密钥 */
    secret: string;
    /** 服务名称 */
    service_name: string;
  };

  type UpdateServiceResponse = {
    /** 是否更新出错 */
    error: boolean;
    /** 返回信息 */
    message: string;
    /** 是否正在更新 */
    running: boolean;
    /** 更新步骤 */
    step: number;
    /** 更新总步骤 */
    total: number;
  };
}
