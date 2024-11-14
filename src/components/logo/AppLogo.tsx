import Image from 'next/image';
import React from 'react';

const AppLogo = () => {
    return (
        <div className='flex flex-row cursor-pointer items-center min-h-12 mr-2'>
            <Image src='/images/logo/logo.jpg' alt='logo' height={200} width={400} />
        </div>
    );
};

export default AppLogo;
