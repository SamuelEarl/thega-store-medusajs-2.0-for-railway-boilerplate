import { Modules } from "@medusajs/framework/utils";
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION);
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER);

  // Retrieve order with basic relations
  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ["items", "summary", "shipping_address"]
  });

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_PLACED,
      data: {
        emailOptions: {
          replyTo: process.env.RESEND_FROM_EMAIL || "THEGA <no-reply@email.livethega.com>",
          subject: "THEGA order confirmation",
        },
        order,
        shippingAddress: order.shipping_address,
        preview: "Thank you for ordering from THEGA!"
      }
    });
  } catch (error) {
    console.error("Error sending order confirmation notification:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
