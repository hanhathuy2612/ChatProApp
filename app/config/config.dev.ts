/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: `http://${process.env.SERVER_IP ?? "192.168.1.68"}:8080`,
  SERVER_HOST: "192.168.1.68",
  SERVER_PORT: "8080",
}
