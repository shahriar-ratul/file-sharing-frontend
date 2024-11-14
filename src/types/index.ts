export type NavItem = {
    title: string;
    disabled?: boolean;
    external?: boolean;
    path?: string;
    icon?: React.ReactNode;
    items?: NavItem[];
    submenu?: boolean;
    subMenuItems?: NavItem[];
    isLabel?: boolean;
};
