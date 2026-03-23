import { supabase } from './supabase';

export async function createPost(userId, fullName, neighborhood, type, category, body, offer, urgent, offerCategory) {
  const { data, error } = await supabase.from('posts').insert({
    user_id: userId,
    full_name: fullName,
    neighborhood: neighborhood,
    type: type,
    category: category,
    body: body,
    offer: offer || null,
    urgent: urgent,
    offer_category: offerCategory || null
  }).select().single();
  return { data, error };
}

export async function getPosts(neighborhood) {
  const { data, error } = await supabase.from('posts').select('*').eq('neighborhood', neighborhood).order('created_at', { ascending: false });
  return { data, error };
}