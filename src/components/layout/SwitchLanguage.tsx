import { GlobeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import cn from '@/assets/flag/cn.svg';
import de from '@/assets/flag/de.svg';
import gb from '@/assets/flag/gb.svg';
import jp from '@/assets/flag/jp.svg';

export default function SwtichLanguage() {
    const items = [
        {
            label: '英文',
            img: gb,
        },
        {
            label: '中文',
            img: cn,
        },
        {
            label: '日文',
            img: jp,
        },
        {
            label: '德文',
            img: de,
        },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <GlobeIcon className='h-5 w-5' />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {items.map((item) => (
                    <DropdownMenuItem key={item.label} className='gap-1'>
                        <Image alt='' src={item.img} className='w-6 rounded-sm' /> {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
