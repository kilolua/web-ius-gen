import React from 'react'
import '../App.global.css'
import GenScript from "./GenScript";
import ViewJSText from "./ViewJsText";
const { ipcRenderer } = require("electron");
export default class BodyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptText:"",
      localText:"",
    }
  }

  componentDidMount() {
    ipcRenderer.on('generate-script-post', (event, arg) => {
      let res = JSON.parse(arg);
      this.setState({scriptText:res.script, localText:res.local})
    })
  }

  render() {
    return (
      <div className="main">
        {this.props.active === 0 && <GenScript/>}
        {this.props.active === 1 && <div><ViewJSText dataText={this.state.scriptText}/></div>}
        {this.props.active === 2 && <div><ViewJSText dataText={this.state.localText}/></div>}
        {this.props.active === 3 && <div>Ghbdtn 4</div>}
      </div>
    );
  }
}
