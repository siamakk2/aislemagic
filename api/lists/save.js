import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const { storeId, items } = req.body;

    if (!storeId || !items) {
      return res.status(400).json({ error: 'storeId and items required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Find or create list for this store
    let { data: list } = await supabase
      .from('lists')
      .select('id')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .single();

    if (!list) {
      // Create new list
      const { data: newList, error } = await supabase
        .from('lists')
        .insert([{ user_id: userId, store_id: storeId }])
        .select()
        .single();

      if (error) throw error;
      list = newList;
    }

    // Delete old items for this list
    await supabase
      .from('list_items')
      .delete()
      .eq('list_id', list.id);

    // Insert new items
    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        list_id: list.id,
        name: item.name,
        qty: item.qty || 1,
        checked: item.checked || false,
        category: item.cat || null,
      }));

      const { error } = await supabase
        .from('list_items')
        .insert(itemsToInsert);

      if (error) throw error;
    }

    res.status(200).json({
      success: true,
      message: 'List saved',
      listId: list.id,
    });
  } catch (error) {
    console.error('Save list error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}
