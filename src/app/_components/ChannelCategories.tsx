'use client';

import React, { useState, useMemo, Fragment } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-ignore
import 'react-tabs/style/react-tabs.css';

import { useAuth } from '../../hooks/auth';
import { Container, ChannelItem } from '../../components'
import { ChannelData } from '../../types'
import ChannelContainer from '../channel/style';

interface ChannelsGroupedByCategory {
  [key: string]: ChannelData[];
}

interface CategoryCounter {
  [key: string]: number;
}

interface ChannelCategoriesProps {
  channelsStatic: ChannelData[];
}

export default function ChannelCategories({ channelsStatic }: ChannelCategoriesProps) {
  const { user, isHydrated } = useAuth();

  const [tabIndex, setTabIndex] = useState(0);
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

  const categoryCount = useMemo(() => {
    let data = {} as CategoryCounter;
    Object.keys(channelsCategorized).forEach(categoryName => {
      data[categoryName] = channelsCategorized[categoryName].length
    })
    return data;
  }, [channelsCategorized])

  return (
    <Container loading={false}>
      <ChannelContainer>

        <section>
          <select onChange={(e) => setTabIndex(Number(e.target.value))}>
            {categories?.map((name, key) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>

          <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>

            <TabList>
              {categories?.map(name => (
                <Tab key={name}>{name}({categoryCount[name]})</Tab>
              ))}
            </TabList>

            {categories?.map(name => (
              <TabPanel key={name}>
                <ul className='channels list-flex-row'>
                  {channelsCategorized[name]?.map((item) => (
                    <ChannelItem item={item} placeholder={false} key={item._id} />
                  ))}
                </ul>
              </TabPanel>
            ))}
          </Tabs>
        </section>
      </ChannelContainer>
    </Container>
  )
}
