import { supabase } from './supabase';

export async function saveComment(postId, userId, fullName, content, avatarUrl) {
  const { error } = await supabase.from('comments').insert({ 
    post_id: String(postId), 
    user_id: userId, 
    full_name: fullName, 
    content: content,
    avatar_url: avatarUrl || null
  });
  return { error };
}

export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', String(postId))
    .order('created_at');
  return { data, error };
}