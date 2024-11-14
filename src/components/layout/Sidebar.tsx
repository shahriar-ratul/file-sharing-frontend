'use client';

import { ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { mainRoutes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: () => void;
}

export default function Sidebar({ className, onClick }: SidebarProps) {
    const pathName = usePathname();

    return (
        <div className={cn('flex h-full w-[240px] flex-col top-0', className)}>
            <div className='flex h-16 w-full items-center justify-center gap-2 border-b text-lg font-medium'>
                <User className='h-9 w-9' /> Hello-Admin
            </div>
            <div className='py-4'>
                {mainRoutes.map((section, sectionIdx) => (
                    <div key={`main-${section.title}-${sectionIdx}`} className='px-3 py-2'>
                        <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>{section.title}</h2>
                        {section.items?.map((item, itemIdx) => (
                            <SidebarItem
                                key={`sub-${section.title}-${item.title}-${itemIdx}`}
                                item={item}
                                pathName={pathName}
                                onClick={onClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SidebarItem({
    item,
    pathName,
    onClick,
}: {
    item: NavItem;
    pathName: string;
    onClick?: () => void;
}) {
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);

    if (item.submenu) {
        return (
            <>
                <button
                    type='button'
                    onClick={toggleSubMenu}
                    className={cn(
                        'flex w-full items-center justify-between rounded-lg p-2 px-4 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-slate-600',
                        { 'text-primary': pathName.includes(item.path ?? '') }
                    )}
                >
                    <div className='flex items-center space-x-2 text-[16px]'>
                        {item.icon && <span className='mr-2'>{item.icon}</span>}
                        {item.title}
                    </div>
                    <ChevronDown className={cn('h-4 w-4', { 'rotate-180': subMenuOpen })} />
                </button>
                {subMenuOpen && (
                    <div className='ml-8 my-2 flex flex-col space-y-1'>
                        {item.subMenuItems?.map((subItem, idx) => (
                            <SidebarItem key={subItem.path} item={subItem} pathName={pathName} onClick={onClick} />
                        ))}
                    </div>
                )}
            </>
        );
    }

    return (
        <Button
            asChild
            onClick={onClick}
            variant={item.path === pathName ? 'secondary' : 'ghost'}
            className={cn('mb-1 w-full justify-start text-[16px]', {
                'text-primary': item.path === pathName,
            })}
        >
            <Link href={item?.path ?? ''}>
                {item.icon && <span className='mr-2'>{item.icon}</span>}
                {item.title}
            </Link>
        </Button>
    );
}
