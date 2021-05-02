import React from 'react'
import Link from 'next/link'
import { FaYoutube, FaGithub, FaSignOutAlt, FaHome } from 'react-icons/fa';

import Wrapper from './style'

export default function Header() {
  return (
    <Wrapper>
      <section>
        <Link href={`/`}>
          <a>
            <h1 className="logo">{process.env.NEXT_PUBLIC_TITLE}</h1>
          </a>
        </Link>

        <nav>
          <Link href={`/`}>
            <a>
              <FaHome />
              <span>Home</span>
            </a>
          </Link>

          <Link href={`/user`}>
            <a>
              <FaGithub />
              <span>Usuários</span>
            </a>
          </Link>

          <Link href={`/channel`}>
            <a>
              <FaYoutube />
              <span>Canais</span>
            </a>
          </Link>

          <Link href={`/login?logout=1`}>
            <a>
              <FaSignOutAlt />
              <span>Sair</span>
            </a>
          </Link >
        </nav >
      </section >
    </Wrapper >
  )
}