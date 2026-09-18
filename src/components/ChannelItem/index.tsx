import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ChannelData } from '../../types';
import { classNames } from '../../lib/classNames';
import { SKELETON_BAR_CLASSNAME, SKELETON_COLOR_CLASSNAME } from '../../lib/skeletonClassName';

interface ItemProps {
  item: ChannelData;
  placeholder: boolean;
}

const ChannelItem: React.FC<ItemProps> = ({ item, placeholder }) => {
  return (
    <>
      {!placeholder
        ? (
          <li className="card rounded-lg bg-background-weakerer md:bg-inherit">
            <div className="avatar flex justify-center items-center ml-4 md:ml-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="w-16 rounded-full"
                  src={item.avatar ? item.avatar : 'https://yt3.ggpht.com/a/AATXAJzF6fuUyEFRBtZSpScb9M-Dq4QI6pyv0ic3pw=s100-c-k-c0xffffffff-no-rj-mo'}
                  alt={item.name}
                  width={64}
                  height={64}
                />
              </a>
            </div>

            <aside className="flex flex-col justify-center flex-1 py-[15px] px-5 text-left rounded-b-[5px]">
              <Link href={`/channel/${item.name}`}>
                <strong className="text-base text-foreground-stronger">{item.name}</strong>
              </Link>
              <small className="text-sm text-foreground-strong mt-[5px] leading-5 h-10 overflow-hidden">{item.tags.join(", ")}</small>
            </aside>
          </li>
        ) : (
          <li className="placeholder card rounded-lg bg-background-weakerer md:bg-inherit">
            <div className={classNames('avatar flex justify-center items-center ml-4 md:ml-0 w-16 h-16 rounded-full', SKELETON_COLOR_CLASSNAME)}>
            </div>

            <aside className="flex flex-col justify-center flex-1 py-[15px] px-5 text-left rounded-b-[5px]">
              <p className={SKELETON_BAR_CLASSNAME}></p>
              <p className={SKELETON_BAR_CLASSNAME}></p>
            </aside>
          </li>
        )}
    </>

  );
}

export default ChannelItem;
