import { supabase } from './supabase';

export async function sendMessage(senderId, receiverId, senderName, receiverName, postId, content, senderAvatar) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    sender_name: senderName,
    receiver_name: receiverName,
    post_id: postId ? String(postId) : null,
    content: content,
    sender_avatar: senderAvatar || null
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
  
  const otherIds = grouped.map(m => m.sender_id === userId ? m.receiver_id : m.sender_id).filter(Boolean);
  const { data: profiles } = await supabase.from('profiles').select('id, avatar_url').in('id', otherIds);
  const pm = {};
  if (profiles) profiles.forEach(p => pm[p.id] = p.avatar_url);
  
  return { data: grouped.map(m => {
    const otherId = m.sender_id === userId ? m.receiver_id : m.sender_id;
    return {...m, other_avatar: pm[otherId] || null};
  }), error };
}
