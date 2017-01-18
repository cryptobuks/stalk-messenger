import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  Switch
} from 'react-native';

import { connect } from 'react-redux';
import { updateSetting } from 's5-action';

import { S5Header, S5Radio, S5Colors } from 's5-components';

import TouchableItem from './TouchableItem';
import TouchableItemGroup from './TouchableItemGroup';

const optionValues = ['S', 'L', 'O'];

class ImageQualityView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageQuality : this.props.settings.imageQuality,
    }
  }

  _onChangeRadio = (index) => {
    this.setState( {'imageQuality':optionValues[index]} );   
  }

  render() {

    var self = this;
    let defaultSelect = -1;
    if(this.state.imageQuality=='S') defaultSelect = 0;
    if(this.state.imageQuality=='L') defaultSelect = 1;
    if(this.state.imageQuality=='O') defaultSelect = 2;

    return (
      <View style={styles.container}>

        <S5Header
          title={'Image Quality'}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />
        <ScrollView
          style={styles.contentContainer} >
            <S5Radio
              onSelect={(index) => this._onChangeRadio(index)}
              color="#b2b2b2"
              selectedColor={S5Colors.primary}
              defaultSelect={defaultSelect}
              size={20}
              style={styles.itemWrap}
              optionStyle={styles.optionWrap}
              fontSize={16} >
              <S5Radio.Option isSelected={this.state.imageQuality=='S'?true:false}>Small</S5Radio.Option>
              <S5Radio.Option isSelected={this.state.imageQuality=='L'?true:false}>Large</S5Radio.Option>
              <S5Radio.Option isSelected={this.state.imageQuality=='O'?true:false}>Original</S5Radio.Option>
            </S5Radio>
        </ScrollView>        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  contentContainer: {
    backgroundColor: 'whitesmoke',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
  },
  groupStyle: {
    marginVertical: 8,
  },
  itemWrap: {
    borderTopWidth:0.5,
    borderTopColor:'lightgray',
    borderBottomWidth:0.5,
    borderBottomColor:'lightgray',
  },
  optionWrap:{
    backgroundColor:'white',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop:1,
    height:48,
  }
});


function select(store) {
  return {
    settings: store.settings,
  };
}

module.exports = connect(select)(ImageQualityView);
