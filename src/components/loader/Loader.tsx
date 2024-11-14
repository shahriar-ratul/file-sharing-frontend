import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Loader = ({ className }: { className?: string }) => {
    return (
        <>
            <div className='flex justify-center align-middle items-center'>
                <Loader2 className={cn('my-28 h-16 w-16 text-primary/60 animate-spin', className)} />
                <span>
                    <h1 className='text-4xl font-bold text-primary'>Loading...</h1>
                </span>
            </div>
        </>
    );
};

export default Loader;
