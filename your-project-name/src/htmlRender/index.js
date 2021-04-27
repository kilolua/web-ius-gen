// @ts-ignore
const sfetch = require('sync-fetch')
const fs = require('fs');
// const supportHtml = require('./supportHtml.js').SupportHtml;
import {SupportHtml} from './supportHtml'
const HTMLConstants = require('./textHtmlConst');

export class GenerateHTML {
  constructor() {
    this.support = new SupportHtml;
  }

  getFigmaObj(key, token) {
    let res = sfetch(`https://api.figma.com/v1/files/${key}`, {
      headers: {
        'X-Figma-Token': token
      }
    }).json();
    console.log(res)
    return res
  }

  createHTMLContainer(rootFrame, rootBox) {
    console.log('OK');
    var res = '';
    if (!!rootFrame.children && !!rootFrame.children.length && rootFrame.children.length > 0) {
      rootFrame.children.forEach(node => {
        if (typeof node.visible === 'undefined') {
          if (node.name[0] === '!') {
            res += this.support.getNodeImage(node, rootBox);
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

  createHTML(key, token, saveFolder) {
    let data = this.getFigmaObj(key, token)
    let rootFrames = data.document.children[0].children;
    rootFrames.forEach((rootFrame) => {
      let rootBox = rootFrame.absoluteBoundingBox;
      let doc = HTMLConstants.beginHTML;

      doc += this.createHTMLContainer(rootFrame, rootBox);

      doc += HTMLConstants.endHTML;
      fs.writeFileSync(`${saveFolder}/${rootFrame.name}.html`, doc);
      this.support.generateDataMock(rootFrame.name, saveFolder);
    });
    this.support.generateCSSFile(saveFolder);
  };
}
module.exports = {
  GenerateHTML,
};
