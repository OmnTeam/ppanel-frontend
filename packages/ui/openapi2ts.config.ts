const baseConfig = {
  requestLibPath: "import request from '@workspace/ui/lib/request';",
  serversPath: "./src/services",
  apiPrefix: "'/api'",
};

const config = [
  {
    ...baseConfig,
    schemaPath:
      "https://raw.githubusercontent.com/perfect-panel/ppanel-docs/refs/heads/main/public/swagger/common.json",
    projectName: "common",
  },
  {
    ...baseConfig,
    schemaPath:
      "https://raw.githubusercontent.com/perfect-panel/ppanel-docs/refs/heads/main/public/swagger/user.json",
    projectName: "user",
  },
  {
    ...baseConfig,
    schemaPath:
      "https://raw.githubusercontent.com/perfect-panel/ppanel-docs/refs/heads/main/public/swagger/admin.json",
    projectName: "admin",
  },
  {
    ...baseConfig,
    schemaPath:
      "https://raw.githubusercontent.com/perfect-panel/ppanel-docs/refs/heads/main/public/swagger/gateway.json",
    apiPrefix: "",
    projectName: "gateway",
  },
];

export default config;
