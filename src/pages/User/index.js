import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';

import {
  Container,
  Header,
  Avatar,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';
import api from '../../services/api';

class User extends Component {
  static navigationOptions = ({route}) => ({
    title: route.params.user.name,
  });

  state = {
    stars: [],
    page: 1,
    loading: false,
  };

  async componentDidMount() {
    const {login} = this.props.route.params.user;

    const {data} = await api.get(`/users/${login}/starred`);

    this.setState({
      stars: data,
    });
  }

  handleLoadMore = async () => {
    const {login} = this.props.route.params.user;
    const {page, stars, loading} = this.state;

    if (loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    const {data} = await api.get(`/users/${login}/starred`, {
      params: {
        page: page + 1,
      },
    });

    if (data.length === 0) {
      this.setState({
        loading: false,
      });

      return;
    }

    this.setState({
      stars: [...stars, ...data],
      page: page + 1,
      loading: false,
    });
  };

  refreshList = async () => {
    const {login} = this.props.route.params.user;
    const {loading} = this.state;

    if (loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    const {data} = await api.get(`/users/${login}/starred`, {
      params: {
        page: 1,
      },
    });

    if (data.length === 0) {
      this.setState({
        loading: false,
      });

      return;
    }

    this.setState({
      stars: data,
      page: 1,
      loading: false,
    });
  };

  handleNavigator = (item) => {
    const {navigation} = this.props;

    navigation.navigate('GitHub', {item});
  };

  render() {
    const {user} = this.props.route.params;
    const {stars, loading} = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar_url}} />
          <Bio>{user.bio}</Bio>
        </Header>

        {stars.length === 0 ? (
          <ActivityIndicator color="#999" style={{flex: 1}} size={50} />
        ) : (
          <Stars
            data={stars}
            keyExtractor={(star) => String(star.id)}
            onRefresh={this.refreshList}
            refreshing={loading}
            onEndReachedThreshold={0.2}
            onEndReached={this.handleLoadMore}
            renderItem={({item}) => (
              <RectButton
                onPress={() => {
                  this.handleNavigator(item);
                }}>
                <Starred>
                  <OwnerAvatar source={{uri: item.owner.avatar_url}} />

                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </RectButton>
            )}
          />
        )}
      </Container>
    );
  }
}

export default User;
