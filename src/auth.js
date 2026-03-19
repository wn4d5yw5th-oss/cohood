import { supabase } from './supabase';

export async function signUp(email, password, fullName, neighborhood) {
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

  if (data?.user && !error) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      neighborhood: neighborhood,
      verified: false
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
