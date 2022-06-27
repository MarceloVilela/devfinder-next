import { UserData } from '../../hooks/auth'
import { UserThumb } from './style';

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
          <UserThumb className="card">
            <div className="avatar">
              <a
                href={`https://github.com/${user.user}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={user.avatar} alt={user.name}  />
              </a>
            </div>

            <aside>
              <div className='bio'>

                <header>
                  <a href={`/user/${user.user}`}>
                    <strong>{user.name}</strong>
                  </a>
                  {children}
                </header>

                <small>{user.bio}</small>
              </div>
            </aside>

          </UserThumb>
        ) : (
          <UserThumb className="placeholder card">
            <div className="avatar">
              <div></div>
            </div>

            <aside>
              <div className='bio'>

                <header>
                  <p></p>
                </header>

                <p></p>
              </div>
            </aside>

          </UserThumb>
        )}
    </>

  );
}

export default UserItem;
