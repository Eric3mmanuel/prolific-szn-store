import type { Metadata } from "next";
import CheckoutPage from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout | Prolific Szn",
  description: "Complete your Prolific Szn order.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}