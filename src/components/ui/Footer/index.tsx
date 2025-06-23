// src/components/Footer.tsx
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full h-30 px-6 bg-zinc-200 text-zinc-800 flex items-center justify-between">
      <p className="text-sm absolute left-6">ranieriiuri Developments © 2025</p>
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <h2 className="text-sm">Conheça outros projetos:</h2>
        <a
          href="https://www.linkedin.com/in/ranieriiuri/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="text-2xl text-slate-700 hover:text-amber-700" />
        </a>
        <a
          href="https://github.com/ranieriiuri"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub className="text-2xl text-slate-700 hover:text-amber-700" />
        </a>
      </div>
    </footer>
  );
}
