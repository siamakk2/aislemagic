import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({ error: 'storeId required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get list for this store
    const { data: list } = await supabase
      .from('lists')
      .select('id')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .single();

    if (!list) {
      // No list for this store yet
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    // Get items for this list
    const { data: items } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: true });

    res.status(200).json({
      success: true,
      items: items || [],
    });
  } catch (error) {
    console.error('Load list error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}
