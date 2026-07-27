import { useEffect, useState } from 'react'
import { SkeletonTableRows } from '../../components/Skeleton'
import { apiClient } from '../../lib/apiClient'

interface ApiUser {
  id: string
  name: string
  email: string
  role: 'customer' | 'restaurant_owner' | 'admin'
  emailVerified: boolean
  rewardPoints: number
}

const ROLES: ApiUser['role'][] = ['customer', 'restaurant_owner', 'admin']

export function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = () => {
    setStatus('loading')
    apiClient
      .get<ApiUser[]>('/users?limit=50')
      .then((data) => {
        setUsers(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const updateRole = async (id: string, role: ApiUser['role']) => {
    await apiClient.patch(`/users/${id}/role`, { role })
    load()
  }

  return (
    <div>
      <h1>Users</h1>
      {status === 'error' && <p className="browse-status">Couldn't load users.</p>}
      {status === 'ready' && users.length === 0 && <p className="browse-status">No users yet.</p>}
      {status !== 'error' && (status === 'loading' || users.length > 0) && (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Verified</th><th>Points</th><th>Role</th></tr>
          </thead>
          <tbody>
            {status === 'loading' && <SkeletonTableRows columns={5} />}
            {status === 'ready' && users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.emailVerified ? 'Yes' : 'No'}</td>
                <td>{user.rewardPoints}</td>
                <td>
                  <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value as ApiUser['role'])}>
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
