import { createNoteSchema } from "@/schema/backend/noteSchema";
import { createNote } from "@/services/noteService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return NextResponse.json(
      { error: "Method is not allowed", success: false },
      { status: 405 }
    );
  try {
    const body = await req.json();

    const { error, value } = createNoteSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return NextResponse.json(
        {
          error: error.details.map((detail) => detail.message),
          success: false,
        },
        { status: 400 }
      );
    }
    const {
      customerId,
      project,
      title,
      date,
      attendees,
      noteExpand,
      noteAttachment,
    } = value;
    const result = await createNote({
      customerId,
      project,
      title,
      date,
      attendees,
      noteExpand,
      noteAttachment,
    });
    return NextResponse.json(
      { message: "Created Successfully", result, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch data failed: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
