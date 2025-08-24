import { supabase } from '../lib/supabase'

// Example queries for common operations

// SELECT - Get all records from a table
export const getAllRecords = async (tableName: string) => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
  
  if (error) throw error
  return data
}

// SELECT with conditions
export const getRecordsWithFilter = async (tableName: string, column: string, value: any) => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq(column, value)
  
  if (error) throw error
  return data
}

// INSERT - Add new record
export const insertRecord = async (tableName: string, record: any) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert(record)
    .select()
  
  if (error) throw error
  return data
}

// UPDATE - Update existing record
export const updateRecord = async (tableName: string, id: string, updates: any) => {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

// DELETE - Remove record
export const deleteRecord = async (tableName: string, id: string) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Authentication queries
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}