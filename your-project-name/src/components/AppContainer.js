import React from 'react';
import BodyCard from "./BodyCard";
import LeftMenu from "./LeftMenu";
import Header from "./Header";
import '../App.global.css'
const { ipcRenderer } = require('electron');

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active:0,
    };
    this.onchangeActive = this.onchangeActive.bind(this);
  }

  onchangeActive(active){
    this.setState({active:active})
  }
  componentDidMount(){
    ipcRenderer.on('ping', (event, message) => {
      console.log(message)
    });
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <LeftMenu onChangeActive={this.onchangeActive}/>
        <BodyCard active={this.state.active}/>
      </div>
    );
  }
}

