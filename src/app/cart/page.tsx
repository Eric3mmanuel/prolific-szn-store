
import type { Metadata } from "next";
import CartPage from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your Bag | Prolific Szn",
  description: "Review your selected Prolific Szn pieces before checkout.",
};

export default function CartRoute() {
  return <CartPage />;
}
