'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";
import {
    Box,
    IconButton,
    ListItemText,
    MenuItem,
    List,
    Stack,
    Tooltip,
    Avatar,
    ListItemAvatar,
    Badge,
    ListItemButton,
    Button,
    Menu,
    Typography,
    Divider
} from "@mui/material";
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
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuItems = [
    { path: '/dashboard', title: 'Bảng điều khiển', icon: SpaceDashboardOutlinedIcon },
    { path: '/dashboard/contents', title: 'Bài viết', icon: ArticleOutlinedIcon },
    { path: '/dashboard/products', title: 'Sản phẩm', icon: Inventory2OutlinedIcon },
    { path: '/dashboard/users', title: 'Người dùng', icon: PersonOutlineOutlinedIcon },
    { path: '/dashboard/setting', title: 'Cài đặt', icon: SettingsOutlinedIcon },
];

export default function Layout({ children }) {
    const [isToggle, setIsToggle] = useState(false);
    const [isNumber, setIsNumber] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const path = usePathname();
    const { user, logout } = useAuth();

    const handleToggle = () => {
        setIsToggle(prev => !prev);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleCloseMenu();
    };

    const plus = () => {
        setIsNumber(prev => prev + 1);
    };

    const minus = () => {
        setIsNumber(prev => prev > 0 ? prev - 1 : 0);
    };

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

                    {/* User Info (when expanded) */}
                    {isToggle && user && (
                        <Box className="px-3 pb-3">
                            <Box className="bg-gray-700 rounded-lg p-3">
                                <Typography variant="body2" className="text-gray-300">
                                    Xin chào,
                                </Typography>
                                <Typography variant="subtitle2" className="font-semibold">
                                    {user.profile?.firstName ?
                                        `${user.profile.firstName} ${user.profile.lastName}` :
                                        user.username
                                    }
                                </Typography>
                                <Typography variant="caption" className="text-gray-400">
                                    {user.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Menu Items */}
                    <List className="px-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link key={item.path} href={item.path}>
                                <Tooltip
                                    title={item.title}
                                    placement="right"
                                    disableHoverListener={isToggle}
                                >
                                    <MenuItem className={`w-full h-10 hover:bg-gray-600 rounded-lg gap-3 my-1 ${path === item.path ? 'bg-gray-600' : ''}`}>
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
                    {/* Top Navigation */}
                    <Box component='nav' className="flex justify-between w-full h-16 bg-gray-800 p-3 sticky top-0 z-10 rounded-lg">
                        <IconButton onClick={handleToggle} className="hover:bg-gray-600 text-gray-50">
                            <MenuOpenOutlinedIcon />
                        </IconButton>

                        <Stack direction="row" spacing={2} alignItems="center">
                            {/* Demo Counter */}
                            <Box className="bg-amber-200 rounded-lg p-1 flex gap-2">
                                <Button
                                    size="small"
                                    className="bg-red-400 hover:bg-red-500 text-gray-50 min-w-8 h-8"
                                    onClick={minus}
                                >
                                    <RemoveOutlinedIcon fontSize="small" />
                                </Button>
                                <Box className="flex items-center px-2 text-gray-800 font-semibold">
                                    {isNumber}
                                </Box>
                                <Button
                                    size="small"
                                    className="bg-sky-400 hover:bg-sky-500 text-gray-50 min-w-8 h-8"
                                    onClick={plus}
                                >
                                    <AddOutlinedIcon fontSize="small" />
                                </Button>
                            </Box>

                            {/* Notifications */}
                            <IconButton className="text-gray-50 hover:bg-gray-600">
                                <Badge color="secondary" badgeContent={menuItems.length} showZero>
                                    <NotificationsNoneOutlinedIcon />
                                </Badge>
                            </IconButton>

                            {/* User Avatar & Menu */}
                            <IconButton onClick={handleAvatarClick} className="p-0">
                                <Avatar
                                    src={user?.profile?.avatar}
                                    alt={user?.username}
                                    className="w-10 h-10"
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Box className="px-4 py-2 min-w-48">
                                    <Typography variant="subtitle2" className="font-semibold">
                                        {user?.profile?.firstName ?
                                            `${user.profile.firstName} ${user.profile.lastName}` :
                                            user?.username
                                        }
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {user?.email}
                                    </Typography>
                                    <Typography variant="caption" className="text-blue-600">
                                        {user?.role}
                                    </Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={handleCloseMenu}>
                                    <ListItemText>
                                        <AccountCircleIcon className="mr-2" />
                                        Hồ sơ cá nhân
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemText>
                                        <LogoutIcon className="mr-2" />
                                        Đăng xuất
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </Stack>
                    </Box>

                    {/* Main Content Area */}
                    <Box className="flex-1 p-6 bg-gray-800 text-gray-50 overflow-auto rounded-lg">
                        {children}
                    </Box>
                </Stack>
            </Stack>
        </>
    );
}