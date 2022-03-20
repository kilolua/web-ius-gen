const fs = require('fs');
const path = require('path');
const supportText = require('./supportText');

const correctlyJSON = str => {
  let text = str;
  text = text.substr(text.indexOf('{') + 1, text.length);
  text = text.substr(text.indexOf('{'), text.length);
  text = text.substr(0, text.lastIndexOf('}'));
  text = text.substr(0, text.lastIndexOf('}') + 1);
  text = text.trim();
  text = text.replace(/\s{2,}/g, ' ');
  text = text.replace(/,}/g, '}');
  text = text.replace(/'/g, '"');
  text = text.replace(/:/g, ': ');
  text = text.replace(/,/g, ', ');
  console.log(text)
  // console.log(eval('(' + text + ')'))
  text = JSON.stringify(eval('(' + text + ')'));
  return text;
};

const getScreenData = (data, baseName) => {
  let res = '';
  let key;
  if (!!data.button) {
    for (key in data.button) {
      res += supportText.getButtonText(data.button[key], key, baseName);
    }
  }
  if (!!data.label) {
    for (key in data.label) {
      res += supportText.getLabelText(data.label[key], key, baseName);
    }
  }
  if (!!data.image) {
    for (key in data.image) {
      res += supportText.getImageText(data.image[key], key, baseName);
    }
  }
  if (!!data.input) {
    for (key in data.input) {
      res += supportText.getInputText(data.input[key], key);
    }
  }
  res += supportText.getTimeoutText();
  return res;
};

const getNameLocalElement = (name, baseName) => {
  return `${baseName}_${name}`;
};

const getEndScript = (dataArr) => {
  console.log(dataArr);
  let res = `function initScreens() {
\tscr = new Screen(start, "");\n`;
  for (let file of dataArr) {
    res += `\t${file} = new Screen(${file}, "${file}");\n`;
  }
  res += `}`;
  return res;
};

const getLocalData = (data, baseName) => {
  let res = '';
  let key;
  if (!!data.button) {
    for (key in data.button) {
      res += supportText.getLocalText(getNameLocalElement(key, baseName), data.button[key].text);
    }
  }
  if (!!data.label) {
    for (key in data.label) {
      res += supportText.getLocalText(getNameLocalElement(key, baseName), data.label[key].value);
    }
  }
  return res;
};

const generateScript = (jsonData, baseName, renderName) => {
  let res = '';
  res = supportText.getBeginScreenData(baseName);
  res += getScreenData(jsonData, baseName);
  res += supportText.getEndScreenData(renderName);
  return res;
};

const generateLocal = (jsonData, baseName) => {
  let res = '';
  res += getLocalData(jsonData, baseName);
  return res;
};

const Generate = (url, urlSave) => {
  var folders = fs.readdirSync(url);
  let resScript = '';
  let resLocal = '';
  let genInitArr = [];
  resLocal = supportText.getBeginLocalData();
  for (let folder of folders) {
    var files = fs.readdirSync(url + '\\' + folder);
    console.log(files);
    for (let file of files) {
      const data = fs.readFileSync(url + '\\' + folder + '\\' + file, { encoding: 'utf8', flag: 'r' });
      let res = correctlyJSON(data);
      let jsonRes = JSON.parse(res.toString());
      let baseName = file.substr(0, file.lastIndexOf('.'));
      genInitArr.push(baseName);
      resScript += generateScript(jsonRes, baseName, folder);
      resLocal += generateLocal(jsonRes, baseName);
      generateLocal(jsonRes);
    }
  }
  resScript += getEndScript(genInitArr);
  resLocal += supportText.getEndLocalData();
  fs.writeFileSync(urlSave + '/out.js', resScript);
  fs.writeFileSync(urlSave + '/local.js', resLocal);
  return {
    script: resScript,
    local: resLocal
  };
};

module.exports.Generate = Generate;
