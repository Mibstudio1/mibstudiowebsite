import { registorSchema } from "@/schema/backend/customerSchema";
import { createNewCustomer } from "@/services/customerService";
import { generateUniqueCustomerId } from "@/utils/fn";
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  try {
    const body = await req.json();
    const { error, value } = registorSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => d.message),
          success: false,
        },
        { status: 400 }
      );
    }

    const { customerName, companyName } = value;

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        name: customerName,
        company: companyName,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          message: "ลูกค้านี้มีอยู่ในระบบแล้ว",
          success: false,
        },
        { status: 200 }
      );
    }

    const customerId = await generateUniqueCustomerId();
    const newCustomer = { ...value, customerId };

    await createNewCustomer(newCustomer);

    return NextResponse.json(
      {
        message: "ลงทะเบียนสำเร็จ",
        result: newCustomer,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register error: ", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
