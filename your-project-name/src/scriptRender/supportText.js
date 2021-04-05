const getButtonText = (data, name, baseName)=>{
  return `
\tscr.setButtonJson({name:"${name}", text:getLangText("${baseName}_${name}"), visible:${data.visible}, enable:${data.enable}, ext:""}, onEmpty);`
}

const getInputText = (data, name)=>{
  return `
\tscr.setInputJson({name:"${name}", visible:${data.visible}, enable:${data.enable}, text:"${data.text}", type:"${data.type}",ext: ""}, onInput);`
}

const getTimeoutText = ()=>{
  return `
  scr.setTimeout(timeoutValue, "", onTimeout);`
}

const getLabelText = (data, name, baseName)=>{
  return`
\tscr.setLabelJson({name:"${name}", value:getLangText("${baseName}_${name}")});`
}
const getImageText = (data, name)=>{
  return`
\tscr.setImage("${name}","${data.src}","");
`
}

const getLocalText = (name, text)=>{
  return`
\t"${name}": {
\t\t"ru":"${text}",
\t\t"en":"***${text}"
\t},`
}

const getHeaderScript = ()=>{
  return `var timeoutValue = 60000;
  `
}

const getBeginScreenData = (name)=>{
  return `${name} = function(){
\tvar onError =  function () {
\t\tscr.nextScreen(msg_err);
\t};
\tscr.addOnError(onError);

\tscr.addCall('TellMEWrapper', onTellMEWrapper);`
}

const getEndScreenData = (name)=>{
  return `
\tscr.render("${name}");
};

`
}

const getBeginLocalData = ()=>{
  return `_words_={`
}

const getEndLocalData = ()=>{
  return `
};`
}


module.exports.getLabelText = getLabelText
module.exports.getButtonText = getButtonText
module.exports.getBeginScreenData = getBeginScreenData
module.exports.getEndScreenData = getEndScreenData
module.exports.getBeginLocalData = getBeginLocalData
module.exports.getEndLocalData = getEndLocalData
module.exports.getLocalText = getLocalText
module.exports.getImageText = getImageText
module.exports.getInputText = getInputText
module.exports.getTimeoutText = getTimeoutText



