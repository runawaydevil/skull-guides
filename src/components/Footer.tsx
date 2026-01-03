import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <p>© {currentYear} runawaydevil — skull-guides</p>
    </footer>
  );
}

