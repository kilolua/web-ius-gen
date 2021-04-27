module.exports = Object.freeze({
  beginHTML: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MENU</title>
    <link rel="stylesheet" href="style/GlobalStyle.css">
    <link rel="stylesheet" href="style/main.css">
    <script src="js/mainJS.js"></script>
    <script src="datamock/menu.js"></script>
    <script src="js/commonTelem.js"></script>
    <script src="js/scriptTelem.js"></script>
    <meta http-equiv="X-UA-Compatible" content="Edge">
    <script language="JavaScript" type="text/javascript">
		var page = new PageClassWrapper();
		function PageClassWrapper() {
			this.proccesBtn = function (key) {
				animateButton(document.getElementById(key),1,document.getElementById(key).onclickF);
			};
			this.loaded = function(_scrData) {
			}
		}
        function catchHardwareButton(keyCode) {


            if (!isInArray(enabledHWBtns, keyCode))
                return;
            if (keyCode === 27) {
                setResult("cancel");
                return;
            }
        }
    </script>
</head>
<body onload="onLoadBody();">`,
  endHTML:`</body></html>`,
  startDataMock:`function GetScrDataMock()
{
    var data = `,
  endDataMock:`;
    return JSON.stringify(data);
}`,
});