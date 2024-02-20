export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col md:bg-gradient-to-r md:from-teal-600 md:from-50% md:via-background md:via-50% md:to-background'>
      <div className='container relative flex flex-1 flex-col md:flex-row'>
        <div className='sticky top-0 hidden h-screen md:flex md:basis-1/2 md:flex-col'></div>
        <div className='flex flex-1 flex-col max-sm:min-h-screen md:basis-1/2'>
          {children}
        </div>
      </div>
    </div>
  )
}
