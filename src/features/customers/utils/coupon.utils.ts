import { CouponStatus } from "../types/customer.types";

export function toneOf(status: CouponStatus): "blue" | "green" | "orange" | "red" {
  if (status === "ISSUED") return "blue";
  if (status === "REDEEMED") return "green";
  if (status === "EXPIRED") return "orange";
  return "red";
}