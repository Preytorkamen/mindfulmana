export default function Header() {
  return (
    <header className="header">
      <div className="header_inner">
        <div className="brand">
          <span className="brand_logo" aria-hidden></span>
          <h1 className="title">Meditations</h1>
        </div>
        <button className="ghost">About</button>
      </div>
    </header>
  );
}