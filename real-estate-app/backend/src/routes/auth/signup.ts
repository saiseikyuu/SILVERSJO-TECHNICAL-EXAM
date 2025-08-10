import { Router } from 'express'
import { supabaseAdmin } from '../../lib/supabase.js'

const router = Router()

router.post('/signup', async (req, res) => {
  const { email, password, role = 'user' } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  // Create user in Supabase Auth
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })

  if (userError || !userData?.user?.id) {
    return res.status(500).json({ error: userError?.message || 'Failed to create user.' })
  }

  const { id } = userData.user

  // Insert into profiles table
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([{ id, email, role }])

  if (profileError) {
    return res.status(500).json({ error: profileError.message })
  }

  return res.status(201).json({ message: `User ${email} created with role ${role}` })
})

export default router
