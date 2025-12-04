'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const pathname = usePathname()

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 text-white">
      <div className="text-xl font-semibold">
        <Link href="/">TrailSpecies</Link>
      </div>

      <nav className="flex gap-6 items-center">
        {/* spread out links on navbar */}
        <Link href="/community_trails">Community Trails</Link>
        <Link href="/user_custom_trails">My Created Trails</Link>
        {pathname !== '/login' && (
          <Link
            href="/login"
            className="text-green-600 hover:text-green-300 font-medium"
          >
            Login/Signup
          </Link>
        )}
      </nav>
    </header>
  )
}
