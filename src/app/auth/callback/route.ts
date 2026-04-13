import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Si "next" está en los parámetros, úsalo, sino redirige a /scripts
  const next = searchParams.get('next') ?? '/scripts';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Error exchanging code for session:', error.message);
    }
  }

  // Si hay error en el canje, o no hay código, redirige a login con un error en URL
  return NextResponse.redirect(`${origin}/login?error=Link%20inválido%20o%20expirado`);
}
