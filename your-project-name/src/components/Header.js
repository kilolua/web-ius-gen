import React from 'react'
import '../App.global.css'
import icon from '../../assets/close.png'
const { ipcRenderer } = require("electron");

export default class Header extends React.Component {
  closeWindow(){
    ipcRenderer.send('close-window', "get")
  }
  render() {
    return (
      <div className="header">
        <div className="logo">
          <span className="blue">WEB</span><span className="fiol">IUS</span><span className="purple">GEN</span>
        </div>
        <div className="closeButton" onClick={this.closeWindow}><img width="20" height="20" alt="" src={icon}/></div>
      </div>
    );
  }
}
