import LoginComponent from '@/modules/auth/login-component';
import { Suspense } from 'react';

export default function Home() {
    return (
        <>
            <Suspense fallback='Loading...'>
                <div className='min-h-screen bg-red-500 text-gray-900 flex justify-center'>
                    <div className='max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
                        <div className='lg:w-1/2 xl:w-7/12 w-full p-6 sm:p-12'>
                            <LoginComponent />
                        </div>
                        <div className='flex-1 bg-gray-200 text-center hidden lg:flex'>
                            <div
                                className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
                                style={{
                                    backgroundImage: `url(
                  "https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
                )`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
}
