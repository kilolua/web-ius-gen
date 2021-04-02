const fs = require('fs');
const path = require('path');
const supportText = require('./supportText')
const filename = path.join(__dirname,'datamock');

const correctlyJSON = str =>{
  let text = str;
  text = text.substr(text.indexOf('{')+1, text.length);
  text = text.substr(text.indexOf('{'), text.length);
  text = text.substr(0, text.lastIndexOf('}'));
  text = text.substr(0, text.lastIndexOf('}')+1);
  text = text.trim();
  text = text.replace(/\s{2,}/g, ' ');
  //text = text.replace(/ /g, '');
  text = text.replace(/,}/g, '}');
  text = text.replace(/'/g, '"');
  text = text.replace(/:/g, ': ');
  text = text.replace(/,/g, ', ');
  console.log(text);
  text = JSON.stringify(eval("(" + text + ")"))
  //console.log(text)
  //console.log(eval(text))
  return text
}

const getScreenData = (data, baseName)=>{
  let res = "";
  let key;
  if (!!data.button){
    for (key in data.button){
      res += supportText.getButtonText(data.button[key], key, baseName);
    }
  }
  if (!!data.label){
    for (key in data.label){
      res += supportText.getLabelText(data.label[key], key, baseName);
    }
  }
  if (!!data.image){
    for (key in data.image){
      res += supportText.getImageText(data.image[key], key, baseName);
    }
  }
  return res
}

const getNameLocalElement = (name, baseName)=>{
  return `${baseName}_${name}`
}

const getLocalData = (data, baseName)=>{
  let res = "";
  let key;
  if (!!data.button){
    for (key in data.button){
      res += supportText.getLocalText(getNameLocalElement(key, baseName), data.button[key].text);
    }
  }
  if (!!data.label){
    for (key in data.label){
      res += supportText.getLocalText(getNameLocalElement(key, baseName), data.label[key].value);
    }
  }
  return res
}

const generateScript = (jsonData, baseName)=>{
  let res = "";
  res = supportText.getBeginScreenData(baseName);
  res += getScreenData(jsonData, baseName);
  res += supportText.getEndScreenData(baseName);
  return res;
}

const generateLocal = (jsonData, baseName) => {
  let res = "";
  res += getLocalData(jsonData, baseName);
  return res
}

const Generate = (url, urlSave) => {
  var files = fs.readdirSync(url);
  let resScript = "";
  let resLocal = "";
  resLocal = supportText.getBeginLocalData();
  for (let file of files){
    const data = fs.readFileSync(url+"/"+file, {encoding:'utf8', flag:'r'});
    let res = correctlyJSON(data);
    let jsonRes = JSON.parse(res.toString())
    let baseName = file.substr(0, file.lastIndexOf("."))
    resScript += generateScript(jsonRes, baseName);
    resLocal += generateLocal(jsonRes, baseName);
    generateLocal(jsonRes);
  }
  resLocal += supportText.getEndLocalData();
  fs.writeFileSync(urlSave+'/out.js', resScript);
  fs.writeFileSync(urlSave+'/local.js', resLocal);
  return {
    script: resScript,
    local: resLocal
  };
}

module.exports.Generate = Generate
