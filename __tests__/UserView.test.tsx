import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import UserView from '../UserView';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserRepository {
  getUserById: (id: number) => Promise<User | null>;
  updateUser: (user: User) => Promise<void>;
}

const mockUserRepository: UserRepository = {
  getUserById: jest.fn(),
  updateUser: jest.fn()
};

describe('UserView', () => {
  it('loadUser actualiza correctamente el estado user', async () => {
    mockUserRepository.getUserById = jest
      .fn()
      .mockResolvedValue({id: 1, name: 'John Doe', email: 'john@example.com'});

    const {getByText} = render(
      <UserView userId={1} userRepository={mockUserRepository} />,
    );

    await waitFor(() => expect(getByText('John Doe')).toBeTruthy());
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('loadUser cuando el usuario no se encuentra en el repositorio', async () => {
    mockUserRepository.getUserById = jest.fn().mockResolvedValue(null);

    const {getByText} = render(
      <UserView userId={1} userRepository={mockUserRepository} />,
    );

    await waitFor(() => expect(getByText('No user found')).toBeTruthy());
  });

  it('updateUser actualiza correctamente el usuario en el repositorio y también en el estado user', async () => {
    const user = {id: 1, name: 'John Doe', email: 'john@example.com'};
    mockUserRepository.getUserById = jest.fn().mockResolvedValue(user);
    mockUserRepository.updateUser = jest.fn().mockResolvedValue();

    const {getByText, getByRole} = render(
      <UserView userId={1} userRepository={mockUserRepository} />,
    );

    await waitFor(() => expect(getByText('John Doe')).toBeTruthy());

    fireEvent.press(getByRole('button'));

    await waitFor(() => expect(getByText('Updated Name')).toBeTruthy());
  });
});