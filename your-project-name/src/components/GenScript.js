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
    };
  }

  // generate(){
  //   window.ipcRenderer.send('asynchronous-message', this.state.dataMockFolder);
  // }
  //
  getFolderDataMock(){
    ipcRenderer.send('get-file-name', "get")

  }
  componentDidMount() {
    ipcRenderer.on('get-file-name-post', (event, arg) => {
      // document.getElementById('input').value = arg;
      this.setState({dataMockFolder:arg[0]})
      console.log(arg[0])
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
            />
            <InputGroup.Append>
              <Button variant="outline-secondary"><img alt="" width="20px" height="20px" src={icon}/></Button>
            </InputGroup.Append>
          </InputGroup>
          <div className="button-gen">
            <Button className="button-gen-color">Generate</Button>
          </div>
        </div>
      </div>
    );
  }
}
