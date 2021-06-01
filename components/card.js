import React, { useState } from 'react'
import { Card, Title, RadioButton, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function TodoCard({ task, deleteData, updateData }) {
    const [checked, setChecked] = useState(task.done)
    const { colors } = useTheme()

    return (
        <Card style={{ borderRadius: 10, margin: 2 }}>
            <Card.Content style={{ display: "flex", flexDirection: "row", backgroundColor: colors.accent, borderRadius: 10 }}>
                <RadioButton
                    uncheckedColor="red"
                    status={checked ? 'checked' : "unchecked"}
                    onPress={() => {
                        checked ? setChecked(0) : setChecked(1)
                        updateData(task.ID, checked)
                    }}
                />
                <Title style={{
                    flex: 1,
                    marginLeft: 10,
                    fontFamily: "JosefinSans-Regular",
                    textDecorationLine: (checked) ? "line-through" : "none"
                }}>{task.text}</Title>
                <MaterialCommunityIcons name="delete-outline" color="red" size={30}
                    onPress={() => deleteData(task.ID)}
                />
            </Card.Content>

        </Card>
    )
}
