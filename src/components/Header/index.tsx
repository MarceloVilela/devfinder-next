'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import {
  FaYoutube,
  FaGithub,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import { ActionMeta, GetOptionLabel, SingleValue } from 'react-select';
import { toast } from 'react-toastify';
// ssr:false porque react-select gera ids aleatórios que dão mismatch de hidratação — o
// `loading` abaixo ocupa o mesmo espaço (mesmo seletor CSS `section > div`) antes do chunk
// carregar, pra não sumir/dar flick na barra de busca (só falta a interatividade por um instante).
const AsyncSelect = dynamic(() => import("react-select/async"), {
  ssr: false,
  loading: () => <div aria-hidden="true" />,
});

import './style.css';
import api from '../../services/api';
import { useAuth, isLoggedIn } from '../../hooks/auth';

type Option = {
  value: string;
  label: string;
  type: string;
}

export default function Header() {
  const router = useRouter();
  const { user, signOut, isHydrated } = useAuth();

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

  // router.refresh() reexecuta os Server Components da rota atual (Subs/UserLiked/UserDisliked
  // já vieram renderizados no HTML antes do clique) com o cookie de sessão já limpo — sem isso,
  // as seções personalizadas ficam visíveis na tela até a próxima navegação, mesmo com a sessão
  // já encerrada. Só faz sentido reexecutar se o backend confirmou o logout (signOut() sempre
  // limpa o estado local mesmo em falha, mas só retorna `true` se o cookie foi de fato limpo no
  // servidor) — sem essa checagem, um `/auth/logout` que falhou reexecutaria os Server
  // Components com o cookie ainda válido, mostrando dado de quem "saiu" ao lado de um header que
  // já diz "Entrar" (achado #2, code-review Etapa 2).
  const handleSignOut = async () => {
    const confirmedByBackend = await signOut();

    if (confirmedByBackend) {
      router.refresh();
    } else {
      toast.error('Não foi possível confirmar o encerramento da sessão com o servidor. Tente novamente.');
    }
  };

  return (
    <header className="header-wrapper">
      <section>
        <Link href={`/`}>
            <h1 className="logo">{process.env.NEXT_PUBLIC_TITLE}</h1>
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
              <FaHome />
              <span>Home</span>
          </Link>

          <Link href={`/user`}>
              <FaGithub />
              <span>Usuários</span>
          </Link>

          <Link href={`/channel`}>
              <FaYoutube />
              <span>Canais</span>
          </Link>

          {!isHydrated ? (
            // Placeholder invisível com o mesmo espaço reservado do item real — evita o flash
            // "Entrar" -> "Sair" enquanto a sessão ainda hidrata (GET /me em andamento), mesma
            // técnica do `loading` do AsyncSelect logo acima (achado #5, code-review Etapa 2).
            <span aria-hidden="true" className="invisible ml-4 flex flex-col items-center text-[0.8rem]">
              <FaUserCircle />
              <span>Entrar</span>
            </span>
          ) : isLoggedIn(user) ? (
            <button type="button" onClick={handleSignOut}>
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          ) : (
            <Link href={`/login`}>
                <FaUserCircle />
                <span>Entrar</span>
            </Link>
          )}

        </nav >
      </section >
    </header >
  )
}