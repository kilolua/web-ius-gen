import React from 'react'
import '../App.global.css'
import GenScript from "./GenScript";
export default class BodyCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main">
        {this.props.active === 0 && <GenScript/>}
        {this.props.active === 1 && <div>Ghbdtn 2</div>}
        {this.props.active === 2 && <div>Ghbdtn 3</div>}
        {this.props.active === 3 && <div>Ghbdtn 4</div>}
      </div>
    );
  }
}
