import { Box, Button, Icon, IconButton } from "@mui/material";
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';

export default function Taskbar({children}) {
    return (
        <>
            <Box component='div' className="w-full h-12 bg-gray-600 rounded-xl p-1">
                <IconButton className="bg-sky-400 text-white">
                    <MenuOpenOutlinedIcon />
                </IconButton>
            </Box>
        </>
    )
}