import Header from '../components/Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="pt-6 px-4">
        {children}
      </main>
    </div>
  )
}
