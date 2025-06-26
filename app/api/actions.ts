"use server";

import { prisma } from "@/prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import { CheckoutFormValues } from "@/shared/constants";
import { cookies } from "next/headers";
import { sendEmail } from "@/shared/lib/send-email";

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
