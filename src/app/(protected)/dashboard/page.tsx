'use client';
import { useStores } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';

const HomePage = observer(() => {
    const {
        uiStore: { count, increment },
    } = useStores();

    return (
        <>
            <div>{count}</div>
            <button type='button' onClick={increment}>
                Increment
            </button>
        </>
    );
});

export default HomePage;
