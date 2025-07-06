import { currencyFormatter } from "@/shared/lib/formatters";
import * as React from "react";

interface Props {
  code: string;
}

export const EmailVerification: React.FC<Props> = ({ code }) => (
  <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
    <p>Verification code {code}</p>

    <p>
      <a href={`http://localhost:3000/api/auth/verify?code=${code}`}>
        Confirm your email
      </a>
    </p>
  </div>
);
