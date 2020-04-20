import React, {Component} from 'react';
import {WebView} from 'react-native-webview';

class GitHub extends Component {
  static navigationOptions = ({route}) => ({
    title: route.params.item.name,
  });

  render() {
    const {html_url} = this.props.route.params.item;

    return <WebView style={{flex: 1}} source={{uri: html_url}} />;
  }
}

export default GitHub;
