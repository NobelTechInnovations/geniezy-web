'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import Link from 'next/link';
// import menu_data from '~/public/static/data/menu';
import menu_data from '@/public/static/data/menu';

const { SubMenu } = Menu;

const PanelMenu = () => {
    const setting = useSelector((state) => state.setting);
    const [openKeys, setOpenKeys] = useState([]);
    const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key));
        if (!rootSubmenuKeys.includes(latestOpenKey)) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className="menu--mobile-2"
        >
            {menu_data.menuPrimary.menu_1.map((item) => {
                if (item.subMenu) {
                    return (
                        <SubMenu
                            key={item.text}
                            title={<Link href={item.url}>{item.text}</Link>}
                        >
                            {item.subMenu.map((subItem) => (
                                <Menu.Item key={subItem.text}>
                                    <Link href={subItem.url}>
                                        {subItem.text}
                                    </Link>
                                </Menu.Item>
                            ))}
                        </SubMenu>
                    );
                } else if (item.megaContent) {
                    return (
                        <SubMenu
                            key={item.text}
                            title={<Link href={item.url}>{item.text}</Link>}
                        >
                            {item.megaContent.map((megaItem) => (
                                <SubMenu
                                    key={megaItem.heading}
                                    title={<span>{megaItem.heading}</span>}
                                >
                                    {megaItem.megaItems.map((megaSubItem) => (
                                        <Menu.Item key={megaSubItem.text}>
                                            <Link href={item.url}>
                                                {megaSubItem.text}
                                            </Link>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            ))}
                        </SubMenu>
                    );
                } else {
                    return (
                        <Menu.Item key={item.text}>
                            {item.type === 'dynamic' ? (
                                <Link
                                    href={{
                                        pathname: `${item.url}/[pid]`,
                                        query: { pid: item.endPoint },
                                    }}
                                >
                                    {item.text}
                                </Link>
                            ) : (
                                <Link href={item.url} as={item.alias}>
                                    {item.text}
                                </Link>
                            )}
                        </Menu.Item>
                    );
                }
            })}
        </Menu>
    );
};

export default PanelMenu;
