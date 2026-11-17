export function Background() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-100 overflow-hidden">
      <div className="absolute -top-10 -left-10 size-40 rounded-full bg-primary animate-pulse motion-reduce:animate-none delay-0"></div>
      <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-accent animate-pulse motion-reduce:animate-none delay-500"></div>

      <div className="absolute top-1/3 left-2/3 size-24 rotate-45 bg-primary/70 animate-pulse motion-reduce:animate-none delay-700"></div>
      <div className="absolute top-2/3 left-1/6 size-20 rotate-45 bg-accent/70 animate-pulse motion-reduce:animate-none delay-1100"></div>

      <div className="absolute top-1/4 left-1/4 size-24 rotate-45 bg-accent/70 animate-pulse motion-reduce:animate-none delay-1300"></div>
      <div className="absolute top-3/4 left-3/4 size-20 rotate-45 bg-primary/70 animate-pulse motion-reduce:animate-none delay-1700"></div>
    </div>
  )
}
