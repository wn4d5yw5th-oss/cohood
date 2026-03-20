import { supabase } from './supabase';

export async function sendMessage(senderId, receiverId, senderName, postId, content) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    sender_name: senderName,
    post_id: String(postId),
    content: content
  });
  return { error };
}

export async function getMessages(userId) {
  const { data, error } = await supabase.from('messages')
    .select('*')
    .or('sender_id.eq.'+userId+',receiver_id.eq.'+userId)
    .order('created_at', { ascending: false });
  return { data, error };
}
