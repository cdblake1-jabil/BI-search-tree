define(["text!./tree.css", "./Cookies.js"], function (treecss, Cookies) {

  function tree() { };

  tree.prototype.draw = function (control) {
    var ENVIRONMENT = "DEV";
    var data = [];
    var roots = [];
    var dimension = "Profit Center";
    var server = "https://training.myanalytics.jabil.com/api/v1/";
    // var server = "http://corrdcctmdev10.corp.jabil.org:8000/api/v1/";
    // var server = "http://CORRDCCTMSTG10.corp.jabil.org:8000/api/v1/";
    
    Function.prototype.bind = function (context) {
      // method is attached to the prototype, so just refer to it as this.
      let func = this;
      let previousArgs = [].slice.call(arguments, 1);

      return function () {
        let currentArgs = [].slice.call(arguments);
        let combinedArgs = [].concat(previousArgs, currentArgs);
        return func.apply(context, combinedArgs);
      };
    };

    var PromptAPI = (function () {
      var cognos = window.cognos;
      if (!cognos) return;
      var Report = cognos.Report.getReport("_THIS_");

      var Action = {
        "BACK": "BACK",
        "CANCEL": "CANCEL",
        "FINISH": "FINISH",
        "NEXT": "NEXT",
        "REPROMPT": "REPROMPT"
      };

      var Prompt = function (control) {
        this.context = control;
        this.getName = control.getName();
        this.setValidator = function (validationFunc) {
          control.setValidator(validationFunc);
        };
        this.Value = (function () {
          this.set = function (values) {
            control.setValues(values);
          };
          this.add = function (display, use) {
            control.addValues([{ display: display, use: use }]);
          };
          this.clear = function () {
            control.clearValues();
          };
          this.get = (function () {

            this.display = function () {
              var values = control.getValues();
              var length = values.length;
              if (length == 1) return values[0].display;
              var displayValues = [];

              for (var i = 0; i < length; i++) {
                displayValues.push(values[i].display);
              }
              return displayValues;
            };

            this.use = function () {
              var values = control.getValues();
              var length = values.length;
              if (length == 1) return values[0].use;
              var useValues = [];

              for (var i = 0; i < length; i++) {
                useValues.push(values[i].use);
              }
              return useValues;
            };

            this.all = function () {
              var values = control.getValues();
              var length = values.length;
              if (length == 1) return values[0];
              var useDisplayValues = [];
              for (var i = 0; i < length; i++) {
                useDisplayValues.push(values[i]);
              }

              return useDisplayValues;
            };

            return {
              display: this.display,
              use: this.use,
              all: this.all
            };
          })();

          return {
            set: this.set,
            get: this.get,
            clear: this.clear,
            add: this.add
          };
        })();

        return {
          context: this.context,
          Value: this.Value
        };
      };

      var Parameter = function (parameter) {
        this.context = parameter;
        this.getName = parameter.getName();
        this.getControls = parameter.getControls();
        this.isRequired = parameter.isRequired();

        this.Value = (function () {
          this.add = function (display, use) {
            var value = { display: display, use: use };
            parameter.addValues([value]);
          };
          this.clear = function () {
            return parameter.clearValues();
          };
          this.set = function (values) {
            parameter.clearValues();
            for (var i = 0; i < values.length; i++) {
              parameter.addValues(values[i].display, values[i].use);
            }
          };

          this.get = (function () {

            this.display = function () {
              var values = parameter.getValues();
              var length = values.length;
              if (length == 1) return values[0].display;
              var displayValues = [];

              for (var i = 0; i < length; i++) {
                displayValues.push(values[i].display);
              }
              return displayValues;
            };
            this.use = function () {
              var values = parameter.getValues();
              var length = values.length;
              if (length == 1) return values[0].use;
              var useValues = [];

              for (var i = 0; i < length; i++) {
                useValues.push(values[i].use);
              }
              return useValues;
            };

            this.all = function () {
              var values = parameter.getValues();
              var length = values.length;
              if (length == 1) return values[0];
              var useDisplayValues = [];
              for (var i = 0; i < length; i++) {
                useDisplayValues.push(values[i]);
              }

              return useDisplayValues;
            };

            return {
              display: this.display,
              use: this.use,
              all: this.all,
            };
          })();

          return {
            add: this.add,
            clear: this.clear,
            get: this.get,
            set: this.set
          };
        })();

        return {
          context: this.context,
          getName: this.getName,
          getControls: this.getControls,
          isRequired: this.isRequired,
          Value: this.Value
        };
      };

      this.get = function () {
        var name = function (name) {
          var control = Report.prompt.getControlByName(name);
          return new Prompt(control);
        };

        var all = function () {
          var controls = Report.getControls();
          var prompts = [];
          for (var i = 0; i < controls.length; i++) {
            var control = controls[i];
            prompts.push(new Prompt(control));
          }
          return prompts;
        };

        var parameterByName = function (name) {
          var parameter = Report.prompt.getParameterByName(name);

          return new Parameter(parameter);
        };

        var parameter = function (parameter) {
          var controls = Report.prompt.getControls();
          parameter = parameter.toLowerCase();

          for (var i = 0; i < controls.length; i++) {
            var control = { parameter: controls[i]["@parameter"].toLowerCase() };
            if (parameter == control.parameter) return new Prompt(controls[i]);
          }
        };
        this.type = {
          name: name,
          all: all,
          parameter: parameter,
          pname: parameterByName
        };

        return this.type[arguments[0]].apply(this, [].slice.call(arguments, 1));
      };

      this.sendRequest = function (request) {
        Report.sendRequest(Action[request.toUpperCase()]);
      };

      return {
        get: this.get,
        sendRequest: this.sendRequest
      };

    })();
    var Loading = function (name) {
      var loading = document.createElement("div");
      loading.id = "loading";
      loading.innerHTML = ` 
        <div class="load">loading</div>
        <i class="load-i fas fa-circle-notch fa-lg fa-pulse"></i>
      `;
      FragmentHandler.set(name, loading, true);
      return FragmentHandler.get(name);
    };
    var State = function () {
      var state = new Map();

      this.get = function (prop) {
        return state.get(prop);
      };

      this.has = function (prop) {
        return state.has(prop);
      };

      this.set = function (prop, value) {
        state.set(prop, value);
        return state.get(prop);
      };

      return {
        get: this.get,
        set: this.set,
        has: this.has
      };
    };
    var $scope = {};
    $scope.state = new State();
    $scope.state.set("fragments", new Map());
    $scope.state.set("highlighted", []);

    var AsyncWrapper = function (url) {
      var self = this;
      this.config = {
        endpoint: null,
        url: url,
        headers: [],
        onStateChange: null
      };

      this.endpoint = function (endpoint) {
        this.config["endpoint"] = endpoint;
        return this;
      }.bind(self);

      this.header = function (header, value) {
        this.config["headers"].push({ header: header, value: value });
        return this;
      }.bind(self);

      this.onStateChange = function (func) {
        this.config["onStateChange"] = func;
        return this;
      }.bind(self);

      this.get = function (endpoint) {
        this.config["type"] = "GET";
        this.config["endpoint"] = endpoint;
        return this;
      }.bind(self);

      this.post = function (endpoint) {
        this.config["type"] = "POST";
        this.config["endpoint"] = endpoint;
        return this;
      }.bind(self);

      this.body = function (body) {
        this.config["body"] = body;
        return this;
      }.bind(self);

      this.send = function () {
        return new Promise(function (resolve, reject) {
          var config = self.config;
          var request = new XMLHttpRequest();
          request.open(config.type, config.url + config.endpoint, true);
          // for (var i = 0; i < config.headers.length; i++) {
          //   var header = config.headers[i];
          //   request.setRequestHeader(header.header, header.value);
          // }

          var passport = Cookies.get("usersessionid");
          console.log("cookie", passport);
          // request.setRequestHeader("Authorization", "TM1SessionId ef6bda4anCakZh-L3O1jBg");
          request.setRequestHeader("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==");
          request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
          request.onreadystatechange = function () {
            if (config.onStateChange) config.onStateChange();
            if (this.readyState == 4) {
              resolve(this.response);
            }
          };
          if (config.type == "GET") { request.send(); }
          else { request.send(config.body); }
        });
      };

      return {
        send: this.send,
        endpoint: this.endpoint,
        header: this.header,
        onStateChange: this.onStateChange,
        get: this.get,
        post: this.post
      };
    };
    var FragmentHandler = (function (_fragments) {
      _fragments = _fragments || new Map();
      var Fragment = function (name, child, appendChild) {
        var self = this;
        var state = {
          childIsPresent: false,
          ref: null
        };
        this.name = name;
        this.child = child;
        this.pushChild = function () {
          if (!state.childIsPresent) {
            state.ref.appendChild(self.child);
            state.childIsPresent = true;
          }
        };
        this.transferChild = function (element, position) {
          if (state.childIsPresent) {
            element.insertAdjacentElement(position, self.child);
            state.childIsPresent = false;
          }
        };
        this.hasChild = function () {
          return state.childIsPresent;
        };

        this.delete = function () {
          $scope.state.get("fragments").delete(self.name);
        };

        !function init(appendChild) {
          var fragment = document.createDocumentFragment();
          state.ref = fragment;

          if (appendChild) self.pushChild();

        }(appendChild);

        return {
          name: this.name,
          child: this.child,
          pushChild: this.pushChild,
          transferChild: this.transferChild,
          hasChild: this.hasChild,
          delete: this.delete
        };
      };

      var _addFragment = function (fragment) {
        _fragments.set(fragment.name, fragment);
      };

      this.get = function (name) {
        return _fragments.get(name);
      };

      this.set = function (name, child, appendChild) {
        var fragment = new Fragment(name, child, appendChild);
        _addFragment(fragment);
        return fragment;
      };

      return {
        get: this.get,
        set: this.set
      };
    })($scope.state.get("fragments"));
    var JbTree = (function () {
      var $jbTree = this;

      var Utilities = (function () {
        var Nodes = {
          get: function (id) { return $scope.state.get("current-nodes").get(id); },
          set: function (id, node) { $scope.state.get("current-nodes").set(id, node); },
          has: function (id) { return $scope.state.get("current-nodes").has(id); },
          all: function () { return $scope.state.get("current-nodes"); }
        };
        return {
          init: this.init,
          nodes: {
            get: Nodes.get,
            set: Nodes.set,
            has: Nodes.has,
            all: Nodes.all
          }
        };

      })();

      var Tree = function (config) {
        var self = this;
        var _config = {
          async: config.async,
          data: config.data,
          root: config.root,
          definedRoots: config.definedRoots,
          searchMethod: config.searchMethod, //inline or tree**
          multiSelect: config.multiSelect,
          name: config.name
        };
        var _drawElementRoot = function (root) {
          var element = document.createElement("div");
          element.classList.add("tree");

          root.appendChild(element);
        };
        var _drawSearchRoot = function (root) {
          var element = document.createElement("div");
          element.classList.add("search");

          root.appendChild(element);
        };
        var _defineFragment = function (name, child, appendChild) {
          FragmentHandler.set(name, child, appendChild);
        };
        var _defineNodes = function (data, config) {
          var chunk = 500;
          var index = 0;
          var nodes = new Map();
          var root = config.root.querySelector(".tree");
          config.draw = false;

          function doChunk() {
            var cnt = chunk;
            while (cnt-- && index < data.length) {
              var node = new Node(data[index].name, data[index].id, data[index].parents, data[index.level], config);
              nodes.set(node.attributes.id, node);
              ++index;
            }
            if (index < data.length) { setTimeout(doChunk, 500); }
            else {
              $scope.state.set("current-nodes", nodes);
              _drawRoots(root, config.name);
              $scope.state.set("NodesLoaded", true);
            }
          }
          doChunk();
          return nodes;
        };
        var _drawRoots = function (root, name) {
          $scope.state.set(`${name}:roots`, []);
          for (let i = 0; i < _config.definedRoots.length; i++) {
            var node = Utilities.nodes.get(_config.definedRoots[i].id);
            node.draw(root);
            $scope.state.get(`${name}:roots`).push(node);
          }
        };

        !function onInit() {
          $scope.state.set("NodesLoaded", false);
          _drawSearchRoot(_config.root);
          _drawElementRoot(_config.root);
          _defineFragment(_config.name, _config.root, true);

          var nodes = _defineNodes(_config.data, config);
          $scope.state.set("current-nodes", nodes);

        }();
      };
      var Node = function (name, id, parents, level, config) {
        var self = this;
        this.attributes = {
          name: name,
          id: id,
          parents: parents,
          level: level
        };
        var _config = {
          onSelect: config.onSelect,
          onDeselect: config.onDeselect,
          onOpen: config.onOpen,
          onClose: config.onClose,
          data: config.data,
          root: config.root,
          treeFragment: config.treeFragment
        };
        this.state = {
          opened: false,
          selected: false,
          ref: null,
          children: []
        };
        this.actions = new Map();
        (function () {
          var childrenContainer = function () {
            return (self.state.ref) ?
              self.state.ref.querySelector(".children") : null;
          };

          self.actions.set("open", open);
          self.actions.set("close", close);
          self.actions.set("select", select);
          self.actions.set("deselect", deselect);
          self.actions.set("highlight", highlight);
          self.actions.set("deHighlight", deHighlight);

          function open() {
            var nodeConfig = config;
            var arrow = self.state.ref.querySelector(".arrow");
            var cChild = childrenContainer();
            nodeConfig.draw = true;
            nodeConfig.root = childrenContainer();

            arrow.classList.add("open-arrow");
            arrow.classList.add("rotate");
            children.get(nodeConfig);
            if (cChild) cChild.classList.remove("hide");
            self.state["opened"] = _toggle(self.state["opened"]);
          }
          function close() {
            var arrow = self.state.ref.querySelector(".arrow");
            var cChild = childrenContainer();
            arrow.classList.remove("open-arrow");
            arrow.classList.remove("rotate");
            if (cChild) cChild.classList.add("hide");
            self.state["opened"] = _toggle(self.state["opened"]);
          }
          function select() {
            var selection = $scope.state.get("current-selection");
            self.state.ref.querySelector(".node")
              .classList.add("selected");
            self.state["selected"] = _toggle(self.state["selected"]);
            selection.addSelection(self.attributes.id);
          }
          function deselect() {
            var selection = $scope.state.get("current-selection");
            self.state.ref.querySelector(".node")
              .classList.remove("selected");
            self.state["selected"] = _toggle(self.state["selected"]);
            selection.removeSelection(self.attributes.id);
          }
          function highlight() {
            self.state.ref.querySelector(".node")
              .classList.add("highlight");
            $scope.state.get("highlighted").push(self);
          }

          function deHighlight() {
            self.state.ref.querySelector(".node").classList.remove("highlight");

            var highlightedNodes = $scope.state.get("highlighted");
            highlightedNodes.splice(highlightedNodes.indexOf(self), 1);
          }
        })();
        this.draw = function (root) {
          root.appendChild(self.state.ref);
        };
        var children = (function () {
          this.get = function (config) {
            var chunk = 2000;
            var index = 0;
            var childContainer = self.state.ref.querySelector(".children");
            var template = document.createElement("div");

            var nodeConfig = config;
            nodeConfig.root = template;
            var children;
            var loading;
            if (self.state.children.length == 0 && !$scope.state.get("fragments").has(`${self.attributes.id}-children`)) {
              children = FragmentHandler.set(`${self.attributes.id}-children`, template, true);
              loading = Loading(`${self.attributes.id}-loading`);

              loading.transferChild(childContainer, "beforeend");
              setTimeout(function () {
                new Promise(function (resolve) {

                  doChunk(resolve);
                }).then(function () {
                  loading.pushChild();
                  children.transferChild(childContainer, "beforeend");
                });

              }, 0);


              return self.state.children;
            }

            function doChunk(callback) {
              var cnt = chunk;
              while (cnt-- && index < config.data.length) {
                var element = config.data[index];
                for (let i = 0; element.parents && i < element.parents.length; i++) {
                  if (element.parents[i].id == self.attributes.id) {
                    var hasNode = Utilities.nodes.has(element.id);
                    var node = (hasNode) ?
                      Utilities.nodes.get(element.id).draw(template) : (function () {
                        return new Node(element.name, element.id, element.parents, element.level, config);
                      })();
                    self.state.children.push(node);
                  }
                }
                ++index;
              }
              if (index < data.length) {
                setTimeout(doChunk(callback), 100);
              } else { callback(); }
            }
          };
          return {
            get: this.get

          };


        })();
        var _toggle = function (state) {
          return (state) ? false : true;
        };
        var _template = function () {
          var template = document.createElement("div");
          template.setAttribute("node", self.attributes.id);
          template.innerHTML = `<div class="node">
          <span class="arrow">
            ${(self.attributes.level == 0) ? "<i class=\"fas fa-caret-right hide\"></i>" : "<i class=\"fas fa-caret-right 2x\"></i>"}
          </span>
          <span class="tree-node">${self.attributes.name}</span>
        </div> 
        <div class="children"></div>`;

          template.querySelector(".node").addEventListener("click", function (e) {
            var state = self.state["selected"];
            var action = (state) ? "deselect" : "select";
            _execute(action);
            e.stopPropagation();
          });

          template.querySelector(".arrow").addEventListener("click", function (e) {
            var state = self.state["opened"];
            var action = (state) ? "close" : "open";
            _execute(action);
            e.stopPropagation();
          });

          return template;
        };

        var _execute = function (action) {
          self.actions.get(action)();
          if (self.state[action]) self.state[action](self);
        };

        !function init() {
          var node = _template();
          self.state.ref = node;
          if (_config.draw) self.draw(_config.root);
        }();

        return {
          state: this.state,
          attributes: this.attributes,
          actions: this.actions,
          draw: this.draw
        };
      };

      var Search = function (config) {
        var self = this;
        var _config = {
          searchMethod: config.searchMethod,
          root: config.root,
          data: config.data,
          treeFragment: config.treeFragment,
          name: config.name
        };
        this.state = {
          searchTreeFragment: null,
          treeFragment: config.treeFragment,
          results: []
        };
        var _validTerm = function (term) {
          return !(term == "" || term == undefined || term == null);
        };
        var _drawInput = function (root) {
          var input = document.createElement("div");
          input.innerHTML = `
            <input type="text" id="search">
            <div class="submit">
                <a class="btn">
                    <i class="fas fa-caret-right"></i>
                </a>
            </div>`;
          root.insertAdjacentElement("afterbegin", input);
          return input.querySelector("#search");
        };
        var _drawSearchContainer = function (root) {
          var container = document.createElement("div");
          container.id = "search-root";
          root.insertAdjacentElement("beforeend", container);
          return container;
        };
        var _deHighlightAll = function () {
          var highlighted = $scope.state.get("highlighted");
          while (highlighted.length !== 0) {
            highlighted[0].actions.get("deHighlight")();
          }
        };

        var _closeRoots = function () {
          var roots = $scope.state.get(`${_config.name}:roots`);
          for (var i = 0; i < roots.length; i++) {
            roots[i].actions.get("close")();
          }
        };

        var searchMethod = {
          inlineSearch: function (term) {
            var scroller = $scope.state.get("scroller");
            new Promise(function (resolve) {
              _deHighlightAll();
              _closeRoots();
              scroller.reset();
              if (!_validTerm(term)) return;
              if ($scope.state.get("NodesLoaded")) {
                var results = _searchResults(Utilities.nodes.all(), term);
                for (let i = 0; i < results.length; i++) {
                  var parents = _getParents(results[i]);
                  _displayChildren(parents);
                  results[i].actions.get("highlight")();
                }
                resolve();
              } else {
                setTimeout(function () {
                  searchMethod["inlineSearch"](term);
                }, 300);
              }
            })
              .then(function () {
                scroller.next();
              });

          }
        };
        var _noResults = function (element) {
          if (self.state.results.length == 0) { element.classList.add("no-results"); }
          else { element.classList.remove("no-results"); }
        };
        var _searchResults = function (map, term) {
          var results = [];
          var values = map.values();
          var value = values.next();
          while (value.done !== true) {
            if (value.value.attributes.id.toLowerCase().includes(term.toLowerCase())) {
              results.push(value.value);
            }
            value = values.next();
          }
          self.state.results = results;
          return results;
        };

        var _getParents = function (node) {
          var parents = [];
          while (node.attributes.parents !== null) {
            var parent = Utilities.nodes.get(node.attributes.parents[0].id);
            parents.push(parent);
            node = parent;
          }
          return parents;
        };

        var _displayChildren = function (store) {
          if (!store || store && store.length == 0) return;
          for (let i = 0; i < store.length; i++) {
            var parent = Utilities.nodes.get(store[i].attributes.id);
            if (!parent) return;
            parent.actions.get("open")();
          }
        };

        !function init() {
          var search = document.getElementById("search");
          search = (search) ? search : _drawInput(_config.root);

          var container = _drawSearchContainer(_config.root);
          var button = _config.root.querySelector(".submit");

          self.state.searchTreeFragment = FragmentHandler.set("search-tree", container, true);
          _config.root = container;
          button.addEventListener("click", function (e) {
            searchMethod[_config.searchMethod](search.value);
            _noResults(e.target);
          });
          // search.addEventListener("keypress", function (e) {
          //   var key = e.which || e.keycode;
          //   if (key === 13) {
          //     searchMethod[_config.searchMethod](search.value);
          //     _noResults(e.target);
          //   }
          // });
        }();

        return {
          init: this.init
        };
      };

      var SearchScrollIterator = function (root, scrollComponent) {
        var self = this;
        this.state = {
          index: -1,
          nodes: $scope.state.get("highlighted"),
          currentNode: null,
          scrollComponent: scrollComponent
        };

        var _components = {
          counter: null,
          selection: null
        };

        var _updateCounter = function () {
          if (self.state.nodes.length == 0) _components.counter.innerHTML = "";
          _components.counter.innerHTML = `${self.state.index + 1}/${self.state.nodes.length}`;
        };

        var _scrollBack = function () {
          if (self.state.index == 0) return;

          self.state.currentNode = self.state.nodes[--self.state.index];
          _update(self.state.currentNode.state.ref.offsetTop);

        };

        var _scrollForward = function () {
          if (self.state.index + 1 == self.state.nodes.length) return;
          self.state.currentNode = self.state.nodes[++self.state.index];
          if (self.state.index !== self.state.nodes.length) _update(self.state.currentNode.state.ref.offsetTop);

        };

        var _update = function (position) {
          _components.selection = self.state.currentNode.attributes.name;
          _updateCounter();
          self.state.scrollComponent.scrollTop = position;

        };

        this.reset = function () {
          self.state.index = -1;
          self.state.nodes = $scope.state.get("highlighted");
          _components.counter.innerHTML = "";
        };

        !function onInit(root) {

          var template = document.createElement("div");
          template.id = "scroller";
          template.innerHTML = `
          <div class="scroll-selection-name"></div>
          <div class ="scroll-selector left-scroll">
            <i class="fas fa-arrow-left scroll-arrow"></i>
          </div>
          <span id="counter"></span>
          <div class="scroll-selector right-scroll">
          <i class="fas fa-arrow-right scroll-arrow"></i>
          </div>
        `;
          _components.counter = template.querySelector("#counter");
          template.querySelector(".left-scroll").addEventListener("click", _scrollBack);
          template.querySelector(".right-scroll").addEventListener("click", _scrollForward);
          root.insertAdjacentElement("beforeend", template);
        }(root);

        return {
          reset: this.reset,
          state: this.state,
          next: _scrollForward,
          back: _scrollBack
        };
      };

      var Selection = function (config) {
        var self = this;
        self.state = {
          values: null,
          selections: new Map(),
          addingValues: false,
          removingValues: false,
          drawTool: null
        };
        var _config = {
          root: config.root
        };
        var _template = function () {
          var template = document.createElement("div");
          template.classList.add("node");
          return template;
        };
        this.removeSelection = function (id) {
          var selection = self.state.selections.get(id);
          if (selection && selection.drawn) self.state.drawTool.remove(id);
          if (selection) _onDeselect(Utilities.nodes.get(id));
          _setValues();

        };
        this.addSelection = function (id) {
          var selection = self.state.selections.get(id);
          var button = self.state.element.querySelector(".pag-button");
          if (!selection) {
            self.state.selections.set(id, { element: _template(), drawn: false });
            selection = self.state.selections.get(id);
            if (button) button.classList.remove("disabled");
          }
          if (!selection.drawn && !self.state.drawTool.atThreshold()) {
            self.state.drawTool.draw(id);
            selection.drawn = true;
          }
          _onSelect(Utilities.nodes.get(id));
        };
        var _onSelect = function (node) {
          var pc = PromptAPI.get("pname", "PC");
          var munDimension = dimension.replace(" ", "");
          var use = `[Reporting General Ledger].[${munDimension}].[${munDimension}]->:[TM].[${munDimension}].[${munDimension}].[@MEMBER].[${node.attributes.id}]`;
          var display = node.attributes.name;
          var selections = $scope.state.get("selections");
          selections.set(node.attributes.id, { display: display, use: use });
          pc.Value.add(display, use);
        };
        var _onDeselect = function (node) {
          var selections = $scope.state.get("selections");
          selections.delete(node.attributes.id);
        };
        var _setValues = function () {
          var pc = PromptAPI.get("pname", "PC");
          console.log(pc);
          pc.Value.set(Array.from($scope.state.get("selections"), function (element) {
            console.log(element);
            return element[1];
          }));
        };
        var _getInitialSelections = function () {
          if (!PromptAPI) return;
          var prompt = PromptAPI.get("pname", "PC");
          console.log(prompt.Value.get.all());
          return prompt.Value.get.all();
        };
        var _deselectAll = function () {
          if (self.state.removingValues || self.state.addingValues) return;
          self.state.removingValues = true;
          var chunk = 2000;
          var values = Utilities.nodes.all().values();
          var value = values.next();
          doChunk();
          function doChunk() {
            var cnt = chunk;
            while (cnt-- && value.value) {
              value.value.actions.get("deselect")();
              value = values.next();
            }
            if (value.value) {
              setTimeout(doChunk, 200);
            } else {
              self.state.removingValues = false;
              self.state.drawTool.clear();
              _setValues();
            }
          }
        };
        var _selectAll = function () {
          if (self.state.removingValues || self.state.addingValues) return;
          self.state.addingValues = true;
          var chunk = 2000;
          var values = Utilities.nodes.all().values();
          var value = values.next();
          doChunk();
          function doChunk() {
            var cnt = chunk;
            while (cnt-- && value.value) {
              value.value.actions.get("select")();
              value = values.next();
            }
            if (value.value) {
              setTimeout(doChunk, 200);
            } else {
              self.state.addingValues = false;
            }
          }
        };
        var drawTool = function () {
          var _state = {
            threshold: 20,
            index: 0,
            count: 20,
            element: null
          };
          var _draw = function (id) {
            if (_atThreshold()) return;
            var selection = self.state.selections.get(id);
            var element = selection.element;
            document.querySelector(".nodes").insertAdjacentElement("beforeend", element);
            element.innerHTML = `${id}<div class="minus"><i class="fas fa-minus-square"></i></div>`;
            element.querySelector(".minus").addEventListener("click", function () {
              var node = Utilities.nodes.get(id);
              node.actions.get("deselect")();
              _setValues();
            });
            _state.index++;
            return element;
          };
          var _drawLoadMore = function () {
            if (self.state.element.querySelector(".pag-button")) return;
            var button = document.createElement("a");
            button.addEventListener("click", _drawToThreshold);
            button.classList.add("pag-button");
            button.innerHTML = "Load More";
            self.state.element.insertAdjacentElement("beforeend", button);
          };
          var _clearLoadMore = function () {
            var button = self.state.element.querySelector(".pag-button");
            if (button) button.remove();
          };
          var _drawToThreshold = function () {
            var selections = self.state.selections;
            var entries = selections.entries();
            var entry = entries.next();
            var draw = [];
            var index = _state.index;
            if (index == _state.count) _state.count += _state.threshold;
            while (index < _state.count && entry.value) {
              if (!entry.value[1].drawn) {
                draw.push(entry.value[0]);
                entry.value[1].drawn = true;
                index++;
              }
              entry = entries.next();
            }
            for (var i = 0; i < draw.length; i++) {
              _draw(draw[i]);
            }
            if (!entry.value) self.state.element.querySelector(".pag-button").classList.add("disabled");
          };
          var _atThreshold = function () {
            var atThreshold = false;
            if (_state.count == _state.index) {
              atThreshold = true;
              _drawLoadMore();
            }

            return (atThreshold);
          };
          this.draw = function (id) {
            _draw(id);
          };
          this.remove = function (id) {
            var selection = self.state.selections.get(id);
            selection.element.remove();
            selection.drawn = false;
            _state.index--;
            if (_state.count > _state.threshold) _state.count--;
            if (!_atThreshold()) _clearLoadMore();
          };
          this.clear = function () {
            _state.count = _state.threshold;
            _state.index = 0;
          };
          return {
            draw: this.draw,
            clear: this.clear,
            remove: this.remove,
            atThreshold: _atThreshold
          };
        };

        !function init() {
          $scope.state.set("selections", new Map());
          self.state.values = _getInitialSelections() || [];
          self.state.drawTool = new drawTool();
          var values = self.state.values;


          for (var i = 0; i < values.length; i++) {
            var node = Utilities.nodes.get(values[i].display);
            if (node) node.actions.get("select")();
          }

          var selection = document.createElement("div");
          self.state.element = selection;
          selection.classList.add("content");
          selection.id = "selection";
          selection.innerHTML = "<div class=\"nodes\"></div>";
          _config.root.insertAdjacentElement("beforeend", selection);
          $scope.state.set("current-selection", self);

          var bContainer = document.createElement("div");
          bContainer.classList.add("buttons");
          _config.root.insertAdjacentElement("beforeend", bContainer);
          var button = document.createElement("div");
          // button.classList.add("select-btn");
          // button.addEventListener("click", _selectAll);
          // button.innerHTML = "Select All";
          // bContainer.insertAdjacentElement("beforeend", button);

          button = document.createElement("div");
          button.classList.add("deselect-btn");
          button.innerHTML = "Deselect All";
          button.addEventListener("click", _deselectAll);
          bContainer.insertAdjacentElement("beforeend", button);
        }();

        return {
          state: this.state,
          removeSelection: this.removeSelection,
          addSelection: this.addSelection
        };
      };

      this.state = new State();

      this.init = function (config, root) {
        var rootParent = config.root.parentNode;
        var tree = new Tree(config);
        var loading = Loading("current-load");
        this.state.set("current-tree", tree);

        var searchConfig = Object.assign({}, config);
        searchConfig.treeFragment = FragmentHandler.get(config.name);
        searchConfig.root = searchConfig.treeFragment.child.querySelector(".search");

        new Promise(function (resolve) {
          loading.transferChild(root, "beforeend");
          resolve();
        })
          .then(function () {
            FragmentHandler.get(config.name).transferChild(root, "beforeend");

          })
          .then(function () {
            loading.pushChild();
            new Search(searchConfig);
            var scroller = new SearchScrollIterator(
              searchConfig.treeFragment.child.querySelector(".search"),
              config.root.querySelector(".tree")
            );

            $scope.state.set("scroller", scroller);
          })
          .then(function () {
            var selectionConfig = Object.assign({}, config);
            selectionConfig.root = rootParent;
            new Selection(selectionConfig);
          });



      };

      return {
        init: this.init,
        state: this.state
      };
    })();



    function start() {
      console.log(document);
      JbTree.init({
        data: data, root: document.contentWindow.document.querySelector(".root"), searchMethod: "inlineSearch",
        subsets: true, definedRoots: roots, name: "root-tree"
      }, document.contentWindow.document.querySelector(".main"));
    }

       

    if (ENVIRONMENT === "DEV") {
      data = [
        { name: "Parent 1", id: "Parent 1", parents: null, level: 10 },
        { name: "Parent 1 - FY 2017", id: "Parent 1 - FY 2017", parents: null, level: 0 },
        { name: "Alternative Parent", id: "Alternative Parent", parents: null, level: 10 },
        { name: "Child 1", id: "Child 1", parents: [{ name: "Parent 1", id: "Parent 1" }, { name: "Alternative Parent", id: "Alternative Parent" }], level: 1 },
        { name: "Grand Child 1", id: "Grand Child 1", parents: [{ name: "Child 1", id: "Child 1" }], level: 0 },
        { name: "Grand Child 2", id: "Grand Child 2", parents: [{ name: "Child 1", id: "Child 1" }], level: 0 }];
      roots = [
        { name: "Parent 1", id: "Parent 1", parents: null, level: 10 },
        { name: "Parent 1 - FY 2017", id: "Parent 1 - FY 2017", parents: null, level: 0 },
        { name: "Alternative Parent", id: "Alternative Parent", parents: null, level: 10 }];
      
      start(); 
    }
    if (ENVIRONMENT === "PROD") {

      var rootsRequest = new AsyncWrapper(server);
      var elementsRequest = new AsyncWrapper(server);

      rootsRequest.post()
        .endpoint("ExecuteMDXSetExpression?$expand=Tuples($expand=Members($expand=Parent($select=Name,UniqueName)))")
        //.header("Content-Type", "application/json; charset=utf-8")
        // .header("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==")
        .body(JSON.stringify(
          { MDX: `{{Filter({TM1SubsetAll([${dimension}])}, [${dimension}].CurrentMember.Parent.Name="")}}` })
        );


      elementsRequest.get()
        .endpoint(`Dimensions('${dimension}')/Hierarchies('${dimension}')/Elements?$expand=Parents`);
      // .header("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==");
      // .send().then(function (results) {
      // })

      Promise.all([rootsRequest.send(), elementsRequest.send()]).then(function (results) {
        var rootData = JSON.parse(results[0]);
        var elements = JSON.parse(results[1]);

        for (let i = 0; i < rootData.Tuples.length; i++) {
          var root = rootData.Tuples[i];

          data.push({ name: root.Members[0].Name, id: root.Members[0].Name, parents: null, level: root.Members[0].Level });
          roots.push({ name: root.Members[0].Name, id: root.Members[0].Name, parents: null, level: root.Members[0].Level });
        }

        for (let i = 0; i < elements.value.length; i++) {
          var value = elements.value[i];
          var pArray = [];
          for (let j = 0; j < value.Parents.length; j++) {
            pArray.push({ id: value.Parents[j].Name });
          }
          data.push({
            name: value.Attributes.DisplayName,
            id: value.Attributes.DisplayName,
            parents: (pArray.length == 0) ? null : pArray,
            level: value.Level
          });
        }
      })
        .then(function () {
          window["_TREE_"] = start();
        });
    }
  }

  return tree;
});