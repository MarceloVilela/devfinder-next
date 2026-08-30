'use client';

import React, { useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

import { PaginateList } from './style';

interface PaginateProps {
  page: number;
  totalItems?: number;
  itemsPerPage?: number;
  // Opcional: quando ausente, o Paginate navega sozinho via `?page=N` na URL (usado pelas
  // listagens SSR/RSC). Passe um callback só quando a paginação for controlada localmente por
  // estado do próprio componente pai (ex.: Subs.tsx, que é CSR por depender da sessão).
  handlePaginate?(goTo: number): void;
}

const Paginate: React.FC<PaginateProps> = ({ page, totalItems, itemsPerPage, handlePaginate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateToPage = useCallback((goTo: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(goTo));
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const totalPages = useMemo(() => {
    if (totalItems && itemsPerPage) {
      return Math.ceil(totalItems / itemsPerPage);
    }
    return 0;
  }, [totalItems, itemsPerPage])

  const numberedList = useMemo(() => {
    return Array.from(Array(totalPages).keys()).map(item => item + 1)
  }, [totalPages])

  const shortenedList = useMemo(() => {
    // .slice (não .splice): .splice muta o array original, e numberedList só é recalculado
    // quando totalPages muda — como o total não muda entre páginas de uma mesma listagem, a
    // navegação client-side (sem remount) ia corroendo o mesmo array a cada clique.
    const start = page - 3 < 0 ? 0 : page - 3;
    return numberedList.slice(start, start + 5)
  }, [numberedList, page])

  const _handlePaginate = (page: number) => {
    window.scrollTo(0, 0);
    (handlePaginate ?? navigateToPage)(page);
  }

  return (
    <>
      <PaginateList className="paginate">
        {page !== 1 &&
          <li onClick={() => _handlePaginate(1)}>
            <FaAngleDoubleLeft className="begin" />
          </li>
        }
        {shortenedList.map(item => (
          <li
            key={item}
            onClick={() => _handlePaginate(item)}
            className={`${item === page ? 'selected' : ''}`}
          >{item}</li>
        ))}
        {page !== totalPages &&
          <li onClick={() => _handlePaginate(totalPages)}>
            <FaAngleDoubleRight className="end" />
          </li>
        }
      </PaginateList>
    </>
  );
}

export default Paginate;
