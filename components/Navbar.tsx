"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-white">
        
        {/* Brand */}
        <span
          onClick={() => scrollTo("home")}
          className="font-bold tracking-widest cursor-pointer"
        >
          NOVA
        </span>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => scrollTo("home")}
            className="hover:text-purple-400 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("event-planner")}
            className="hover:text-purple-400 transition"
          >
            Planner
          </button>
        </div>
      </div>
    </nav>
  );
}
