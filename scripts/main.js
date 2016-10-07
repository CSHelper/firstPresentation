console.log(document.getElementById('code-editor'));

var editors = [];
init();
function changeLanguage(language) {
	for (var i = 0; i < editors.length; i++) {
		editors[i].setOption("mode", language);
	}
}

$('#languageSelector').on('change', function (e) {
	changeLanguage($(this ).val());
})

function init() {
	editors.push(createCodeMirror('code-editor'));
	createCodeMirror('code-output', {
		readOnly: 'nocursor',
		showCursorWhenSelecting: false
	})
}

function createCodeMirror(id, options) {
	options = options || {};

	var defaultOptions = {
		lineNumbers: true,
		matchBrackets: true,
		lineWrapping: true,
		scrollbarStyle: 'native',
		lineWrapping: true,
		theme: 'icecoder',
		extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'},
		mode: 'text/x-c++src',
	}

	for (var key in options) {
		defaultOptions[key] = options[key];
	}

	return CodeMirror.fromTextArea(document.getElementById(id), defaultOptions, { showToolbar: true })
}