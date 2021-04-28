import React from 'react';
import '../App.global.css';
import Prism from 'prismjs';
import { Button } from 'react-bootstrap';
//const { ipcRenderer } = require("electron");

export default class ViewJSText extends React.Component {
  constructor(props) {
    super(props);
    this.copyText = this.copyText.bind(this);
  }

  componentDidMount() {
    Prism.highlightAll();
  }

  copyText() {
    console.log(this);
    navigator.clipboard.writeText(this.props.dataText)
      .then(() => {
        // Получилось!
      })
      .catch(err => {
        console.log('Something went wrong', err);
      });
  }

  render() {
    return (
      <div className='view-code'>
        <pre className='code-back' width='100%' height='100%'>
          <code width='100%' height='100%' className='language-javascript'>
            {this.props.dataText}
          </code>
        </pre>
        <div className='button-copy'>
          <Button onClick={this.copyText} className='button-gen-color'>Copy</Button>
        </div>
      </div>
    );
  }
}
