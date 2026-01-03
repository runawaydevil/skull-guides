import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Developed by{' '}
        <a 
          href="https://github.com/runawaydevil" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          runawaydevil
        </a>
        {' '}— 2026
      </p>
    </footer>
  );
}

