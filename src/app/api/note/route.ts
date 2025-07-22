import { searchNoteSchema } from "@/schema/backend/noteSchema";
import { deleteNote, getNoteData } from "@/services/noteService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return NextResponse.json(
      { error: "Method is not allowed", success: false },
      { status: 405 }
    );
  try {
    const body = await req.json();
    const { error, value } = searchNoteSchema.validate(body, {
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
    const { title, startDate, endDate, customerId } = value;
    const result = await getNoteData({ title, startDate, endDate, customerId });
    return NextResponse.json(
      { message: "Search successfully", result, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch data failed: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE")
    return NextResponse.json(
      { error: "Method is not allowed", success: false },
      { status: 405 }
    );
  try {
    const body = await req.json();
    const { noteId } = body;
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required", success: false },
        { status: 400 }
      );
    }
    await deleteNote(noteId);
    return NextResponse.json(
      { message: "Notes deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete data failed: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
