"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal, ProfileButton } from "./index";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [openAuthModal, setOpenAuthModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (searchParams.has("paid")) {
      toast.success("The order has been successfully paid.");
    }
  });

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Left part */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">
                It can't get any tastier
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Right part  */}
        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && (
            <div>
              <CartButton />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
