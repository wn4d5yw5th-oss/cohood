import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eujxukklmdieqgpiizoh.supabase.co'
const supabaseKey = 'sb_publishable_34mY4brvFjRi5hXFy7sf_A_ux62cJhe'

export const supabase = createClient(supabaseUrl, supabaseKey)
