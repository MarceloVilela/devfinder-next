import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import {
  FaYoutube,
  FaGithub,
  FaHome,
  FaSearch,
  // FaSignOutAlt, 
  FaUserCircle
} from 'react-icons/fa';
import { ActionMeta, GetOptionLabel, SingleValue } from 'react-select';
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false, });
//mport AsyncSelect from 'react-select/async';

import Wrapper from './style'
import api from '../../services/api';

type Option = {
  value: string;
  label: string;
  type: string;
}

export default function Header() {
  const router = useRouter();

  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<Option>({} as Option);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(false) }, [])

  // handle input change event
  const handleInputChange = (value: string) => {
    setValue(value);
  };

  const getLabel = (option: Option) => option.label

  const getValue = (option: Option) => {
    return option.value;
  }

  // handle selection
  const handleChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    const { value } = newValue as Option;
    router.push(value);
  }

  // load options using API call
  const loadOptions = (inputValue: string): Promise<Option[]> => {
    const formatOption = ({ value, label, type }: Option) => type === 'channel'
      ? { value: `/channel/${value}`, label }
      : { value: `/video/${value}`, label }

    return api.get('/search', { params: { q: inputValue } })
      .then(({ data }) => data.map(({ value, label, type }: Option) => formatOption({ value, label, type })));
  };

  return (
    <Wrapper>
      <section>
        <Link href={`/`}>
          <a>
            <h1 className="logo">{process.env.NEXT_PUBLIC_TITLE}</h1>
          </a>
        </Link>

        <AsyncSelect
          loadOptions={loadOptions}
          onInputChange={handleInputChange}
          onChange={handleChange}
          placeholder='Buscar'
          noOptionsMessage={() => 'Nada encontrado'}
          onBlur={() => setIsVisible(false)}
        />

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
              <FaUserCircle />
              <span>Conta</span>
            </a>
          </Link>

        </nav >
      </section >
    </Wrapper >
  )
}