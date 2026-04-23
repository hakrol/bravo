export function isDevAreaAvailable() {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AREA !== "false";
}
