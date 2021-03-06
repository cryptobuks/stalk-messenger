/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  BackAndroid,
  StyleSheet,
} from 'react-native';

import { Navigator } from 'react-native-deprecated-custom-components'

import { connect }    from 'react-redux';
import { switchTab, dismissKeyboard }  from 's5-action';
import { S5Colors } from 's5-components';

import LoginScreen    from './login';
import SignupView     from './login/SignupView';

import TabsView       from './tabs/TabsView';

import ChatView       from './tabs/chats/ChatView';
import ImageViewer    from './tabs/chats/ImageViewer';
import SearchUserView from './tabs/follows/SearchUserView';
import SelectUserView from './tabs/follows/SelectUserView';
import UserView       from './tabs/follows/UserView';
import ProfileForm    from './tabs/profile/ProfileForm';

import SettingView    from './tabs/profile/setting/SettingView';
import LicenseView    from './tabs/profile/setting/LicenseView';

import PushNotificationView from './tabs/profile/setting/PushNotificationView'
import ImageQualityView from './tabs/profile/setting/ImageQualityView'
import PrivacyPolicyView from './tabs/profile/setting/PrivacyPolicyView';


class AppNavigator extends Component {

  _handlers = [];//:

  static propTypes = {
    tab: React.PropTypes.number,
    switchTab: React.PropTypes.func.isRequired,
    isLoggedIn: React.PropTypes.bool,
  };

  static childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  };

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  addBackButtonListener = (listener) => {
    this._handlers.push(listener);
  }

  removeBackButtonListener = (listener) => {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  }

  handleBackButton = () => {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 1) { // "chats tab"
      this.props.switchTab(1);
      return true;
    }
    return false;
  }

  _renderScene = (route, navigator) => {

    if (!this.props.isLoggedIn) {
      dismissKeyboard();
      if(route.name == 'SignupView') {
        return <SignupView navigator={navigator} />;
      }
      //init route name when logout
      route.name = "";
      return <LoginScreen navigator={navigator} />;
    }

    switch (route.name) {
      case 'SearchUserView':
        return <SearchUserView  navigator={navigator} />;
      case 'SelectUserView':
        return <SelectUserView  navigator={navigator} chat={route.chat} callback={route.callback}/>;
      case 'UserView':
        return <UserView        navigator={navigator} user={route.user}/>;
      case 'ChatView':
        return <ChatView        navigator={navigator} chat={route.chat} users={route.users} />;
      case 'ImageViewer':
        return <ImageViewer     navigator={navigator} images={route.images} />;
      case 'ProfileForm':
        return <ProfileForm     navigator={navigator} field={route.field} title={route.title} validLength={route.validLength} />;
      case 'SettingView':
        return <SettingView     navigator={navigator} />;
      case 'LicenseView':
        return <LicenseView     navigator={navigator} />;
      case 'PrivacyPolicyView':
        return <PrivacyPolicyView     navigator={navigator} />;
      case 'PushNotificationView':
        return <PushNotificationView navigator={navigator} />;
      case 'ImageQualityView':
        return <ImageQualityView navigator={navigator} />;
      default:
        return <TabsView        navigator={navigator} />;
    }

  }

  _configureScene = (route) => {
    if (Platform.OS === 'android') {
      return Navigator.SceneConfigs.FloatFromBottomAndroid;
    }

    switch (route.name) {
      case 'SearchUserView':
      case 'SelectUserView':
      case 'ProfileForm':
        return Navigator.SceneConfigs.FloatFromBottom;
      case 'UserView':
        return Navigator.SceneConfigs.FloatFromLeft;
      case 'ChatView':
        return Navigator.SceneConfigs.FloatFromRight;
      default:
        return Navigator.SceneConfigs.FloatFromRight;
    }
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        initialRoute={{}}
        configureScene={this._configureScene}
        renderScene={this._renderScene}
      />
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: S5Colors.background,
  },
});

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  tab: state.navigation.tab,
});

const mapDispatchToProps = dispatch => ({
  switchTab: (tab) => dispatch(switchTab(tab))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
