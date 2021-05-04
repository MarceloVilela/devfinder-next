import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { FaYoutube, FaGithub, FaHome, FaSearch } from 'react-icons/fa';
import AsyncSelect from 'react-select/async';

import Wrapper from './style'
import api from '../../services/api';

export default function Header() {
  const router = useRouter();

  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(false) }, [])

  // handle input change event
  const handleInputChange = value => {
    setValue(value);
  };

  // handle selection
  const handleChange = ({ value, label }) => {
    router.push(value);
  }

  // load options using API call
  const loadOptions = (inputValue) => {
    const formatOption = ({ value, label, type }) => type === 'channel'
      ? { value: `/channel/${value}`, label }
      : { value: `/video/${value}`, label }

    return api.get('/search', { params: { q: inputValue } })
      .then(({ data }) => data.map(({ value, label, type }) => formatOption({ value, label, type })));
  };

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

          <a href='#' onClick={() => setIsVisible(true)}>
            <FaSearch />
            <span>Buscar</span>
            {isVisible &&
              <AsyncSelect
                value={selectedValue}
                getOptionLabel={e => e.label}
                getOptionValue={e => e.value}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
                placeholder='Buscar'
                noOptionsMessage={() => 'Nada encontrado'}
                onBlur={() => setIsVisible(false)}
              />
            }
          </a>

          {/*
          <Link href={`/login?logout=1`}>
            <a>
              <FaSignOutAlt />
              <span>Sair</span>
            </a>
          </Link>
          */}
        </nav >
      </section >
    </Wrapper >
  )
}