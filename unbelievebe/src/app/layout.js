import './globals.css'

export const metadata = {
  title: 'Unbelievebe — Malaysian Landlord Advisor',
  description: 'Instant legal advice for Malaysian landlords on rental management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 h-full">{children}</body>
    </html>
  )
}
