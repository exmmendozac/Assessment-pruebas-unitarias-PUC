import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserRepository {
  getUserById: (id: number) => Promise<User | null>;
  updateUser: (user: User) => Promise<void>;
}

interface UserViewProps {
  userId: number;
  userRepository: UserRepository;
}

const UserView: React.FC<UserViewProps> = ({userId, userRepository}) => {
  const [user, setUser] = useState<User | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const loadUser = async (userId: number) => {
    const user = await userRepository.getUserById(userId);
    setUser(user);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateUser = async (user: User) => {
    await userRepository.updateUser(user);
    setUser(user);
  };

  useEffect(() => {
    loadUser(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!user) {
    return <Text>No user found</Text>;
  }

  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Button
        title="Update User"
        onPress={() => updateUser({...user, name: 'Updated Name'})}
      />
    </View>
  );
};

export default UserView;
