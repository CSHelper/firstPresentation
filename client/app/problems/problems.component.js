'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './problems.routes';

export class ProblemsComponent {
  /*@ngInject*/
  constructor($stateParams, $timeout) {
    'ngInject';

    if (!$stateParams.language || !$stateParams.lesson) {
      console.log("hi")
    }
    this.$timeout = $timeout;
    this.language = $stateParams.language;
    this.lesson = decodeURI($stateParams.lesson);
    this.editors = [];
    this.init();

  }

  init() {

    this.editor = (this.createCodeMirror('code-editor'));
    this.editor.getDoc().setValue(this.fillEditor('text/x-c++src'));

    this.output = this.createCodeMirror('code-output', {
      readOnly: 'nocursor',
      showCursorWhenSelecting: false
    })

    var editor = this.editor;
    var self1 = this;
    $('#languageSelector').on('change', function (e) {
      editor.setOption("mode", $(this).val());
      editor.getDoc().setValue(self1.fillEditor($(this).val()));
    })
  }

  run() {
    var self = this;
    self.isProcessing = true;
    this.$timeout(function () {
      self.isProcessing = false;
      self.output.getDoc().setValue('Hello World');
    }, 3000)
  }

  submit() {
    this.run();
  }


  createCodeMirror(id, options) {
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

  fillEditor(language) {
    switch (language) {
      case 'text/x-csrc':
        return this.cHello();
        break;
      case 'text/x-c++src':
        return this.cppHello();
        break;
      case 'text/x-java':
        return this.javaHello();
        break;
    }
  }

  cHello() {
    return '/* Hello World program */\n\n'+
      '#include<stdio.h>\n\n'+
      'main()\n'+
      '{\n\tprintf("Hello World");\n}\n'
  }

  javaHello() {
    return '/* Hello World program */\n\n' +
      'public class HelloWorld {\n' +
        '\tpublic static void main(String[] args) {\n' +
            '\t\t// Prints "Hello, World" to the terminal window.\n' +
            '\t\tSystem.out.println("Hello, World");\n' +
        '\t}\n' +
    '}\n'

  }

  cppHello() {
    return '/* Hello World program */\n\n'+
    '#include <iostream.h>\n' +
    'main()\n' +
    '{\n' +
        '\tcout << "Hello World!";\n' +
        '\treturn 0;\n' +
    '}\n'
  }
}

export default angular.module('firstPresentationApp.problems', [uiRouter])
  .config(routes)
  .component('problems', {
    template: require('./problems.html'),
    controller: ProblemsComponent,
    controllerAs: 'problemsCtrl'
  })
  .name;
