export default function Home() {
  return (
    <main className='flex flex-1 flex-col items-center justify-center overflow-y-auto'>
      <div className='px-5 py-20 text-center md:px-10'>
        <p className='text-4xl font-extrabold leading-relaxed tracking-tighter md:text-5xl md:leading-relaxed'>
          <span>A</span>{' '}
          <span className=" relative after:absolute after:-bottom-5 after:left-0 after:-z-20 after:block after:h-5 after:w-full after:animate-bounce after:bg-[url('/images/green-line.svg')] after:bg-[length:100%_100%] after:bg-bottom after:bg-no-repeat after:content-['']">
            simple
          </span>{' '}
          <span>web help desk system for a team like yours</span>
        </p>
      </div>
    </main>
  )
}
