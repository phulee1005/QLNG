import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseInit';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      setError('Không thể lấy danh sách người dùng. Vui lòng thử lại sau.');
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), newUser);
      setNewUser({ name: '', email: '', age: '' });
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi thêm người dùng:', err);
      setError('Không thể thêm người dùng. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const handleUpdateUser = async (id) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi cập nhật người dùng:', err);
      setError('Không thể cập nhật người dùng. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      setError('Không thể xóa người dùng. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USER MANAGER</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={newUser.name}
          onChangeText={(text) => setNewUser({ ...newUser, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Tuổi"
          value={newUser.age}
          onChangeText={(text) => setNewUser({ ...newUser, age: text })}
          keyboardType="numeric"
        />
        <Button title="Thêm Người Dùng" onPress={handleAddUser} />
      </View>

      {loading ? (
        <Text>Đang tải...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              {editingUser?.id === item.id ? (
                <>
                  <TextInput
                    value={editingUser.name}
                    onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
                    style={styles.input}
                  />
                  <TextInput
                    value={editingUser.email}
                    onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
                    style={styles.input}
                  />
                  <TextInput
                    value={editingUser.age}
                    onChangeText={(text) => setEditingUser({ ...editingUser, age: text })}
                    style={styles.input}
                  />
                  <Button title="Lưu" onPress={() => handleUpdateUser(item.id)} />
                  <Button title="Hủy" onPress={() => setEditingUser(null)} />
                </>
              ) : (
                <>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.age}</Text>
                  <Button title="Sửa" onPress={() => setEditingUser(item)} />
                  <Button title="Xóa" onPress={() => handleDeleteUser(item.id)} />
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%', // Chiếm toàn bộ chiều rộng
    alignItems: 'center', // Căn giữa các phần tử
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%', // Đặt chiều rộng của input
  },
  error: {
    color: 'red',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
});

export default App;
