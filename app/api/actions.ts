"use server";

import { prisma } from "@/prisma/prisma-client";
import { OrderStatus, Prisma } from "@prisma/client";
import { CheckoutFormValues } from "@/shared/constants";
import { cookies } from "next/headers";
import { getUserSession } from "@/shared/lib/get-user-session";
import { hashSync } from "bcrypt";
import { sendEmail } from "@/shared/lib/send-email";
import { EmailVerification } from "@/shared/components/shared/email-template";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token was not found");
    }

    // Find the cart by token
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    // If the cart was not found return error
    if (!userCart) {
      throw new Error("The cart was not found");
    }

    // If the cart is empty return error
    if (userCart?.totalAmount === 0) {
      throw new Error("The cart is empty");
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        token: userCart.token,

        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,

        items: JSON.stringify(userCart.items),
      },
    });

    // Clear the cart
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return order.id;
  } catch (err) {
    console.log("[createOrder] Server error", err);
  }
}

// TODO: Some security/checks should be carried to this server action
export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.log("Error [UPDATE_USER]", error);
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error(
          "Your account is not verified. Please check your email to complete the verification.",
        );
      }
      throw new Error("User already exists");
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationCode = await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    console.log(verificationCode.code);

    await sendEmail(
      createdUser.email,
      "Next Pizza / Email confirmation",
      EmailVerification({ code }),
    );
  } catch (error) {
    console.log("Error [REGISTER_USER]", error);
  }
}
