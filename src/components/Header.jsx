import '../styles/header.css';

export default function Header({title}) {
  return (
    <header className="header">
      <div className="header_inner">
        <div className="brand">
          <span className="brand_logo" aria-hidden></span>
          <h1 className="title">{title}</h1>
        </div>
        <button className="ghost">About</button>
      </div>
    </header>
  );
}