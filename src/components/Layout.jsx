'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Box, IconButton, ListItemIcon, ListItemText, MenuItem, List, Stack, Tooltip, Avatar, ListItemAvatar, Badge, ListItemButton, Button } from "@mui/material";
import Image from "next/image";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import Link from "next/link";
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


const menuItems = [
    { path: '/dashboard', title: 'Bảng điều khiển', icon: SpaceDashboardOutlinedIcon },
    { path: '/dashboard/contents', title: 'Bài viết', icon: ArticleOutlinedIcon },
    { path: '/dashboard/products', title: 'Sản phẩm', icon: Inventory2OutlinedIcon },
    { path: '/dashboard/users', title: 'Người dùng', icon: PersonOutlineOutlinedIcon },
    { path: '/dashboard/setting', title: 'Cài đặt', icon: SettingsOutlinedIcon },
];

export default function Layout({ children }) {

    const [isToggle, setIsToggle] = useState(false)
    const [isNumber, setIsNumber] = useState(0)
    const path = usePathname()

    const handleToggle = () => {
        setIsToggle(prev => !prev)
    }

    const notificationsLabel = (a) => {
        console.log(a)
    }

    const plus = () => {
        setIsNumber(prev => prev + 1)
    }
    const minus = () => {
        setIsNumber(prev => {
            if (prev > 0) {
                return prev - 1
            } else {
                return 0
            }
        })
    }
    return (
        <>
            <Stack direction='row' className="h-screen p-4 bg-gray-950" spacing={2}>
                {/* Sidebar */}
                <Box
                    component='nav'
                    className={`${isToggle ? 'w-52' : 'w-20'
                        } transition-all duration-300 ease-in-out h-full bg-gray-800 text-gray-50 overflow-hidden rounded-lg`}
                >
                    {/* Logo */}
                    <Box className="p-3">
                        <Image
                            width={64}
                            height={64}
                            className="w-full h-auto"
                            src='/logo/Linux-Logo.wine.svg'
                            alt="Logo"
                            priority
                        />
                    </Box>

                    {/* Menu Items */}
                    <List className="p-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link key={item.path} href={item.path}>
                                <Tooltip
                                    title={item.title}
                                    placement="right"
                                    disableHoverListener={isToggle}
                                >
                                    <MenuItem className={`w-full h-10 hover:bg-gray-600 rounded-lg gap-1 my-1 ${path === item.path ? 'bg-gray-600' : ''}`}>
                                        <item.icon />
                                        <ListItemText
                                            primary={item.title}
                                            className={`${isToggle ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                                                } transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden`}
                                        />
                                    </MenuItem>
                                </Tooltip>
                            </Link>
                        ))}
                    </List>
                </Box>

                {/* Main Content */}
                <Stack className="flex-1 min-w-0" spacing={2}>
                    <Box component='nav' className="flex justify-between w-full h-16 bg-gray-800 p-3 sticky top-0 z-10 rounded-lg">
                        <IconButton onClick={handleToggle} className=" hover:bg-gray-600 text-gray-50">
                            <MenuOpenOutlinedIcon />
                        </IconButton>
                        <ListItemAvatar className="flex gap-3">
                            <ListItemButton className="bg-amber-200 gap-2">
                                <Button className="bg-red-400 hover:bg-red-500 text-gray-50" onClick={minus}>
                                    <RemoveOutlinedIcon/>
                                </Button>
                                <Button className="bg-sky-400 hover:bg-sky-500 text-gray-50" onClick={plus}>
                                    <AddOutlinedIcon/>
                                </Button>
                            </ListItemButton>
                            <IconButton className="text-gray-50 hover:bg-gray-600" aria-label={notificationsLabel(isNumber)}>
                                <Badge color="secondary" badgeContent={menuItems.length} showZero>
                                    <NotificationsNoneOutlinedIcon/>
                                </Badge>
                            </IconButton>
                            <Avatar src=""/>
                        </ListItemAvatar>
                    </Box>
                    <Box className="flex-1 p-3 bg-gray-800 text-gray-50 overflow-auto rounded-lg">
                        {children}
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}