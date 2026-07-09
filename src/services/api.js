import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

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

export const getOrdersWithDetails = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      vehicle:vehicle_id ( plate ),
      mechanic:mechanic_id ( name )
    `);

  if (error) throw error;

  return data.map((item) => ({
    ...item,
    orderNumber: item.order_number,
    entryDate: item.entry_date,
    estimatedValue: item.estimated_value,
    vehicleLabel: item.vehicle?.plate || '',
    mechanicName: item.mechanic?.name || '',
  }));
};

export const getOrderByIdWithDetails = async (id) => {
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      vehicle:vehicle_id ( plate ),
      mechanic:mechanic_id ( name )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    orderNumber: data.order_number,
    entryDate: data.entry_date,
    estimatedValue: data.estimated_value,
    vehicleLabel: data.vehicle?.plate || '',
    mechanicName: data.mechanic?.name || '',
  };
};

export const getVehiclesWithOwner = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      owner:client_id ( name )
    `);

  if (error) throw error;

  return data.map((item) => ({
    ...item,
    ownerName: item.owner?.name || '',
  }));
};

export const deleteResource = async (resource, id) => {
  const { data, error } = await supabase
    .from(resource)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteResource error:', error);
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