import React from 'react'
import '../App.global.css'
import icon from '../../assets/folder.png'
import { InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
const { ipcRenderer } = require("electron");


export default class GenHTML extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      figmaKey:"wx5gaDdT6XEU8YeZFLGyeV",
      saveFolder:"",
      figmaToken:"166351-7aac409c-54bc-4425-90c8-eb1a8585d613",
      generating: "",
    };
    this.generate = this.generate.bind(this);
  }

  generate(){
    this.setState({generating:"wait"})
    let data = {
      figmaKey:this.state.figmaKey,
      figmaToken:this.state.figmaToken,
      saveFolder:this.state.saveFolder,
    }
    ipcRenderer.send('generate-html', JSON.stringify(data));
  }

  getSaveFolder(){
    ipcRenderer.send('get-save-folder-html', "get")

  }

  componentDidMount() {
    ipcRenderer.on('get-save-folder-html-post', (event, arg) => {
      this.setState({saveFolder:arg[0]})
      console.log(arg)
    })
    ipcRenderer.on('generate-html-post', (event, arg) => {
      this.setState({generating:""})
      console.log("fuck")
    })
  }
  render() {
    return (
      <div>
        <div className="input-card">
          <InputGroup  className="mb-2">
            <FormControl
              placeholder="Figma file key ..."
              aria-label="DataMock"
              aria-describedby="basic-addon2"
              value={this.state.figmaKey}
              onChange={(e)=>this.setState({figmaKey:e.target.value})}
            />
          </InputGroup>
          <InputGroup  className="mb-2">
            <FormControl
              placeholder="Figma Token ..."
              aria-label="DataMock"
              aria-describedby="basic-addon2"
              value={this.state.figmaToken}
              onChange={(e)=>this.setState({figmaToken:e.target.value})}
            />
          </InputGroup>
          <InputGroup  className="mb-2">
            <FormControl
              placeholder="Where to save..."
              aria-label="DataMock"
              aria-describedby="basic-addon2"
              value={this.state.saveFolder}
              onChange={(e)=>this.setState({saveFolder:e.target.value})}
            />
            <InputGroup.Append>
              <Button onClick={this.getSaveFolder} variant="outline-secondary"><img alt="" width="20px" height="20px" src={icon}/></Button>
            </InputGroup.Append>
          </InputGroup>
          <div className="button-gen">
            <Button onClick={this.generate} className="button-gen-color">Generate</Button>
          </div>
        </div>
        <div className={"loader "+this.state.generating}><Spinner animation="border" variant="light" /> Generating...</div>
      </div>
    );
  }
}
