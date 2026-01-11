export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden text-white"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b021f] via-[#1a0638] to-[#2b0a5a]" />

      {/* Soft glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl font-extrabold tracking-widest">
          NOVA
        </h1>

        <p className="mt-4 text-purple-300 text-lg">
          Where Ideas Collide.
        </p>

        <button className="mt-10 px-10 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition">
          Join The Event
        </button>
      </div>
    </section>
  );
}
