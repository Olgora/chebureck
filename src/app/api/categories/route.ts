import { NextResponse } from "next/server";
import { CategoryService } from "@/services/category/service";

export async function GET() {
  try {
    const categories = await CategoryService.getMenu();

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
 
 