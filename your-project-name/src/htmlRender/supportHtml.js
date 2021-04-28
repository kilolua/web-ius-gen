const json2html = require('node-json2html');
const fs = require('fs');
const fetch = require('node-fetch');
const request = require('request');
const HTMLConstants = require('./textHtmlConst');

export class SupportHtml {
  constructor() {
    this.cssText = 'html {\n' +
      '      overflow: hidden;\n' +
      '      /*cursor: none;*/\n' +
      '      font-family: "Open Sans light", Arial, serif;\n' +
      '}\n' +
      '@font-face {\n' +
      '      font-family: \'Open Sans light\';\n' +
      '      src: local(\'Open Sans\'), local(\'OpenSans\'), url(\'../font/opensans.woff2\') format(\'woff2\'), url(\'../font/opensans.woff\') format(\'woff\'), url(\'../font/opensans.ttf\') format(\'truetype\');\n' +
      '      font-weight: 400;\n' +
      '      font-style: normal;\n' +
      '}\n' +
      '\n' +
      '@font-face {\n' +
      '      font-family: \'Open Sans\';\n' +
      '      src: local(\'Open Sans Semibold\'), local(\'OpenSans-Semibold\'), url(\'../font/opensanssemibold.woff2\') format(\'woff2\'), url(\'../font/opensanssemibold.woff\') format(\'woff\'), url(\'../font/opensanssemibold.ttf\') format(\'truetype\');\n' +
      '      font-weight: 400;\n' +
      '      font-style: normal;\n' +
      '}';
    this.namingCounter = 1;
    this.buttonCounter = 1;
    this.dataMockText = {
      button: {},
      label: {},
      image: {},
      ext: {},
      timeout: {}
    };
  }

  getCorrectlyClassNameCSS(name) {
    let res = name + 'abc';
    res = res.replace(/[0-9]/g, '');
    res = res.replace(/ /g, '_');
    res = res.replace(/!/g, '');
    res = res.replace(/\./g, '');
    res = res.replace(/:/g, '');
    res = res.replace(/\?/g, '');
    res = res.replace(/,/g, '');
    res = res.replace(/\n/g, '');
    res = res.replace(/\)/g, '');
    res = res.replace(/\(/g, '');
    res = res.replace(/@/g, '');
    res = res.replace(/%/g, '');
    res = res.replace(/\+/g, '');
    res = res.replace(/=/g, '');
    res = res.replace(/\$/g, '');
    res += this.namingCounter;
    return res;

  }

  getCorrectlyColor(color) {
    return `rgb(${Math.round(color.r * 100)}%,${Math.round(color.g * 100)}%, ${Math.round(color.b * 100)}%)`;
  }

  getFontSize(node) {
    if (node.type === 'TEXT') {
      if (!!node.style && !!node.style.fontSize) {
        return 'font-size:' + node.style.fontSize + 'px';
      }
    }
    return '';
  }

  getFontWeight(node) {
    if (node.type === 'TEXT') {
      if (!!node.style && !!node.style.fontWeight) {
        return 'font-weight: ' + node.style.fontWeight;
      }
    }
    return '';
  }

  getTextAlign(node) {
    if (node.type === 'TEXT') {
      if (!!node.style && !!node.style.textAlignHorizontal) {
        return 'text-align: ' + node.style.textAlignHorizontal;
      }
    }
    return '';
  }

  getBGColor(node, flag) {
    if (!!node.fills && node.fills.length > 0 && node.fills[0].color && flag !== false) {
      return this.getCorrectlyColor(node.fills[0].color);
    }
    return 'none';
  }

  generateDataMock(filename, saveFolder) {
    let res = HTMLConstants.startDataMock;
    res += JSON.stringify(this.dataMockText);
    res += HTMLConstants.endDataMock;
    fs.writeFileSync(`${saveFolder}/datamock/${filename}.js`, res);
  }

  generateDataMockElement(type, value, name) {
    if (type === 'label') {
      this.dataMockText[type][name] = {
        value: value
      };
    } else if (type === 'image') {
      this.dataMockText[type][name] = {
        src: value
      };
    } else if (type === 'button') {
      this.dataMockText[type][name] = {
        text: value
      };
    }
  }

  getBorderRadius(node) {
    if (!!node.rectangleCornerRadii && node.rectangleCornerRadii.length > 0) {
      let border = node.rectangleCornerRadii;
      return `border-radius: ${border[0]}px ${border[1]}px ${border[2]}px ${border[3]}px`;
    } else if (!!node.cornerRadius) {
      return `border-radius: ${node.cornerRadius}px`;
    }

    return '';
  }

  getShadow(node) {
    if (!!node.effects && !!node.effects[0] && node.effects.length > 0) {
      if (node.effects[0].type === 'DROP_SHADOW') {
        let shadowColor = this.getCorrectlyColor(node.effects[0].color);
        return `box-shadow: ${node.effects[0].offset.x}px ${node.effects[0].offset.y}px ${node.effects[0].radius}px ${shadowColor};`;
      }
    }
    return '';
  }

