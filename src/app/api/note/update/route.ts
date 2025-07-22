import { updateNote } from "@/services/noteService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT")
    return NextResponse.json(
      { error: "Method is not allowed", success: false },
      { status: 405 }
    );

  try {
    const body = await req.json();
    const { id, project, title, date, attendees, noteExpand, noteAttachment } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required", success: false },
        { status: 400 }
      );
    }

    const result = await updateNote({
      id,
      project,
      title,
      date,
      attendees,
      noteExpand,
      noteAttachment,
    });

    return NextResponse.json(
      { message: "Note updated successfully", result, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update note failed: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
