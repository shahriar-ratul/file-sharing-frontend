const Forbidden: React.FC = () => {
    return (
        <>
            <div className='min-h-screen flex flex-grow items-center justify-center bg-gray-50'>
                <div className='rounded-lg bg-white p-8 text-center shadow-xl'>
                    <h1 className='mb-4 text-4xl font-bold'>Unauthorized Access</h1>
                    <p className='text-gray-600'>You do not have permission to access this page.</p>
                    <a
                        href='/'
                        className='mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600'
                    >
                        {' '}
                        Go back to Home{' '}
                    </a>
                </div>
            </div>
        </>
    );
};

export default Forbidden;
