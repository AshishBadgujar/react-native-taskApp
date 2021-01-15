import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { Appbar, Switch, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function Header({ theme, setTheme }) {
    const { colors } = useTheme();
    const changeTheme = async () => {
        let str = JSON.stringify(!theme)
        await AsyncStorage.setItem('theme', str)
        setTheme(!theme)
    }
    return (
        <Appbar.Header style={{
            height: "12%",
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 37,
            paddingHorizontal: 10,
            elevation: 0,
            backgroundColor: colors.accent,
        }}>
            <MaterialIcons name="add-task" size={100} style={{ color: theme ? "#616161" : "#b7b7b7", }} />
            <Switch style={{ marginTop: 10 }} value={theme} onValueChange={() => changeTheme()} color="red" />
        </Appbar.Header>
    )
}
