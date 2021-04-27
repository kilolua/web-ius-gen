import React from 'react'
import '../App.global.css'
import iconScriptView from '../../assets/coding_view.png'
import iconScriptGen from '../../assets/coding.png'
import iconLocalView from '../../assets/lang.png'
export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  setActiveMenuItem(active) {
    this.setState({active: active});
    this.props.onChangeActive(active);
  }

  render() {
    const menu = ['Generate Script', 'View Script', 'View local', 'GenerateHTML'];
    const icons = [iconScriptGen, iconScriptView, iconLocalView, iconLocalView];
    return (
      <div className="left-menu">
        <div className="menu-container">
          <div className="menu-items">
            {menu.map((item, index)=>
               <div onClick={()=>this.setActiveMenuItem(index)} key={index} className="menu-item">
                <img width="30px" height="30px" alt="" src={icons[index]}/>
                <div className={this.state.active === index ? "menu-item-text active": "menu-item-text"}>{item}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
