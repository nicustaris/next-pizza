import { currencyFormatter } from "@/shared/lib/formatters";
import * as React from "react";

interface Props {
  orderId: number;
  totalAmount: number;
}

export const OrderConfirmationTemplate: React.FC<Props> = ({
  orderId,
  totalAmount,
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
    <h1 style={{ color: "#333" }}>Thanks for your order! 🍕</h1>

    <p>
      Your food delivery order <strong>#{orderId}</strong> has been confirmed.
    </p>

    <p>
      We’ve received your payment of{" "}
      <strong>{currencyFormatter(totalAmount)}</strong>. Our kitchen is already
      getting started, and your food will be on its way shortly.
    </p>

    <p>
      If you have any questions or need support, feel free to contact us. Enjoy
      your meal! 😋
    </p>
  </div>
);
