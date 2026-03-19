import { supabase } from './supabase';

export async function toggleLike(postId, userId) {
  const { data } = await supabase.from('likes').select('id').eq('post_id', String(postId)).eq('user_id', userId).maybeSingle();
  if (data) {
    await supabase.from('likes').delete().eq('post_id', String(postId)).eq('user_id', userId);
    return false;
  } else {
    await supabase.from('likes').insert({ post_id: String(postId), user_id: userId });
    return true;
  }
}

export async function getLikes(postId) {
  const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', String(postId));
  return count || 0;
}

export async function getUserLikes(userId) {
  const { data } = await supabase.from('likes').select('post_id').eq('user_id', userId);
  return data ? data.map(l => l.post_id) : [];
}