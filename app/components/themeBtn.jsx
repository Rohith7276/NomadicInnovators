
import Brightness3Icon from '@mui/icons-material/Brightness3';
import FlareIcon from '@mui/icons-material/Flare';
import React from 'react'
import { Switch } from '@mui/material'
import {useTheme, useThemeUpdate} from '@/app/contexts/themes';

const ThemeBtn = () => {
    const themeMode = useTheme()
    const themeUpdate = useThemeUpdate()


    return (
        <div className='flex flex-row items-center justify-center'>
            <div>
                <Brightness3Icon className={(themeMode === 'light') ? "hidden" : "block"} color='secondary'></Brightness3Icon>
                <FlareIcon className={(themeMode === 'light') ? "block" : "hidden"} color="default"> </FlareIcon>
            </div>
            <Switch
                onChange={themeUpdate} checked={themeMode === 'dark'} color='secondary'
            />
        </div>
    )
}

export default ThemeBtn
