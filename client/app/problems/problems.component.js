'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './problems.routes';

export class ProblemsComponent {
  /*@ngInject*/
  constructor($stateParams, $timeout, $http) {
    'ngInject';

    this.id = $stateParams.id;
    this.$http = $http;
    this.$timeout = $timeout;
    this.editors = [];
    this.response;
    this.tab = 'console';

    var self = this;
    this.$http.get('/api/problems/' + this.id)
    .then(function (res) {
      self.init(res.data.problem, res.data.dataset);
      self.displayTests();
    });
  }

  init(problem, dataset) {
    this.problem = problem;
    this.dataset = dataset;

    this.editor = (this.createCodeMirror('code-editor'));
    this.editor.getDoc().setValue(problem.template);
    this.editor.setOption('mode', 'text/x-' + problem.language+'src');
    this.description = problem.description;
    this.title = problem.title;

    this.output = this.createCodeMirror('code-output', {
      readOnly: 'nocursor',
      showCursorWhenSelecting: false
    })

    var editor = this.editor;
    var self1 = this;
    $('#languageSelector').on('change', function (e) {
      editor.setOption('mode', $(this).val());
      editor.getDoc().setValue(self1.fillEditor($(this).val()));
    })

  }

  run() {
    
  }

  submit() {
    var self = this;
    self.isProcessing = true;

    let data = {
      code:{
        content: this.editor.getValue(), 
        fileExtension: "c"
      }
    }

    if(this.editor.getValue()) {
      this.$http.post('/api/codes', data)
        .then(function (res) {
          self.isProcessing = false;
          self.response = res.data;
          for (var i = 0; i < self.response.length; i++) {
            for (var key in self.response[i]) {
              self.dataset[i][key] = self.response[i][key];
            }
            if (self.dataset[i].isSuccess) {
              self.dataset[i].class = 'list-group-item-success'
            } else {
              self.dataset[i].class = 'list-group-item-danger';
            }
          }
        })
        .catch(function (error) {
          self.isProcessing = false;
          console.log(error);
        })
    }
  }

  displayConsole() {
    if (this.tab === 'console')
      this.output.getDoc().setValue(this.response.consoleOutput);
  }

  displayTests() {
    console.log(this.dataset);
    // if (this.tab === 'tests')
    //   this.output.getDoc().setValue(this.response.consoleOutput);
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
