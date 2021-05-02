import React from 'react';

import { ChannelData } from '../../pages/channel/[slug]';
import { ChannelThumb } from './style';

interface ItemProps {
  item: ChannelData;
  placeholder: boolean;
}

const ChannelItem: React.FC<ItemProps> = ({ item, placeholder }) => {
  return (
    <>
      {!placeholder
        ? (
          <ChannelThumb className="card">
            <div className="avatar">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.avatar ? item.avatar : 'https://yt3.ggpht.com/a/AATXAJzF6fuUyEFRBtZSpScb9M-Dq4QI6pyv0ic3pw=s100-c-k-c0xffffffff-no-rj-mo'}
                  alt={item.name}
                />
              </a>
            </div>

            <aside>
              <a href={`/channel/${item.name}`}>
                <strong>{item.name}</strong>
              </a>
              <small>{item.tags.join(", ")}</small>
            </aside>
          </ChannelThumb>
        ) : (
          <ChannelThumb className="placeholder card">
            <div className="avatar">
            </div>

            <aside>
              <p></p>
              <p></p>
            </aside>
          </ChannelThumb>
        )}
    </>

  );
}

export default ChannelItem;
