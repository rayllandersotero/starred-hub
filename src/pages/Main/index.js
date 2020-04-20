import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Bio,
  Name,
  ProfilleButton,
  ProfilleButtonText,
  DeleteButton,
} from './styles';
import api from '../../services/api';

class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    users: [],
    newUser: '',
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const {users, newUser} = this.state;

    if (!newUser || newUser === '') {
      return alert('User not found');
    }

    this.setState({loading: true});

    await api
      .get(`/users/${newUser}`)
      .then((response) => {
        const data = {
          name: response.data.name,
          login: response.data.login,
          bio: response.data.bio,
          avatar_url: response.data.avatar_url,
        };

        this.setState({
          users: [...users, data],
          newUser: '',
          loading: false,
        });

        Keyboard.dismiss();
      })
      .catch((error) => {
        this.setState({
          newUser: '',
          loading: false,
        });

        Keyboard.dismiss();

        return alert('User not found');
      });
  };

  handleNavigate = (user) => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  handleRemove = (item) => {
    const {users} = this.state;

    filterRemnantsUsers = users.filter((user) => user !== item);

    this.setState({
      users: filterRemnantsUsers,
    });
  };

  render() {
    const {users, newUser, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Type a Github username"
            returnKeyType="done"
            onSubmitEditing={this.handleAddUser}
            value={newUser}
            onChangeText={(text) => this.setState({newUser: text})}
          />

          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={(user) => user.login}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar_url}} />

              <Name>{item.name}</Name>

              <Bio>{item.bio}</Bio>

              <ProfilleButton onPress={() => this.handleNavigate(item)}>
                <ProfilleButtonText>Profile</ProfilleButtonText>
              </ProfilleButton>

              <DeleteButton onPress={() => this.handleRemove(item)}>
                <Icon name="clear" size={16} color="#999" />
              </DeleteButton>
            </User>
          )}
        />
      </Container>
    );
  }
}

export default Main;
