import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = "admin_test_auto@gmail.com";
  const password = "admin123";

  const results: any = {};

  // 1. Try SignUp
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: "Test Auto", role: "admin" } },
  });

  if (signUpError) {
    results.signup = { status: "FAILED", error: signUpError.message };
  } else {
    results.signup = { status: "SUCCESS", user: signUpData.user?.id };
  }

  // 2. Try SignIn immediately
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    results.signin = { status: "FAILED", error: signInError.message };
    results.diagnosis =
      "If Signup Success but Signin Failed -> Email Confirmation is likely ON.";
  } else {
    results.signin = { status: "SUCCESS", user: signInData.user.id };
  }

  return NextResponse.json(results);
}
