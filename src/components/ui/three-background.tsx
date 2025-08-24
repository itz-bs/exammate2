export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-1/3 left-1/5 w-24 h-24 border-2 border-blue-500/20 rotate-45 animate-bounce" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-indigo-500/20 rounded-lg animate-pulse" style={{ animationDuration: '3s' }} />
    </div>
  );
};