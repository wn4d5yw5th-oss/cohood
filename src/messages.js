import { supabase } from './supabase';

export async function sendMessage(senderId, receiverId, senderName, receiverName, postId, content) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    sender_name: senderName,
    receiver_name: receiverName,
    post_id: postId ? String(postId) : null,
    content: content
  });
  return { error };
}

export async function getMessages(userId) {
  const { data, error } = await supabase.from('messages')
    .select('*')
    .or('sender_id.eq.'+userId+',receiver_id.eq.'+userId)
    .order('created_at', { ascending: false });
  
  if (!data) return { data: [], error };
  
  // Group by conversation partner
  const seen = {};
  const grouped = [];
  data.forEach(m => {
    const otherId = m.sender_id === userId ? m.receiver_id : m.sender_id;
    if (!seen[otherId]) {
      seen[otherId] = true;
      grouped.push(m);
    }
  });
  
  return { data: grouped, error };
}
