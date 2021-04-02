import React from 'react'
import '../App.global.css'
import icon from '../../assets/folder.png'
import {InputGroup, FormControl, Button} from 'react-bootstrap';
const { ipcRenderer } = require("electron");


export default class GenScript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMockFolder:"",
      saveFolder:"",
    };
    this.generate = this.generate.bind(this);
  }

  generate(){
    let data = {
      dataMockFolder:this.state.dataMockFolder,
      saveFolder:this.state.saveFolder,
    }
    ipcRenderer.send('generate-script', JSON.stringify(data));
  }

  getFolderDataMock(){
    ipcRenderer.send('get-file-name', "get")

  }

  getSaveFolder(){
    ipcRenderer.send('get-save-folder', "get")

  }

  componentDidMount() {
    ipcRenderer.on('get-file-name-post', (event, arg) => {
      this.setState({dataMockFolder:arg[0]})
    })
    ipcRenderer.on('get-save-folder-post', (event, arg) => {
      this.setState({saveFolder:arg[0]})
      console.log(arg)
    })
  }
  render() {
    return (
      <div>
        <div className="input-card">
          <InputGroup  className="mb-2">
            <FormControl
              placeholder="DataMock..."
              aria-label="DataMock"
              aria-describedby="basic-addon2"
              value={this.state.dataMockFolder}
              onChange={(e)=>this.setState({dataMockFolder:e.target.value})}
            />
            <InputGroup.Append>
              <Button onClick={this.getFolderDataMock} variant="outline-secondary"><img alt="" width="20px" height="20px" src={icon}/></Button>
            </InputGroup.Append>
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
      </div>
    );
  }
}
