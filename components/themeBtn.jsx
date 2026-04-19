"use client"
import Brightness3Icon from '@mui/icons-material/Brightness3';
import FlareIcon from '@mui/icons-material/Flare';
import React from 'react'
import { Switch } from '@mui/material'
import { useTheme, useThemeUpdate } from '@/app/contexts/themes';

const ThemeBtn = () => {
    const themeMode = useTheme()
    const themeUpdate = useThemeUpdate()
    const isDark = themeMode === 'dark'
    
    return (
        <div className='flex flex-row items-center justify-center'>
            <div>
                {isDark ? (
                    <Brightness3Icon color='secondary' />
                ) : (
                    <FlareIcon color='default' />
                )}
            </div>
            <Switch
                onChange={themeUpdate} checked={isDark} color='secondary'
            />
        </div>
    )
}

export default ThemeBtn
