import SQLite from "react-native-sqlite-2";

const db = SQLite.openDatabase("file.db", "1.0", "", 200000);

export const getData = () => {
    const temp = [];
    db.transaction(function (txn) {
        txn.executeSql(
            "CREATE TABLE IF NOT EXISTS Todos(todo TEXT NOT NULL,timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,done INTEGER DEFAULT 0)",
            []
        );
        txn.executeSql("SELECT * FROM Todos", [], function (tx, res) {
            console.log("intial")
            for (let i = 0; i < res.rows.length; ++i) {
                temp.push(res.rows.item(i))
            }
        });
        console.log(temp)
    });
    return temp
}

export const insertData = (text) => {
    const temp1 = [];
    db.transaction(function (txn) {
        txn.executeSql(
            "CREATE TABLE IF NOT EXISTS Todos(todo TEXT NOT NULL,timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,done INTEGER DEFAULT 0)",
            []
        );
        txn.executeSql("INSERT INTO Todos (todo) VALUES (:todo)", [text]);
        txn.executeSql("SELECT * FROM `todos`", [], function (tx, res) {
            console.log("after insertion");
            setTasks([])
            for (let i = 0; i < res.rows.length; ++i) {
                console.log("item:", res.rows.item(i));
                temp1.push(res.rows.item(i))
            }
        });
    });
    return temp1;
}
export const updateData = (checked, timeStamp) => {
    const temp2 = [];
    db.transaction(function (txn) {
        txn.executeSql(`UPDATE Todos SET done=${checked} WHERE timeStamp=${timeStamp}`);
        txn.executeSql("SELECT * FROM `todos`", [], function (tx, res) {
            console.log("after updation");
            for (let i = 0; i < res.rows.length; ++i) {
                temp.push(res.rows.item(i))
            }
        });
        console.log(temp2)
    });
    return temp2;
}
export const deleteData = (timeStamp) => {
    const temp3 = [];
    db.transaction(function (txn) {
        txn.executeSql(`DELETE FROM Todos WHERE timeStamp=${timeStamp}`);
        txn.executeSql("SELECT * FROM `todos`", [], function (tx, res) {
            console.log("after deletion");
            for (let i = 0; i < res.rows.length; ++i) {
                temp.push(res.rows.item(i))
            }
        });
        console.log(temp3)
    });
    return temp3;
}

