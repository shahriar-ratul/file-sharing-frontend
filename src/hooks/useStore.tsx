import { StoreContext } from '@/store/store-provider';
import { useContext } from 'react';

export const useStores = () => {
    return useContext(StoreContext);
};
