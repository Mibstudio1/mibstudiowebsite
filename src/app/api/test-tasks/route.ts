import { prisma } from "@/utils/db";

export async function GET() {
  try {
    const taskOptions = await prisma.taskOption.findMany();

    return new Response(
      JSON.stringify({
        success: true,
        count: taskOptions.length,
        data: taskOptions,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch task options",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
