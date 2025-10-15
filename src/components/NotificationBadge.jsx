import { Badge, IconButton, List, ListItem, Typography } from "@mui/material"
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Tooltip } from "@mui/material";
import { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const NotificationBadge = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title='Thông báo'>
                <IconButton 
                    className="text-gray-300 
                    hover:bg-gray-600 hover:text-gray-50" 
                    aria-label={5}
                    onClick={handleClick}
                    aria-controls={open ? 'notification-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Badge color="secondary" badgeContent={6} showZero>
                        <NotificationsOutlinedIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="notification-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="w-[300] h-auto"
            >
                <MenuItem>
                    <Typography variant="inherit" noWrap>
                        Tài khoản ABC vừa trả lời bình luận của bạn
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

export default NotificationBadge