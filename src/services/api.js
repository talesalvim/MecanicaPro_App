import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

const supabaseUrl = 'https://qqufxmpufkukuztptmdr.supabase.co';
const supabaseAnonKey = 'sb_publishable_6ifvXAhZjea2dxkewG5-vQ_NlDtgJhH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getResource = async (resource) => {
  const { data, error } = await supabase.from(resource).select('*');
  if (error) throw error;
  return data;
};

export const postResource = async (resource, body) => {
  const { data, error } = await supabase
    .from(resource)
    .insert([body])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const patchResource = async (resource, id, body) => {
  const { data, error } = await supabase
    .from(resource)
    .update(body)      
    .eq('id', id)      
    .select()          
    .single();         

  if (error) {
    throw error;
  }

  return data;
};

export const signUpUser = async (userData) => {
  const encryptedPassword = CryptoJS.MD5(userData.password).toString();

  const encryptedBody = {
    name: userData.name,
    email: userData.email,
    password: encryptedPassword, 
    phone: userData.phone,
  };

  return await postResource('users', encryptedBody);
};

export const loginUser = async (email, password) => {
  const encryptedPassword = CryptoJS.MD5(password).toString();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('password', encryptedPassword)
    .single(); 

  if (error) {
    throw new Error('E-mail ou senha incorretos');
  }

  return data; 
};