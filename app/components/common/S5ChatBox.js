/**
 *
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import { GiftedChat, Bubble, Send, Composer } from 'react-native-gifted-chat';
import S5Icon from './S5Icon';

import ImagePicker from 'react-native-image-picker';
var imagePickerOptions = {
  title: 'Select Image',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class S5ChatBox extends Component {

  static propTypes = {
    enabled: React.PropTypes.bool,
    reconnecting: React.PropTypes.bool,
    loadEarlier: React.PropTypes.bool,

    messages: React.PropTypes.any.isRequired,
    user: React.PropTypes.object.isRequired,

    onSend: React.PropTypes.func.isRequired,
    onLoadEarlier: React.PropTypes.func,
    selectImage: React.PropTypes.func,
  };

  static defaultProps = {
    enabled:      false,
    messages:     [],
    images: [],
    loadEarlier:  false,
    reconnecting: false,
  };

  state = {
    composerMenuOpened: false
  };

  append = (beforeMessages, messages) => {

    return GiftedChat.append(beforeMessages, messages);
  }

  prepend = (beforeMessages, messages) => {
    return GiftedChat.prepend(beforeMessages, messages);
  }

  _renderFooter = (props) => {
    if (this.props.reconnecting) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {'Connection was failed. Reconnecting...'}
          </Text>
        </View>
      );
    }
    return null;
  }

  _renderBubble = (props) => {
    if( props.currentMessage.image ){
      if( this.props.images.indexOf( props.currentMessage.image ) < 0 ){
        this.props.images.push( props.currentMessage.image );
      }
    }

    if( props.currentMessage.image && this.props.onPressImage ){

      var showIndex = this.props.images.indexOf( props.currentMessage.image );

      return (
        <TouchableOpacity onPress={()=> this.props.onPressImage( this.props.images, (showIndex > -1 ? showIndex:0) ) } style={{zIndex:100}}>
          <Bubble {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#f0f0f0',
              }
            }}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <Bubble {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            }
          }}
        />
      )
    }
  }

  _renderSend = (props) => {
    if ( this.props.enabled && !this.props.reconnecting ) {
      return (
        <Send {...props}/>
      );
    }
    return null;
  }

  _renderComposer = (props) => {
    return (
      <View style={styles.composer}>
        {this.renderComposerMenu()}
        <Composer {...props}/>
      </View>
    );
  }

  renderComposerMenu = () => {

    if( this.props.enabled && !this.props.reconnecting ) {

      if( this.state.composerMenuOpened ){
        return (
          <S5Icon
            name={'close'}
            color={'gray'}
            onPress={() => {
              this.setState({ composerMenuOpened: false });
            }}
            style={styles.menuIcon} />
        );
      } else {
        return (
          <S5Icon
            name={'add'}
            color={'gray'}
            onPress={() => {
              this.setState({ composerMenuOpened: true });
              this.selectImage();
            }}
            style={styles.menuIcon} />
        );
      }
    } else {
      return null;
    }
  }

  selectImage = () => {

    var self = this;
    if( this.props.imageQuality ){
      imagePickerOptions.quality = this.props.imageQuality;
    }

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {

      if (response.didCancel) {
        this.setState({ composerMenuOpened: false });
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        self.props.onSelectImage(response);
        this.setState({ composerMenuOpened: false });

      }
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={this.props.onSend}
        loadEarlier={this.props.loadEarlier}
        onLoadEarlier={this.props.onLoadEarlier}

        user={{
          _id: this.props.user.id, // sent messages should have same user._id
          name: this.props.user.nickName,
          avatar: this.props.user.avatar
        }}

        renderComposer={this._renderComposer}
        renderBubble={this._renderBubble}
        renderFooter={this._renderFooter}
        renderSend={this._renderSend}
        onLongPress={this._onLongPress}

        textInputProps={{
          editable: this.props.enabled
        }}
      />
    );
  }

}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  composer: {
    flex:1,
    flexDirection: 'row'
  },
  menuIcon: {
    width: 30,
    height: 30,
    opacity:0.8,
    paddingTop: 5,
    paddingLeft: 10,
  },
});
