import { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.user?.user_metadata?.role

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }

  next()
}
