import { NextRequest, NextResponse } from "next/server";
import { findCustomerByCustomerId } from "@/services/customerService";
import { createToken } from "@/utils/jwt";
import { createTokenCookie } from "@/utils/cookie";
import { loginSchema } from "@/schema/backend/customerSchema";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();

    const { error, value } = loginSchema.validate(body, { abortEarly: false });
    const { customerId } = value;

    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => d.message),
          success: false,
        },
        { status: 200 }
      );
    }

    const customer = await findCustomerByCustomerId(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: "Invalid customer id", success: false },
        { status: 200 }
      );
    }

    const token = createToken({
      id: customer.id,
      name: customer.name,
      customerId: customer.customerId,
      companyName: customer.company,
    });

    const cookie = createTokenCookie(token);

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        result: {
          name: customer.name,
          customerId: customer.customerId,
          address: customer.address,
          phone: customer.phone,
          companyName: customer.company,
        },
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
