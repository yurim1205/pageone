import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // Supabase에서 데이터 가져오기
    let request = supabase.from("books").select("*");

    if (query) {
      request = request.ilike("title", `%${query}%`);
    }

    const { data, error } = await request;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}