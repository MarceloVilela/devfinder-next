'use client';

import React from 'react';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import { useStyleSwitcher } from '../../hooks/styleSwitcher';
import './style.css';

const Footer: React.FC = () => {
  const { switchAlias, alias } = useStyleSwitcher();

  return (
    <footer className="site-footer bg-[#222] text-[#ccc]">
      <div className="max-w-[980px] mx-auto py-4 flex justify-between text-center">
        <div>
          <a
            className="text-[#ccc] cursor-pointer inline-flex items-center"
            href="https://github.com/marcelovilela/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub color="#fff" />
            /marcelovilela
          </a>

          <a
            className="text-[#ccc] cursor-pointer ml-4 inline-flex items-center"
            href="https://www.youtube.com/channel/UC13UqsEmsJ9Z9w0--ABhxCg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube color="#fff" />
            /devfinder
          </a>
        </div>
        <div>
          <button
            className="text-[#ccc] cursor-pointer bg-transparent border-0 p-0 [font:inherit]"
            type="button"
            onClick={() => switchAlias()}
            aria-pressed={alias === 'dark'}
            aria-label={`Alternar tema, atual: ${alias === 'dark' ? 'escuro' : 'claro'}`}
          >
            Tema {alias}
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
