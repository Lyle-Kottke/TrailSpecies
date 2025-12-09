'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const pathname = usePathname()
  // do not show topbar on login page
  if (pathname === '/login') return null;

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 text-white">
      <div className="text-xl font-semibold">
        <Link href="/">TrailSpecies</Link>
      </div>

      <nav className="flex gap-6 items-center">
        <Link 
          href="/community_trails"
          className="text-gray-400 hover:text-gray-200"
        >
          Community Trails
        </Link>
        <Link 
          href="/user_custom_trails"
          className="text-gray-400 hover:text-gray-200"
        >
          My Created Trails
        </Link>
        <Link 
          href="/saved_searches"
          className="text-gray-400 hover:text-gray-200"
        >
          My Saved Searches
        </Link>
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
