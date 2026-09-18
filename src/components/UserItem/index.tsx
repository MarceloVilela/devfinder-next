import Image from 'next/image'
import Link from 'next/link'

import { UserData } from '../../hooks/auth'
import { classNames } from '../../lib/classNames'
import { SKELETON_BAR_CLASSNAME, SKELETON_COLOR_CLASSNAME } from '../../lib/skeletonClassName'
import './style.css';

interface UserItemProps {
  user: UserData;
  placeholder: boolean;
  children?: React.ReactNode;
}

const UserItem: React.FC<UserItemProps> = ({ user, placeholder, children }) => {
  return (
    <>
      {!placeholder
        ? (
          <li className="user-card card rounded-[10px] cursor-default! bg-background-weak mb-4">
            <div className="avatar flex justify-center items-center ml-4">
              <a
                href={`https://github.com/${user.user}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image className="rounded-full" src={user.avatar} alt={user.name} width={48} height={48} />
              </a>
            </div>

            <aside className="flex flex-col justify-between flex-1 bg-inherit border-0 py-[15px] px-5 text-left rounded-b-[5px]">
              <div className='bio'>

                <header className="flex items-center justify-between">
                  <Link href={`/user/${user.user}`}>
                    <strong className="text-base text-foreground-stronger">{user.name}</strong>
                  </Link>
                  {children}
                </header>

                <small className="block overflow-hidden text-sm text-foreground-stronger mt-[5px]">{user.bio}</small>
              </div>
            </aside>

          </li>
        ) : (
          <li className="user-card placeholder card rounded-[10px] cursor-default! bg-background-weak mb-4">
            <div className="avatar flex justify-center items-center ml-4">
              <div className={classNames('w-12 h-12 rounded-full', SKELETON_COLOR_CLASSNAME)}></div>
            </div>

            <aside className="flex flex-col justify-between flex-1 bg-inherit border-0 py-[15px] px-5 text-left rounded-b-[5px]">
              <div className='bio'>

                <header className="flex items-center justify-between">
                  <p className={classNames('flex-1', SKELETON_BAR_CLASSNAME)}></p>
                </header>

                <p className={classNames('flex-1', SKELETON_BAR_CLASSNAME)}></p>
              </div>
            </aside>

          </li>
        )}
    </>

  );
}

export default UserItem;
