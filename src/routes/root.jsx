import { Link, Outlet } from "react-router-dom";

//Dummy root component mockup (Chat GPT), will replace later
export default function Root() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom right, #fff5e1, #ffe0b2)",
      }}
    >
      {/* Header / Navbar */}
      <header
        className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm rounded-b-2xl mx-4 mt-4"
        style={{ border: "1px solid rgba(255,255,255,0.4)" }}
      >
        <h1 className="text-xl font-semibold text-gray-800">
          <Link to="selection">Meditations</Link>
        </h1>
        <nav>
          <Link
            to="/about"
            className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>

      {/* Optional Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Meditation App
      </footer>
    </div>
  );
}