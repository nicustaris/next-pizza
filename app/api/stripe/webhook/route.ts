import { prisma } from "@/prisma/prisma-client";
import { OrderConfirmationTemplate } from "@/shared/components";
import { sendEmail } from "@/shared/lib/send-email";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    if (event.type === "charge.succeeded") {
      const data = event.data.object;

      const order = await prisma.order.findFirst({
        where: {
          id: Number(data.metadata.order_id),
        },
      });

      if (!order) {
        return NextResponse.json({ message: "Order not found" });
      }

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.SUCCEEDED,
        },
      });

      await sendEmail(
        order.email,
        "Order Confirmation",
        OrderConfirmationTemplate({
          orderId: order.id,
          totalAmount: order.totalAmount,
        }),
      );
    }

    return new NextResponse();
  } catch (error) {
    console.log(error);
  }
}
