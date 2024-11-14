interface Error401StateProps {
    error: Error;
}

// eslint-disable-next-line react/prop-types
const Error401: React.FC<Error401StateProps> = () => {
    return (
        <>
            <div className='min-h-screen flex flex-grow items-center justify-center bg-gray-50'>
                <div className='rounded-lg bg-white p-8 text-center shadow-xl'>
                    <h1 className='mb-4 text-4xl font-bold'>Coming Soon</h1>
                    <p className='text-gray-600'>The page you are looking for is coming soon.</p>
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

export default Error401;
