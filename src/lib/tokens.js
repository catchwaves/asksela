import { supabase } from './supabase';

export const TOKEN_COSTS = {
  ASSESSMENT: 3,
  GAMEPLAN: 2,
  ADVISOR_FOLLOWUP: 1,
  COMPARISON: 3,
};

export async function getTokenBalance(userId) {
  const { data, error } = await supabase
    .from('token_balances')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (error) return 0;
  return data?.balance ?? 0;
}

export async function spendTokens(userId, action, description) {
  const cost = TOKEN_COSTS[action];
  if (!cost) return { success: false, error: 'Unknown action' };

  // Check balance first
  const { data: balanceData, error: balanceError } = await supabase
    .from('token_balances')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (balanceError || !balanceData) return { success: false, error: 'Could not read balance' };
  if (balanceData.balance < cost) return { success: false, error: 'insufficient_tokens' };

  // Deduct tokens
  const { error: updateError } = await supabase
    .from('token_balances')
    .update({ 
      balance: balanceData.balance - cost,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) return { success: false, error: 'Could not update balance' };

  // Log the transaction
  await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      amount: -cost,
      action: action.toLowerCase(),
      description: description || action
    });

  return { success: true, newBalance: balanceData.balance - cost };
}

export async function grantTokens(userId, amount, description) {
  const { data: balanceData, error: balanceError } = await supabase
    .from('token_balances')
    .select('balance, lifetime_earned')
    .eq('user_id', userId)
    .single();

  if (balanceError || !balanceData) return { success: false };

  const { error: updateError } = await supabase
    .from('token_balances')
    .update({
      balance: balanceData.balance + amount,
      lifetime_earned: balanceData.lifetime_earned + amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) return { success: false };

  await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      amount: amount,
      action: 'purchase',
      description: description || `+${amount} tokens`
    });

  return { success: true };
}
