import { icons } from '../../assets/assets';

const UserProfile = ({ userImg, notifications = false }) => {
    return (
        <div className='flex items-center gap-6'>
            <button className='relative' aria-label='notificações'>
                <img
                    src={icons.notification}
                    alt='icone de notificações'
                    className='w-8 h-8'
                />
                {notifications && (
                    <span className='absolute top-1 right-1 -mt-1 -mr-1 inline-block h-3 w-3 bg-red-500 rounded-full'></span>
                )}
            </button>
            <button
                className='flex justify-center items-center h-12 w-12 bg-gray-400 rounded-full'
                aria-label='perfil do usuario'
            >
                {userImg ? (
                    <img
                        src={userImg}
                        alt='icone do ussuario'
                        className='h-10 rounded-full'
                    />
                ) : (
                    <img
                        src={icons.userSolid}
                        alt='icone do usuario'
                        className='h-10 rounded-full'
                    />
                )}
            </button>
        </div>
    );
};

export default UserProfile;
