// @ts-ignore
const fetch = require('node-fetch')
const fs = require('fs');
import {SupportHtml} from './supportHtml'
const HTMLConstants = require('./textHtmlConst');

export class GenerateHTML {
  constructor(key, token, saveFolder) {
    this.support = new SupportHtml;
    this.key = key;
    this.token = token;
    this.saveFolder = saveFolder;
    fs.mkdir(saveFolder+'/style', function() {
      console.log('OK')
    });
    fs.mkdir(saveFolder+'/img', function() {
      console.log('OK')
    });
    fs.mkdir(saveFolder+'/datamock', function() {
      console.log('OK')
    });
  }

  getFigmaObj() {
    fetch(`https://api.figma.com/v1/files/${this.key}`, {
      headers: {
        'X-Figma-Token': this.token
      }
    }).then((data) => {
      data.json().then((data) => {
        this.createHTML(data);
      })
    });
  }

  createHTMLContainer(rootFrame, rootBox) {
    console.log('OK');
    var res = '';
    if (!!rootFrame.children && !!rootFrame.children.length && rootFrame.children.length > 0) {
      rootFrame.children.forEach(node => {
        if (typeof node.visible === 'undefined') {
          if (node.name[0] === '!') {
            res += this.support.getNodeImage(node, rootBox, this.saveFolder);
          } else {
            res += this.support.getNodeHTML(node, rootBox);
            res += this.createHTMLContainer(node, node.absoluteBoundingBox);
            res += '</div>';
          }
        }
      });
    } else {
      return '';
    }
    return res;
  };

  createHTML(data) {
    let rootFrames = data.document.children[0].children;
    console.log(rootFrames);
    rootFrames.forEach((rootFrame) => {
      let rootBox = rootFrame.absoluteBoundingBox;
      let doc = HTMLConstants.beginHTML;

      doc += this.createHTMLContainer(rootFrame, rootBox);

      doc += HTMLConstants.endHTML;
      fs.writeFileSync(`${this.saveFolder}/${rootFrame.name}.html`, doc);
      this.support.generateDataMock(rootFrame.name, this.saveFolder);
    });
    this.support.generateCSSFile(this.saveFolder);
  };
}
module.exports = {
  GenerateHTML,
};
