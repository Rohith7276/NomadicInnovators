"use client"
import Brightness3Icon from '@mui/icons-material/Brightness3';
import FlareIcon from '@mui/icons-material/Flare';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Switch } from '@mui/material'
import { useTheme, useThemeUpdate } from '@/app/contexts/themes';

const ThemeBtn = () => {
    const themeMode = useTheme()
    const themeUpdate = useThemeUpdate()
    const [theme, setTheme] = useState(true)
    useEffect(() => {
      if(themeMode === 'light') {
        setTheme(false)
      }
      else {
        setTheme(true)
      }
      return () => {
        
      }
    }, [themeMode])
    useEffect(() => {
      if(themeMode === 'light') {
        setTheme(false)
      }
      else {
        setTheme(true)
      }
      return () => {
        
      }
    }, [])
    
    return (
        <div className='flex flex-row items-center justify-center'>
            <div>
                <Brightness3Icon className={(theme) ? "block" : "hidden"} color='secondary'></Brightness3Icon>
                <FlareIcon className={(theme) ? "hidden" : "block"} color="default"> </FlareIcon>
            </div>
            <Switch
                onChange={()=>{themeUpdate(); setTheme(e => !e);}} checked={themeMode === 'dark'} color='secondary'
            />
        </div>
    )
}

export default ThemeBtn
