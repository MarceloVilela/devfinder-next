'use client';

import React, { useState, useMemo } from 'react'

import { useAuth } from '../../hooks/auth';
import { Container, ChannelItem } from '../../components'
import { ChannelData } from '../../types'
import ChannelContainer from '../channel/style';

interface ChannelsGroupedByCategory {
  [key: string]: ChannelData[];
}

interface ChannelCategoriesProps {
  channelsStatic: ChannelData[];
}

export default function ChannelCategories({ channelsStatic }: ChannelCategoriesProps) {
  const { user, isHydrated } = useAuth();

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const channels = channelsStatic;

  const channelsCategorized = useMemo(() => {
    const items = channels;
    const categoriesName = items?.map(item => item.category)

    let data = { 'Todos os canais': channels } as ChannelsGroupedByCategory;

    if (isHydrated && user && user.follow) {
      data['Favoritos'] = channels.filter(item => user.follow.includes(item._id));
      data['Não seguidos'] = channels.filter(item => user.ignore.includes(item._id));
    }

    categoriesName.forEach(category => {
      if (category !== 'Todos os canais') {
        data[category] = channels.filter(item => item.category === category)
      }
    })

    return data
  }, [channels, user, isHydrated])

  const categories = useMemo(() => {
    return Object.keys(channelsCategorized)
  }, [channelsCategorized])

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];

  return (
    <Container loading={false}>
      <ChannelContainer>

        <section>
          <select
            aria-label="Filtrar canais por categoria"
            value={activeCategoryIndex}
            onChange={(e) => setActiveCategoryIndex(Number(e.target.value))}
          >
            {categories?.map((name, key) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>

          <ul className='channels list-flex-row'>
            {channelsCategorized[activeCategory]?.map((item) => (
              <ChannelItem item={item} placeholder={false} key={item._id} />
            ))}
          </ul>
        </section>
      </ChannelContainer>
    </Container>
  )
}
