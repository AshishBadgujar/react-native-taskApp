import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import Header from './components/header'
import { DefaultTheme, Provider, DarkTheme, TextInput, Button, FAB, Modal, Portal } from 'react-native-paper'
import Card from './components/card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  error => { console.log(error) }
);
export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    createTable();
    getData();
    return () => {
      setRefreshing(false)
    }
  }, [refreshing])

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
      text: "black",
      accent: "#f2f2f2"
    },
  };
  const darkTheme = {
    ...DarkTheme,
    roundness: 2,
    colors: {
      ...DarkTheme.colors,
      background: '#424242',
      text: "#fff",
      accent: '#232323',
    },
  };

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        + "Todos"
        + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT,done INTEGER DEFAULT 0);"
      )
    })
  }

  const getData = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "SELECT * FROM Todos",
          [],
          (tx, res) => {
            var temp = [];
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i))
            }
            setTasks(temp)
          }
        )
      })
    } catch (error) {
      console.log(error);
    }
  }

  const setData = async () => {
    if (text == '') {
      Alert.alert('Warning!', 'Please write your data.')
    } else {
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql("INSERT INTO Todos (text) VALUES ('" + text + "')");
          getData();
          setVisible(false)
          setText('')
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  const updateData = async (id, checked) => {
    console.log(id, checked)
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE Todos SET done=? WHERE ID=? ",
          [checked, id],
          () => getData(),
          error => { console.log(error) }
        )
      })
    } catch (error) {
      console.log(error);
    }
  }

  const removeData = async (id) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Todos WHERE ID=?",
          [id],
          () => { getData() },
          error => { console.log(error) }
        )
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Provider theme={(darkMode) ? darkTheme : theme}>
      <Header theme={darkMode} setTheme={setDarkMode} />
      <View style={{ flex: 1, backgroundColor: (darkMode) ? "black" : "#ffff", padding: 5, justifyContent: "center" }}>
        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{
            backgroundColor: (darkMode) ? "#232323" : "#f2f2f2",
            padding: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View style={{
              width: "100%"
            }}>
              <TextInput
                label="Task"
                value={text}
                theme={{
                  colors: {
                    primary: "#fff",
                    accent: "#424242",
                  },
                }}
                onChangeText={text => setText(text)}
              />
              <Button mode="text"
                theme={{
                  colors: {
                    primary: "red",
                  },
                }}
                style={{ marginTop: 10 }}
                onPress={() => setData()}>
                Done
            </Button>
            </View>
          </Modal>
        </Portal>
        {(tasks.length != 0) ?
          <FlatList
            data={tasks}
            renderItem={({ item }) => {
              return <Card task={item} array={tasks} deleteData={removeData} updateData={updateData} />
            }}
            keyExtractor={(item) => item.id}
            onRefresh={() => setRefreshing(true)}
            refreshing={refreshing}
          />
          :
          <View>
            <Text style={{
              fontFamily: "JosefinSans-Regular",
              fontSize: 60,
              color: darkMode ? "#fff" : "#333",
              textAlign: "center",
            }}>
              Whoops !
             </Text>
            <Text style={{
              fontFamily: "JosefinSans-Regular",
              fontSize: 25,
              color: darkMode ? "#fff" : "#333",
              textAlign: "center",
            }}>
              Nothing to do.
        </Text>
          </View>
        }
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon="plus"
          onPress={() => setVisible(!visible)}
        />
      </View>
    </Provider >
  )
}
