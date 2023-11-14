import React from 'react'

export default function ThreadProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>
        {children}
    </div>
  )
}
