import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await getSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect ke home, akan di-redirect lagi ke dashboard sesuai role
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