  getBorder(node) {
    if (!!node.strokes && !!node.strokes[0] && node.strokes.length > 0) {
      if (node.strokes[0].type === 'SOLID') {
        let borderColor = this.getCorrectlyColor(node.strokes[0].color);
        return `border: ${node.strokeWeight}px solid ${borderColor};`;
      }
    }
    return '';
  }

  getBoxSizing(node) {
    if (!!node.strokeAlign) {
      if (node.strokeAlign !== 'OUTSIDE')
        return `box-sizing: border-box;`;
      else {
        return '';
      }
    }
    return 'box-sizing: border-box;';
  }

  generateCSS(node, rootBox, flag = true) {
    let x = node.absoluteBoundingBox.x - rootBox.x;
    let y = node.absoluteBoundingBox.y - rootBox.y;
    let className = this.getCorrectlyClassNameCSS(node.name);
    let bgColor = this.getBGColor(node, flag);
    let borderRadius = this.getBorderRadius(node);
    let border = this.getBorder(node);
    let shadow = this.getShadow(node);
    let font_size = this.getFontSize(node);
    let font_weight = this.getFontWeight(node);
    let text_align = this.getTextAlign(node);
    let box_sizing = this.getBoxSizing(node);

    let resCSS = `.${className} {
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${node.absoluteBoundingBox.width}px;
      height: ${node.absoluteBoundingBox.height}px;
      ${node.type === 'TEXT' ? 'color: ' + bgColor : 'background: ' + bgColor};
      ${borderRadius === '' ? '' : borderRadius + ';'}
      ${shadow === '' ? '' : shadow + ';'}
      ${border === '' ? '' : border + ';'}
      ${box_sizing === '' ? '' : box_sizing + ';'}
      ${text_align === '' ? '' : text_align + ';'}
      ${font_size === '' ? '' : font_size + ';'}
      ${font_weight === '' ? '' : font_weight + ';'}}`;
    this.cssText += resCSS;
  }

  getImageNodeHTML(node, rootBox, url) {
    let className = this.getCorrectlyClassNameCSS(node.name);
    let transform = {
      '<>': 'div', 'class': className, 'id': className, 'html': [
        { '<>': 'img', 'alt': '', 'src': url }
      ]
    };
    this.generateDataMockElement('image', url, 'image' + this.namingCounter);
    this.generateCSS(node, rootBox, false);
    this.namingCounter += 1;
    return json2html.transform({}, transform);
  }

  download(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  getImageData(node, saveFolder) {
    fetch('https://api.figma.com/v1/images/wx5gaDdT6XEU8YeZFLGyeV?format=png&ids=' + node.id, {
      headers: {
        'X-Figma-Token': '166351-7aac409c-54bc-4425-90c8-eb1a8585d613'
      }
    }).then((data) => {
      data.json().then((data) => {
        let imgName = saveFolder+"/img/"+this.getCorrectlyClassNameCSS(node.name) + '.png';
        if (data.err === null) {
          this.download(data.images[node.id], imgName, function() {
            console.log('done');
          });
        }
      });
    });
  }

  getNodeImage(node, rootBox, saveFolder) {
    this.getImageData(node, saveFolder);
    let imgName = this.getCorrectlyClassNameCSS(node.name);
    let htmlImgName = 'img/' + imgName + '.png';
    return this.getImageNodeHTML(node, rootBox, htmlImgName);
  }

  isButton(node) {
    return node.name[0] === '?';
  }

  getNodeHTML(node, rootBox) {
    let className = this.getCorrectlyClassNameCSS(node.name);
    let divHTML;
    let divText = '';
    if (typeof node.characters !== 'undefined') {
      divText = node.characters.replace(/\u2028/g, '<br/>');
    }
    if (this.isButton(node)) {
      // divHTML = `<div class='${className}' id='button-Btn${this.buttonCounter}' onclick="page.proccesBtn(this.id);">${divText}`
      divHTML = `<div class='${className}' onclick='page.proccesBtn(this.id);'>${divText}`;
      this.buttonCounter++;
    } else {
      divHTML = `<div id='label-${className}' class='${className}'>${divText}`;
      if (divText.length > 0)
        this.generateDataMockElement('label', divText, 'lab' + this.namingCounter);
    }
    this.generateCSS(node, rootBox);
    this.namingCounter += 1;
    return divHTML;
  }

  generateCSSFile(saveFolder) {
    fs.writeFileSync(saveFolder+'/style/GlobalStyle.css', this.cssText);
  }
}

module.exports = {
  SupportHtml
};

// exports { SupportHtml };
// module.exports.SupportHtml = SupportHtml;
