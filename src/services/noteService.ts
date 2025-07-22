import { SearchNoteProps } from "@/type/noteType";
import { prisma } from "@/utils/db";

export async function getNoteData({
  title,
  startDate,
  endDate,
  customerId,
}: SearchNoteProps) {
  const where: any = {};

  if (title) {
    where.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (startDate && endDate) {
    where.createDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (customerId) {
    where.customerId = customerId;
  }

  return await prisma.customerNote.findMany({
    where: {
      ...where,
      isActive: true,
    },
    orderBy: {
      createDate: "desc",
    },
    select: {
      id: true,
      project: true,
      title: true,
      createDate: true,
      customerId: true,
      attendees: {
        select: {
          role: true,
          name: true,
        },
      },
      noteAttachment: {
        select: {
          name: true,
          url: true,
        },
      },
      noteExpand: {
        select: {
          name: true,
          description: true,
          conclude: true,
        },
      },
    },
  });
}

export async function deleteNote(noteId: number) {
  // Hard delete with related records - ลบข้อมูลที่เกี่ยวข้องก่อน
  return await prisma.$transaction(async (tx) => {
    // ลบ related records ก่อน
    await tx.attendees.deleteMany({
      where: { customerNoteId: noteId },
    });

    await tx.noteExpand.deleteMany({
      where: { customerNoteId: noteId },
    });

    await tx.noteAttachment.deleteMany({
      where: { cusNoteId: noteId },
    });

    // ลบ main record
    return await tx.customerNote.delete({
      where: { id: noteId },
    });
  });
}

export async function createNote(noteData: any) {
  const {
    customerId,
    project,
    title,
    attendees,
    noteExpand,
    noteAttachment,
    date,
  } = noteData;
  return await prisma.customerNote.create({
    data: {
      project,
      title,
      customerId,
      date,
      attendees: {
        create: attendees.map((attendee: any) => ({
          role: attendee.role,
          name: attendee.name,
        })),
      },

      noteExpand: {
        create: noteExpand.map((expand: any) => ({
          name: expand.name,
          description: expand.description,
          conclude: expand.conclude,
        })),
      },

      noteAttachment: {
        create: noteAttachment.map((attachment: any) => ({
          name: attachment.name,
          url: attachment.url,
        })),
      },
    },
    include: {
      attendees: true,
      noteAttachment: true,
      noteExpand: true,
    },
  });
}

export async function updateNote(value: {
  id: number;
  project: string;
  title: string;
  date: string;
  attendees: { role: string; name: string }[];
  noteExpand: { name?: string; description: string; conclude: string }[];
  noteAttachment?: { name: string; url: string }[] | null;
}) {
  const { id, project, title, date, attendees, noteExpand, noteAttachment } =
    value;

  return await prisma.customerNote.update({
    where: { id },
    data: {
      project,
      title,
      date,
      attendees: {
        deleteMany: {},
        create: attendees.map((attendee) => ({
          role: attendee.role,
          name: attendee.name,
        })),
      },
      noteExpand: {
        deleteMany: {},
        create: noteExpand.map((expand) => ({
          name: expand.name,
          description: expand.description,
          conclude: expand.conclude,
        })),
      },
      noteAttachment: {
        deleteMany: {},
        create:
          noteAttachment?.map((attachment) => ({
            name: attachment.name,
            url: attachment.url,
          })) || [],
      },
    },
    include: {
      attendees: true,
      noteAttachment: true,
      noteExpand: true,
    },
  });
}
