var editor = (this.createCodeMirror('code-editor'));
editor.getDoc().setValue(this.fillEditor('text/x-csrc'));

var outputEditor = this.createCodeMirror('code-output', {
	readOnly: 'nocursor',
	showCursorWhenSelecting: false
})

var editor = editor;
var self1 = this;
$('#languageSelector').on('change', function (e) {
	editor.setOption("mode", $(this).val());
	editor.getDoc().setValue(self1.fillEditor($(this).val()));
})

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

function fillEditor(language) {
	switch (language) {
		case 'text/x-csrc':
		return cHello();
		break;
		case 'text/x-c++src':
		return cppHello();
		break;
		case 'text/x-java':
		return javaHello();
		break;
	}
}

function cHello() {
	return '/* Hello World program */\n\n'+
	'#include<stdio.h>\n\n'+
	'main()\n'+
	'{\n\tprintf("Hello World");\n}\n'
}

function javaHello() {
	return '/* Hello World program */\n\n' +
	'public class HelloWorld {\n' +
	'\tpublic static void main(String[] args) {\n' +
	'\t\t// Prints "Hello, World" to the terminal window.\n' +
	'\t\tSystem.out.println("Hello, World");\n' +
	'\t}\n' +
	'}\n'

}

function cppHello() {
	return '/* Hello World program */\n\n'+
	'#include <iostream.h>\n' +
	'main()\n' +
	'{\n' +
	'\tcout << "Hello World!";\n' +
	'\treturn 0;\n' +
	'}\n'
}
