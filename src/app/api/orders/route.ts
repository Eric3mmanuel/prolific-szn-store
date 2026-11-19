
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { products } from "@/lib/products";

export const runtime = "nodejs";

type IncomingOrderItem = {
  productId: string;
  slug: string;
  size: string;
  color: string;
  quantity: number;
};

type OrderRequest = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  delivery: {
    county: string;
    town: string;
    address: string;
    landmark?: string;
  };
  mpesaPhone: string;
  items: IncomingOrderItem[];
};

function clean(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function validKenyanPhone(phone: string): boolean {
  const normalized = phone.replace(/[\s-]/g, "");
  return /^(?:\+254|254|0)(?:7\d{8}|1\d{8})$/.test(normalized);
}

function createOrderNumber(): string {
  const date = new Date();
  const datePart = date
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const randomPart = crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();

  return `PS-${datePart}-${randomPart}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;

    if (
      !body ||
      typeof body !== "object" ||
      !body.customer ||
      !body.delivery ||
      !Array.isArray(body.items)
    ) {
      return NextResponse.json(
        { error: "Invalid order information." },
        { status: 400 }
      );
    }

    const fullName = clean(body.customer.fullName, 120);
    const email = clean(body.customer.email, 180).toLowerCase();
    const phone = clean(body.customer.phone, 20);
    const county = clean(body.delivery.county, 100);
    const town = clean(body.delivery.town, 120);
    const address = clean(body.delivery.address, 250);
    const landmark = clean(body.delivery.landmark, 250);
    const mpesaPhone = clean(body.mpesaPhone, 20);

    if (
      !fullName ||
      !email ||
      !phone ||
      !county ||
      !town ||
      !address ||
      !mpesaPhone
    ) {
      return NextResponse.json(
        { error: "Please complete all required checkout fields." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!validKenyanPhone(phone) || !validKenyanPhone(mpesaPhone)) {
      return NextResponse.json(
        { error: "Please provide valid Kenyan phone numbers." },
        { status: 400 }
      );
    }

    if (body.items.length === 0 || body.items.length > 30) {
      return NextResponse.json(
        { error: "Your order must contain between 1 and 30 items." },
        { status: 400 }
      );
    }

    let subtotal = 0;

    const verifiedItems = [];

    for (const item of body.items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        typeof item.slug !== "string" ||
        typeof item.size !== "string" ||
        typeof item.color !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        return NextResponse.json(
          { error: "One or more cart items are invalid." },
          { status: 400 }
        );
      }

      const product = products.find(
        (entry) =>
          entry.id === item.productId &&
          entry.slug === item.slug
      );

      if (!product) {
        return NextResponse.json(
          { error: "A product in your bag is no longer available." },
          { status: 400 }
        );
      }

      if (
        !product.sizes.includes(item.size) ||
        !product.colors.includes(item.color)
      ) {
        return NextResponse.json(
          {
            error: `The selected size or colour for ${product.name} is unavailable.`,
          },
          { status: 400 }
        );
      }

      const lineTotal = product.price * item.quantity;

      subtotal += lineTotal;

      verifiedItems.push({
        product_id: product.id,
        product_slug: product.slug,
        product_name: product.name,
        product_image: product.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: product.price,
      });
    }

    if (!Number.isSafeInteger(subtotal) || subtotal <= 0) {
      return NextResponse.json(
        { error: "The order total is invalid." },
        { status: 400 }
      );
    }

    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;
    const orderNumber = createOrderNumber();

    const supabase = createSupabaseAdmin();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        delivery_county: county,
        delivery_town: town,
        delivery_address: address,
        delivery_landmark: landmark || null,
        mpesa_phone: mpesaPhone,
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        currency: "KES",
        payment_method: "mpesa",
        payment_status: "pending_payment",
        order_status: "pending",
      })
      .select("id, order_number, total_amount, payment_status, created_at")
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError);

      return NextResponse.json(
        { error: "We could not create your order. Please try again." },
        { status: 500 }
      );
    }

    const orderItems = verifiedItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation failed:", itemsError);

      // Remove the incomplete order if its items could not be saved.
      const { error: rollbackError } = await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      if (rollbackError) {
        console.error("Order rollback failed:", rollbackError);
      }

      return NextResponse.json(
        { error: "We could not save your order items. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your order has been created.",
        order: {
          id: order.id,
          orderNumber: order.order_number,
          subtotal: order.total_amount,
          paymentStatus: order.payment_status,
          createdAt: order.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while processing your order." },
      { status: 500 }
    );
  }
}
