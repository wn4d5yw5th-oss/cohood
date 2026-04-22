import { supabase } from './supabase';

export async function signUp(email, password, fullName, neighborhood, referredBy, birthDate, nationality) {
  const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        neighborhood: neighborhood
      }
    }
  });
  
  if (!error && data?.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      neighborhood: neighborhood,
      verified: false,
      referral_code: referralCode,
      referred_by: referredBy || null,
      birth_date: birthDate || null,
      nationality: nationality || null
    });
  }
  
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://cohood.nl/reset-password'
  });
  return { error };
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
}
