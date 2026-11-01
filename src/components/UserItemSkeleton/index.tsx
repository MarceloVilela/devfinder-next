import { classNames } from '../../lib/classNames'
import { SKELETON_BAR_CLASSNAME, SKELETON_COLOR_CLASSNAME } from '../../lib/skeletonClassName'
import '../UserItem/style.css';

// Esqueleto do card de `UserItem` — componente próprio em vez de ramo `placeholder` dentro dele
// (achado L1, v5). Reaproveita o `style.css` do `UserItem` porque as classes `user-card`/`card`
// definem a mesma moldura.
const UserItemSkeleton: React.FC = () => {
  return (
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
  );
}

export default UserItemSkeleton;
