import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET: ดึงข้อมูล task แบบ grouped
export async function GET(req: NextRequest) {
  try {
    const taskOption = await prisma.taskOption.findMany();

    const categories = [
      {
        category: "architechture",
        title: "Architectural & Engineering Design",
        subtitle: "งานออกแบบ สถาปัตย์วิศวกร",
      },
      {
        category: "supervistion",
        title: "Construction Supervision Services",
        subtitle: "บริการควบคุมงานก่อนสร้าง",
      },
      {
        category: "contracting",
        title: "Construction Contracting Services",
        subtitle: "บริการ รับเหมา ก่อสร้าง หรือ ว่าจ้างก่อสร้าง",
      },
    ];

    const grouped = categories.map((cat) => ({
      ...cat,
      tasks: taskOption
        .filter((t) => t.category === cat.category)
        .map((t) => t.name),
    }));

    return NextResponse.json({ success: true, data: grouped }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, title, subtitle, id } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = await prisma.taskOption.create({
      data: { id, name, category, title, subtitle },
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: ลบ task
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Missing task name" },
        { status: 400 }
      );
    }

    const deletedTask = await prisma.taskOption.delete({ where: { name } });

    return NextResponse.json(
      { success: true, data: deletedTask },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
