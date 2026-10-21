// Course demo: these roles control Vue pages only, not Firebase server permissions.
// Assign staff by immutable Firebase UID, never by an email or a form selection.
export const librarianUids = new Set(
  (import.meta.env.VITE_LIBRARIAN_UIDS || '').split(',').map((uid) => uid.trim()).filter(Boolean)
)

export const roleForUser = (user) => {
  if (!user) return null
  return librarianUids.has(user.uid) ? 'librarian' : 'member'
}

export const canAccessRole = (role, allowedRoles) => allowedRoles.includes(role)
