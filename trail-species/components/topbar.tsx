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

      <nav>
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
