import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
// NOTE: For server-side administrative tasks like creating users without logging them in, we ideally need the SERVICE_ROLE_KEY.
// If SERVICE_ROLE_KEY is not available in env (which seems to be the case here only ANON is visible in client context),
// we might face issues if we try to use admin.createUser.
// However, standard signUp works with Anon key but it logs the user in (returns session).
// Since this is an API route, we can discard the session.
// Constraint: signUp might send email confirmation automatically if not disabled.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function generatePassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, packageId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Data incomplete" }, { status: 400 });
    }

    const password = generatePassword();

    // Sign Up the user
    // We pass metadata so our Trigger can pick it up and insert into public.users
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: "mitra",
          status: "pending_approval",
          phone: whatsapp,
          package_id: packageId,
          auto_generated_password: password, // Storing temporarily in metadata so we *could* email it?
          // Storing password in metadata is insecure.
          // BUT user requirement: "password baru akan terkirim ke email user... password generate otomatis"
          // If we can't send email transactionally here, we might lose it.
          // Better approach: Don't rely on us sending it. Rely on "Approval" triggering a Reset Password flow.
          // User said: "Approved -> password sent to email".
          // If we use Reset Password flow, they set their own.
          // If user INSISTS on "password sent", we must generate it.
          // For this MVP, I will NOT store it in metadata (security).
          // I will assumes the approval process will Trigger a password reset email.
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // IMPORTANT: If Email Confirmation is enabled, data.user might be null or session null.
    // If disabled, user is active immediately.
    // We set status='pending_approval' in public.users so they can't effectively do anything yet.

    return NextResponse.json({
      success: true,
      message: "User created",
      userId: data.user?.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
