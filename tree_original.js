new Promise(function(resolve) {
  var ENVIRONMENT = "BI-DEV";
  var data = [];
  var roots = [];
  var aliasCodes = {
    "Profit Center": "DisplayName",
    "Cost Center": "CostCenterIDAndName",
    Account: "Code - Description"
  };
  var dimensionCodes = ["Profit Center", "Cost Center", "Account"];
  var serverCodes = {
    "TM1-DEV": "http://corrdcctmdev10.corp.jabil.org:8000/api/v1/",
    TEST: "http://corrdcctmdev10.corp.jabil.org:8000/api/v1/",
    "BI-DEV": "https://training.myanalytics.jabil.com/api/v1/",
    "TM1-STG": "http://CORRDCCTMSTG10.corp.jabil.org:8000/api/v1/",
    "BI-PRD": "https://myanalytics.jabil.com/api/v1/"
  };
  var parameterCodes = {
    "Profit Center": "PC",
    "Cost Center": "CC",
    Account: "Account"
  };

  var dimension = dimensionCodes[2];
  var server = serverCodes[ENVIRONMENT];
  var alias = aliasCodes[dimension];
  (function(k) {
    if ("function" === typeof define && define.amd) define(k);
    else if ("object" === typeof exports) module.exports = k();
    else {
      var g = window.Cookies,
        c = (window.Cookies = k());
      c.noConflict = function() {
        window.Cookies = g;
        return c;
      };
    }
  })(function() {
    function k() {
      for (var c = 0, b = {}; c < arguments.length; c++) {
        var a = arguments[c],
          f;
        for (f in a) b[f] = a[f];
      }
      return b;
    }
    function g(c) {
      function b(a, f, d) {
        var h;
        if ("undefined" !== typeof document) {
          if (1 < arguments.length) {
            d = k({ path: "/" }, b.defaults, d);
            if ("number" === typeof d.expires) {
              var l = new Date();
              l.setMilliseconds(l.getMilliseconds() + 864e5 * d.expires);
              d.expires = l;
            }
            try {
              (h = JSON.stringify(f)), /^[\{\[]/.test(h) && (f = h);
            } catch (g) {}
            f = c.write ? c.write(f, a) : encodeURIComponent(String(f)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            a = encodeURIComponent(String(a));
            a = a.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
            a = a.replace(/[\(\)]/g, escape);
            return (document.cookie = [a, "=", f, d.expires ? "; expires=" + d.expires.toUTCString() : "", d.path ? "; path=" + d.path : "", d.domain ? "; domain=" + d.domain : "", d.secure ? "; secure" : ""].join(""));
          }
          a || (h = {});
          for (var l = document.cookie ? document.cookie.split("; ") : [], p = /(%[0-9A-Z]{2})+/g, n = 0; n < l.length; n++) {
            var q = l[n].split("="),
              e = q.slice(1).join("=");
            '"' === e.charAt(0) && (e = e.slice(1, -1));
            try {
              var m = q[0].replace(p, decodeURIComponent),
                e = c.read ? c.read(e, m) : c(e, m) || e.replace(p, decodeURIComponent);
              if (this.json)
                try {
                  e = JSON.parse(e);
                } catch (g) {}
              if (a === m) {
                h = e;
                break;
              }
              a || (h[m] = e);
            } catch (g) {}
          }
          return h;
        }
      }
      b.set = b;
      b.get = function(a) {
        return b.call(b, a);
      };
      b.getJSON = function() {
        return b.apply({ json: !0 }, [].slice.call(arguments));
      };
      b.defaults = {};
      b.remove = function(a, c) {
        b(a, "", k(c, { expires: -1 }));
      };
      b.withConverter = g;
      return b;
    }
    return g(function() {});
  });

  var PromptAPI = (function() {
    var cognos = window.cognos;
    if (!cognos) return;
    var Report = cognos.Report.getReport("_THIS_");

    var Action = {
      BACK: "BACK",
      CANCEL: "CANCEL",
      FINISH: "FINISH",
      NEXT: "NEXT",
      REPROMPT: "REPROMPT"
    };

    var Prompt = function(control) {
      this.context = control;
      this.getName = control.getName();
      this.setValidator = function(validationFunc) {
        control.setValidator(validationFunc);
      };
      this.Value = (function() {
        this.set = function(values) {
          control.setValues(values);
        };
        this.add = function(display, use) {
          control.addValues([{ display: display, use: use }]);
        };
        this.clear = function() {
          control.clearValues();
        };
        this.get = (function() {
          this.display = function() {
            var values = control.getValues();
            var length = values.length;
            if (length == 1) return values[0].display;
            var displayValues = [];

            for (var i = 0; i < length; i++) {
              displayValues.push(values[i].display);
            }
            return displayValues;
          };

          this.use = function() {
            var values = control.getValues();
            var length = values.length;
            if (length == 1) return values[0].use;
            var useValues = [];

            for (var i = 0; i < length; i++) {
              useValues.push(values[i].use);
            }
            return useValues;
          };

          this.all = function() {
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

    var Parameter = function(parameter) {
      this.context = parameter;
      this.getName = parameter.getName();
      this.getControls = parameter.getControls();
      this.isRequired = parameter.isRequired();

      this.Value = (function() {
        this.add = function(display, use) {
          var value = { display: display, use: use };
          parameter.addValues([value]);
        };
        this.clear = function() {
          return parameter.clearValues();
        };
        this.set = function(values) {
          parameter.clearValues();
          for (var i = 0; i < values.length; i++) {
            parameter.addValues(values[i].display, values[i].use);
          }
        };

        this.get = (function() {
          this.display = function() {
            var values = parameter.getValues();
            var length = values.length;
            if (length == 1) return values[0].display;
            var displayValues = [];

            for (var i = 0; i < length; i++) {
              displayValues.push(values[i].display);
            }
            return displayValues;
          };
          this.use = function() {
            var values = parameter.getValues();
            var length = values.length;
            if (length == 1) return values[0].use;
            var useValues = [];

            for (var i = 0; i < length; i++) {
              useValues.push(values[i].use);
            }
            return useValues;
          };

          this.all = function() {
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
            all: this.all
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

    this.get = function() {
      var name = function(name) {
        var control = Report.prompt.getControlByName(name);
        return new Prompt(control);
      };

      var all = function() {
        var controls = Report.getControls();
        var prompts = [];
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          prompts.push(new Prompt(control));
        }
        return prompts;
      };

      var parameterByName = function(name) {
        var parameter = Report.prompt.getParameterByName(name);

        return new Parameter(parameter);
      };

      var parameter = function(parameter) {
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

    this.sendRequest = function(request) {
      Report.sendRequest(Action[request.toUpperCase()]);
    };

    return {
      get: this.get,
      sendRequest: this.sendRequest
    };
  })();
  var Loading = function(name) {
    var loading = document.createElement("div");
    loading.classList.add("loading");
    loading.innerHTML = `
  <div class="load">Loading</div>
  <i class="load-i fas fa-circle-notch fa-lg fa-pulse"></i>
`;
    FragmentHandler.set(name, loading, true);
    return FragmentHandler.get(name);
  };
  var State = function() {
    var state = new Map();

    this.get = function(prop) {
      return state.get(prop);
    };

    this.has = function(prop) {
      return state.has(prop);
    };

    this.set = function(prop, value) {
      state.set(prop, value);
      return state.get(prop);
    };

    this.print = function() {
      var entries = state.entries();
      var _state = {};
      var entry = entries.next();
      do {
        _state[entry.value[0]] = entry.value[1];
        entry = entries.next();
      } while (!entry.done);
      return _state;
    };

    return {
      get: this.get,
      set: this.set,
      has: this.has,
      print: this.print
    };
  };
  var $scope = {};
  $scope.state = new State();
  $scope.state.set("fragments", new Map());
  $scope.state.set("highlighted", []);

  var AsyncWrapper = function(url) {
    var self = this;
    this.config = {
      endpoint: null,
      url: url,
      headers: [],
      onStateChange: null
    };

    this.endpoint = function(endpoint) {
      this.config["endpoint"] = endpoint;
      return this;
    }.bind(self);

    this.header = function(header, value) {
      this.config["headers"].push({ header: header, value: value });
      return this;
    }.bind(self);

    this.onStateChange = function(func) {
      this.config["onStateChange"] = func;
      return this;
    }.bind(self);

    this.get = function(endpoint) {
      this.config["type"] = "GET";
      this.config["endpoint"] = endpoint;
      return this;
    }.bind(self);

    this.post = function(endpoint) {
      this.config["type"] = "POST";
      this.config["endpoint"] = endpoint;
      return this;
    }.bind(self);

    this.body = function(body) {
      this.config["body"] = body;
      return this;
    }.bind(self);

    this.send = function() {
      return new Promise(function(resolve, reject) {
        var config = self.config;
        var request = new XMLHttpRequest();
        request.open(config.type, config.url + config.endpoint, true);
        // for (var i = 0; i < config.headers.length; i++) {
        //   var header = config.headers[i];
        //   request.setRequestHeader(header.header, header.value);
        // }

        var passport = Cookies.get("cam_passport");
        request.setRequestHeader("Authorization", "CAMPassport " + passport);
        // request.setRequestHeader("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.onreadystatechange = function() {
          if (config.onStateChange) config.onStateChange();
          if (this.readyState == 4) {
            resolve(this.response);
          }
        };
        if (config.type == "GET") {
          request.send();
        } else {
          request.send(config.body);
        }
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
  var FragmentHandler = (function(_fragments) {
    _fragments = _fragments || new Map();
    var Fragment = function(name, child, appendChild) {
      var self = this;
      var state = {
        childIsPresent: false,
        ref: null
      };
      this.name = name;
      this.child = child;
      this.pushChild = function() {
        if (!state.childIsPresent) {
          state.ref.appendChild(self.child);
          state.childIsPresent = true;
        }
      };
      this.transferChild = function(element, position) {
        if (state.childIsPresent) {
          element.insertAdjacentElement(position, self.child);
          state.childIsPresent = false;
        }
      };
      this.hasChild = function() {
        return state.childIsPresent;
      };

      this.delete = function() {
        $scope.state.get("fragments").delete(self.name);
      };

      !(function onInit(appendChild) {
        var fragment = document.createDocumentFragment();
        state.ref = fragment;

        if (appendChild) self.pushChild();
      })(appendChild);

      return {
        name: this.name,
        child: this.child,
        pushChild: this.pushChild,
        transferChild: this.transferChild,
        hasChild: this.hasChild,
        delete: this.delete
      };
    };

    var _addFragment = function(fragment) {
      _fragments.set(fragment.name, fragment);
    };

    this.get = function(name) {
      return _fragments.get(name);
    };

    this.set = function(name, child, appendChild) {
      var fragment = new Fragment(name, child, appendChild);
      _addFragment(fragment);
      return fragment;
    };

    return {
      get: this.get,
      set: this.set
    };
  })($scope.state.get("fragments"));
  var JbTree = (function() {
    var $jbTree = this;
    var Utilities = (function() {
      var Nodes = {
        get: function(id) {
          return $scope.state.get("current-nodes").get(id);
        },
        set: function(id, node) {
          $scope.state.get("current-nodes").set(id, node);
        },
        has: function(id) {
          return $scope.state.get("current-nodes").has(id);
        },
        all: function() {
          return $scope.state.get("current-nodes");
        }
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
    var Tree = function(config) {
      var self = this;
      var _config = {
        async: config.async,
        data: config.data,
        root: config.root,
        definedRoots: config.definedRoots,
        searchMethod: config.searchMethod, //inline or tree**
        multiSelect: config.multiSelect,
        name: config.name,
        selectionType: config.selectionType
      };
      this.state = {
        index: 0,
        loadMore: null
      };
      var _defineFragment = function(name, child, appendChild) {
        FragmentHandler.set(name, child, appendChild);
      };
      var _defineNodes = function(data, config) {
        var chunk = 2000;
        var index = 0;
        var nodes = new Map();
        var root = config.root;
        config.draw = false;

        function doChunk() {
          var cnt = chunk;
          while (cnt-- && index < data.length) {
            var node = new Node(data[index].name, data[index].id, data[index].parents, data[index.level], config);
            nodes.set(node.attributes.id, node);
            ++index;
          }
          if (index < data.length) {
            setTimeout(doChunk, 200);
          } else {
            $scope.state.set("current-nodes", nodes);
            // FragmentHandler.get(config.name).transferChild(tree, "beforeend");
            self.drawNodes();
            $scope.state.set("nodes-loaded", true);
            FragmentHandler.get("current-load").pushChild();
            FragmentHandler.get("current-fragment").transferChild($scope.state.get("tree-root"), "afterbegin");
            $scope.state.set("current-nodes", nodes);
          }
        }
        doChunk();
        return nodes;
      };
      this.drawNodes = function() {
        var curIndex = self.state.index;
        for (self.state.index; self.state.index < _config.definedRoots.length; self.state.index++) {
          if (self.state.index == curIndex + 20) {
            _drawLoadMore();
            return;
          }
          var definedNode = _config.definedRoots[self.state.index];
          var name = definedNode.attributes ? definedNode.attributes.name : definedNode.name;
          var parents = definedNode.attributes ? definedNode.attributes.parents : definedNode.parents;
          var id = definedNode.attributes ? definedNode.attributes.id : definedNode.id;
          var level = definedNode.attributes ? definedNode.attributes.level : definedNode.level;

          var node = _hasNode(id) ? Utilities.nodes.get(id) : new Node(name, id, parents, level, config);
          node.draw(_config.root);
          $scope.state.get("current-tree:roots").push(node);
        }

        if (self.state.index % 20 !== 0 && self.state.loadMore) self.state.loadMore.classList.add("disabled");
      };
      var _hasNode = function(id) {
        return Utilities.nodes.has(id);
      };

      var _drawLoadMore = function() {
        if (self.state.loadMore) return;
        var button = document.createElement("a");
        button.addEventListener("click", self.drawNodes);
        button.classList.add("pag-button");
        button.innerHTML = "Load More";
        $scope.state.get("tree-root").insertAdjacentElement("beforeend", button);
        self.state.loadMore = button;
      };

      this.setRootNodes = function(nodes) {
        _config.definedRoots = nodes;
      };

      var _clearLoadMore = function() {
        self.state.loadMore.remove();
        self.state.loadMore = null;
      };

      this.clear = function() {
        _config.root.innerHTML = "";
        self.state.index = 0;
        if (self.state.loadMore) _clearLoadMore();
      };
      !(function onInit() {
        var tree = $scope.state.get("tree-root");
        $scope.state.set(`current-tree:roots`, []);
        $scope.state.set("nodes-loaded", false);
        $scope.state.set("search-method", _config.searchMethod);
        $scope.state.set("current-tree", self);
        _defineFragment("current-fragment", _config.root, true);

        new Promise(function(resolve) {
          resolve();
        }).then(function() {
          var nodes = _defineNodes(_config.data, config);
        });
      })();

      return {
        clear: this.clear,
        state: this.state,
        drawNodes: this.drawNodes,
        setRootNodes: this.setRootNodes
      };
    };
    var Node = function(name, id, parents, level, config) {
      var self = this;
      this.attributes = {
        name: name,
        id: id,
        parents: parents,
        level: level
      };
      var _config = {
        data: config.data,
        root: config.root,
        treeFragment: config.treeFragment,
        searchChildren: config.searchChildren
      };
      this.state = {
        opened: false,
        selected: false,
        ref: null,
        children: []
      };
      this.actions = new Map();
      (function() {
        var childrenContainer = function() {
          return self.state.ref ? self.state.ref.querySelector(".children") : null;
        };

        self.actions.set("open", open);
        self.actions.set("close", close);
        self.actions.set("select", select);
        self.actions.set("deselect", deselect);
        self.actions.set("highlight", highlight);
        self.actions.set("deHighlight", deHighlight);

        function open() {
          if (!_config.searchChildren) return;
          var retreivingChildren = true;
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
          if (!_config.searchChildren) return;
          var arrow = self.state.ref.querySelector(".arrow");
          var cChild = childrenContainer();
          arrow.classList.remove("open-arrow");
          arrow.classList.remove("rotate");
          if (cChild) cChild.classList.add("hide");
          self.state["opened"] = _toggle(self.state["opened"]);
        }
        function select() {
          var selection = $scope.state.get("current-selection");
          self.state.ref.querySelector(".node").classList.add("selected");
          self.state["selected"] = _toggle(self.state["selected"]);
          selection.addSelection(self.attributes.id);
        }
        function deselect() {
          var selection = $scope.state.get("current-selection");
          self.state.ref.querySelector(".node").classList.remove("selected");
          self.state["selected"] = _toggle(self.state["selected"]);
          selection.removeSelection(self.attributes.id);
        }
        function highlight() {
          self.state.ref.querySelector(".node").classList.add("highlight");
          $scope.state.get("highlighted").push(self);
        }

        function deHighlight() {
          self.state.ref.querySelector(".node").classList.remove("highlight");

          var highlightedNodes = $scope.state.get("highlighted");
          highlightedNodes.splice(highlightedNodes.indexOf(self), 1);
        }
      })();
      this.draw = function(root) {
        root.appendChild(self.state.ref);
      };
      var children = (function() {
        this.get = function(config) {
          var chunk = 500;
          var index = 0;
          var childContainer = self.state.ref.querySelector(".children");
          var template = document.createElement("div");

          var nodeConfig = config;
          nodeConfig.root = template;
          var children;
          var loading;
          doChunk();

          function doChunk(callback) {
            var cnt = chunk;
            while (cnt-- && index < config.data.length) {
              var element = config.data[index];
              for (let i = 0; element.parents && i < element.parents.length; i++) {
                if (element.parents[i].id == self.attributes.id) {
                  var hasNode = Utilities.nodes.has(element.id);
                  var node = hasNode
                    ? Utilities.nodes.get(element.id).draw(template)
                    : (function() {
                        return new Node(element.name, element.id, element.parents, element.level, config);
                      })();
                  self.state.children.push(node);
                }
              }
              ++index;
            }
            if (index < data.length) {
              setTimeout(doChunk(), 100);
            } else {
              childContainer.insertAdjacentElement("beforeend", template);
            }
          }
        };
        return {
          get: this.get
        };
      })();
      var _toggle = function(state) {
        return state ? false : true;
      };
      var _template = function() {
        var template = document.createElement("div");
        template.setAttribute("node", self.attributes.id);
        template.innerHTML = `<div class="node">
          <span class="arrow">
            ${self.attributes.level == 0 ? '<i class="fas fa-caret-right hide"></i>' : '<i class="fas fa-caret-right 2x"></i>'}
          </span>
          <span class="tree-node">${self.attributes.name}</span>
        </div> 
        <div class="children"></div>`;

        template.querySelector(".node").addEventListener("click", function(e) {
          var state = self.state["selected"];
          var action = state ? "deselect" : "select";
          _execute(action);
          e.stopPropagation();
        });

        template.querySelector(".arrow").addEventListener("click", function(e) {
          var state = self.state["opened"];
          var action = state ? "close" : "open";
          _execute(action);
          e.stopPropagation();
        });

        return template;
      };

      var _execute = function(action) {
        self.actions.get(action)();
        if (self.state[action]) self.state[action](self);
      };

      !(function onInit() {
        var node = _template();
        self.state.ref = node;
        if (_config.draw) self.draw(_config.root);
      })();

      return {
        state: this.state,
        attributes: this.attributes,
        actions: this.actions,
        draw: this.draw
      };
    };
    var Subsets = function(config) {
      var _state = {
        element: null,
        hidden: true
      };
      var _config = {
        root: config.root
      };
      var _removeActiveFromSubsets = function() {
        var subsets = $scope.state.get("subsets");
        var values = subsets.values();
        var value = values.next();
        $scope.state.get("root").querySelectorAll(".subset-title").innerHTML = "";
        if (!value) return;
        while (value.value) {
          value.value.removeActive();
          value = values.next();
        }
      };
      var Subset = function(name, root) {
        var self = this;
        this.name = name;
        var _state = {
          root: root,
          template: null,
          elements: []
        };

        var _template = function() {
          var template = document.createElement("div");
          template.classList.add("subset-label");
          template.innerHTML = self.name;

          template.addEventListener("click", self.active);

          return template;
        };

        var _getSubset = function() {
          var request = new AsyncWrapper(server);
          request.get().endpoint(`Dimensions('${dimension}')/Hierarchies('${dimension}')/Subsets('${self.name}')?$expand=Elements`);
          return request.send().then(function(results) {
            var rootElements = [];
            results = JSON.parse(results);
            for (var i = 0; i < results.Elements.length; i++) {
              var element = results.Elements[i];
              var name = element.Attributes[alias];
              rootElements.push({ name: name, id: name, parents: null });
            }
            return rootElements;
          });
        };

        var _drawTree = function() {
          if ($scope.state.get("current-tree")) {
            draw();
          } else {
            setTimeout(_drawTree, 500);
          }

          function draw() {
            var _config = Object.assign({}, config);
            _config.name = self.name;
            _config.root = $scope.state.get("root").querySelector(".tree");
            FragmentHandler.get("current-load").transferChild($scope.state.get("tree-root"), "beforeend");
            $scope.state.get("current-tree").clear();
            $scope.state.get("scroller").reset();
            if (self.name == "Subset All") {
              _state.elements = $scope.state.get("initial-data");
              _config.data = $scope.state.get("initial-data");
              _config.definedRoots = $scope.state.get("initial-roots");
              _config.searchMethod = "inlineSearch";
              _config.searchChildren = true;
              new Tree(_config);
            }
            if (_state.elements.length == 0) {
              _getSubset().then(function(results) {
                _config.definedRoots = results;
                _config.data = results;
                _config.searchChildren = false;
                _config.searchMethod = "treeSearch";
                new Tree(_config);
              });
            }
          }
        };

        this.active = function() {
          self.setTitle();
          _drawTree();
        };

        this.setTitle = function() {
          _removeActiveFromSubsets();
          _state.template.classList.add("subset-active");
          $scope.state.get("root").querySelector(".subset-title").innerHTML = self.name;
        };

        this.removeActive = function() {
          _state.template.classList.remove("subset-active");
        };

        !(function onInit() {
          _state.template = _template();
          _state.root.appendChild(_state.template);
        })();

        return {
          name: this.name,
          active: this.active,
          removeActive: this.removeActive,
          setTitle: this.setTitle
        };
      };
      var _getSubsets = function(dropdown) {
        var request = new AsyncWrapper(server);
        $scope.state.set("subsets-loaded", false);
        request
          .get()
          .endpoint(`Dimensions('${dimension}')/Hierarchies('${dimension}')/Subsets`)
          .send()
          .then(function(subsets) {
            var allSubsets = $scope.state.get("subsets");
            subsets = JSON.parse(subsets);
            var rootSubset = new Subset("Subset All", dropdown);
            allSubsets.set(rootSubset.name, rootSubset);
            for (var i = 0; i < subsets.value.length; i++) {
              var subset = new Subset(subsets.value[i].Name, dropdown);
              allSubsets.set(subsets.value[i].Name, subset);
            }
          })
          .then(function() {
            $scope.state.set("subsets-loaded", true);
            FragmentHandler.get("subset-loading").pushChild();
          });
      };
      var _template = function() {
        var template = document.createElement("div");
        template.classList.add("subsets");
        template.innerHTML = `
        <div class=\"subset-title\"></div>
        <i class=\"align-middle fas fa-caret-down\"></i>
          `;
        return template;
      };
      var _dropdownContainer = function() {
        var template = document.createElement("div");
        template.classList.add("subset-container");
        template.classList.add("hide");

        return template;
      };

      !(function onInit() {
        $scope.state.set("subsets", new Map());
        var subsets = _template();
        var loading = Loading("subset-loading");
        var dropdown = _dropdownContainer();
        _state.element = subsets;
        _config.root.insertAdjacentElement("afterbegin", subsets);
        _state.element.insertAdjacentElement("beforeend", dropdown);
        loading.transferChild(subsets, "afterbegin");
        setTimeout(function() {
          _getSubsets(dropdown);
        }, 0);

        subsets.addEventListener("click", function(e) {
          e.stopPropagation();
          if (_state.hidden) dropdown.classList.remove("hide");
          else dropdown.classList.add("hide");
          _state.hidden = !_state.hidden;
        });

        $scope.state.get("root").addEventListener("click", function() {
          dropdown.classList.add("hide");
          _state.hidden = true;
        });
      })();
    };
    var Search = function(config) {
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
        results: [],
        index: 0
      };
      var _validTerm = function(term) {
        return !(term == "" || term == undefined || term == null);
      };
      var _drawInput = function(root) {
        var input = document.createElement("div");
        input.classList.add("search");
        input.innerHTML = `
            <input type="text" dimension="${dimension}" class="search-input">
            <div class="submit">
                <a class="btn">
                    <i class="fas fa-caret-right"></i>
                </a>
            </div>`;
        root.insertAdjacentElement("afterbegin", input);
        return input.querySelector(".search");
      };
      var _drawSearchContainer = function(root) {
        var container = document.createElement("div");
        container.classList = "search-root";
        root.insertAdjacentElement("beforeend", container);
        return container;
      };
      var _deHighlightAll = function() {
        var highlighted = $scope.state.get("highlighted");
        while (highlighted.length !== 0) {
          highlighted[0].actions.get("deHighlight")();
        }
      };

      var _closeRoots = function() {
        var roots = $scope.state.get("current-tree:roots");
        for (var i = 0; i < roots.length; i++) {
          roots[i].actions.get("close")();
        }
      };

      this.drawResults = function() {
        var curIndex = self.state.index;

        for (self.state.index; self.state.index < self.state.results.length; self.state.index++) {
          if (self.state.index == curIndex + 50) return;
          var parents = _getParents(self.state.results[self.state.index]);
          _displayChildren(parents);
          self.state.results[self.state.index].actions.get("highlight")();
        }
      };

      var searchMethod = {
        inlineSearch: function(term) {
          var scroller = $scope.state.get("scroller");
          new Promise(function(resolve) {
            _deHighlightAll();
            _closeRoots();
            scroller.reset();
            self.state.index = 0;
            _clearSearchFragment();
            if (!_validTerm(term)) {
              return;
            }
            FragmentHandler.get("current-fragment").pushChild();
            FragmentHandler.get("current-load").transferChild($scope.state.get("tree-root"), "beforeend");

            setTimeout(function() {
              if ($scope.state.get("nodes-loaded")) {
                self.state.results = _searchResults(Utilities.nodes.all(), term);
                if (self.state.results.length == 0) _noResults();
                scroller.updateNodes();
                self.drawResults();
                FragmentHandler.get("current-fragment").transferChild($scope.state.get("tree-root"), "afterbegin");
                FragmentHandler.get("current-load").pushChild();
                resolve();
              } else {
                setTimeout(function() {
                  searchMethod["inlineSearch"](term);
                }, 300);
              }
            }, 0);
          }).then(function() {
            scroller.next();
          });
        },
        treeSearch: function(term) {
          var scroller = $scope.state.get("scroller");
          self.state.results = _searchResults(Utilities.nodes.all(), term);
          var treeRoot = $scope.state.get("tree-root");
          var tree = $scope.state.get("current-tree");

          self.state.searchTreeFragment.pushChild();
          _clearSearchFragment();

          if (self.state.results.length == 0) {
            _noResults();
            self.state.treeFragment.transferChild(treeRoot, "afterbegin");
            return;
          }

          _config.treeFragment.pushChild();
          tree.clear();
          tree.setRootNodes(self.state.results);
          tree.drawNodes();

          self.state.treeFragment.transferChild(treeRoot, "afterbegin");
        }
      };
      var _clearSearchFragment = function() {
        self.state.searchTreeFragment.child.innerHTML = "";
        $scope.state
          .get("root")
          .querySelector(`[dimension="${dimension}"]`)
          .classList.remove("no-results");
      };
      var _noResults = function(element) {
        if (self.state.results.length == 0) {
          $scope.state
            .get("root")
            .querySelector(`[dimension="${dimension}"]`)
            .classList.add("no-results");
          $scope.state.get("scroller").noResults();
        }
      };

      var _searchResults = function(map, term) {
        var results = [];
        var values = map.values();
        var value = values.next();
        while (value.done !== true) {
          if (value.value.attributes.id.toLowerCase().includes(term.toLowerCase())) {
            results.push(value.value);
          }
          value = values.next();
        }
        $scope.state.set("search-results", results);
        return results;
      };

      var _getParents = function(node) {
        var parents = [];
        while (node.attributes.parents !== null) {
          var parent = Utilities.nodes.get(node.attributes.parents[0].id);
          parents.push(parent);
          node = parent;
        }
        return parents;
      };

      var _displayChildren = function(store) {
        if (!store || (store && store.length == 0)) return;
        for (let i = 0; i < store.length; i++) {
          var parent = Utilities.nodes.get(store[i].attributes.id);
          if (!parent) return;
          parent.actions.get("open")();
        }
      };

      !(function onInit() {
        var searchtree = document.createElement("div");
        searchtree.classList.add(".search-tree");
        FragmentHandler.set("search-tree", searchtree, true);
        self.state.searchTreeFragment = FragmentHandler.set("search-fragment", searchtree);
        _drawInput(_config.root);
        var container = _drawSearchContainer(_config.root);
        var button = _config.root.querySelector(".submit");
        var search = $scope.state.get("root").querySelector(`[dimension="${dimension}"]`);

        self.state.searchTreeFragment = FragmentHandler.set("search-tree", container, true);
        _config.root = container;
        button.addEventListener("click", function(e) {
          searchMethod[$scope.state.get("search-method")](search.value);
        });
        button.addEventListener("keypress", function(e) {
          var key = e.which || e.keycode;
          if (key === 13) {
            searchMethod[$scope.state.get("search-method")](search.value);
          }
        });
      })();

      return {
        state: this.state,
        drawResults: this.drawResults
      };
    };
    var SearchScrollIterator = function(root, scrollComponent) {
      var self = this;
      this.state = {
        index: -1,
        nodes: $scope.state.get("search-results"),
        currentNode: null,
        scrollComponent: scrollComponent,
        searchComponent: $scope.state.get(`${dimension}-search`)
      };

      var _components = {
        counter: null,
        selection: null
      };

      var _updateCounter = function() {
        if (self.state.nodes.length == 0) _components.counter.innerHTML = "0/0";
        _components.counter.innerHTML = `${self.state.index + 1}/${self.state.nodes.length}`;
      };

      var _scrollBack = function() {
        if (self.state.index == 0) return;
        self.state.currentNode = self.state.nodes[--self.state.index];
        _update(self.state.currentNode.state.ref.offsetTop);
      };

      var _scrollForward = function() {
        if (self.state.index + 1 == self.state.nodes.length) return;
        if (self.state.index == self.state.searchComponent.state.index - 2) {
          $scope.state.set("searching", true);
          FragmentHandler.get("current-fragment").pushChild();
          FragmentHandler.get("current-load").transferChild($scope.state.get("tree-root"), "beforeend");
          setTimeout(function() {
            self.state.searchComponent.drawResults();
            FragmentHandler.get("current-fragment").transferChild($scope.state.get("tree-root"), "afterbegin");
            FragmentHandler.get("current-load").pushChild();
            $scope.state.set("searching", false);
          }, 0);
        }

        run();

        function run() {
          if (!$scope.state.get("searching")) {
            self.state.currentNode = self.state.nodes[++self.state.index];
            if (self.state.index !== self.state.nodes.length) {
              _update(self.state.currentNode.state.ref.offsetTop);
            }
          } else {
            setTimeout(run, 100);
          }
        }
      };

      var _update = function(position) {
        _components.selection = self.state.currentNode.attributes.name;
        _updateCounter();
        self.state.scrollComponent.scrollTop = position;
      };

      this.reset = function() {
        self.state.index = -1;
        _components.counter.innerHTML = "";
      };

      this.updateNodes = function() {
        self.state.nodes = $scope.state.get("search-results");
      };

      this.noResults = function() {
        _components.counter.innerHTML = "0/0";
      };

      !(function onInit(root) {
        var template = document.createElement("div");
        template.classList.add("scroller");
        template.innerHTML = `
          <div class="scroll-selection-name"></div>
            <span class="counter"></span>
            <div class ="scroll-selector left-scroll">
              <i class="fas fa-angle-up scroll-arrow"></i>
            </div>
            <div class="scroll-selector right-scroll">
            <i class="fas fa-angle-down scroll-arrow"></i>
          </div>
        `;
        _components.counter = template.querySelector(".counter");
        template.querySelector(".left-scroll").addEventListener("click", _scrollBack);
        template.querySelector(".right-scroll").addEventListener("click", _scrollForward);
        root.insertAdjacentElement("beforeend", template);
      })(root);

      return {
        reset: this.reset,
        noResults: this.noResults,
        state: this.state,
        next: _scrollForward,
        back: _scrollBack,
        updateNodes: this.updateNodes
      };
    };
    var Selection = function(config) {
      var self = this;
      self.state = {
        values: null,
        selections: new Map(),
        addingValues: false,
        removingValues: false,
        drawTool: null
      };
      var _config = {
        root: config.root,
        selectionType: config.selectionType
      };
      var _template = function() {
        var template = document.createElement("div");
        template.classList.add("node");
        return template;
      };
      this.removeSelection = function(id) {
        var selection = self.state.selections.get(id);
        if (selection && selection.drawn) self.state.drawTool.remove(id);
        if (selection) _onDeselect(Utilities.nodes.get(id));
        if (!self.state.removingValues) _setValues();
      };
      this.addSelection = function(id) {
        _addSelectionToMap(id);
        _addSelectionToPrompt(Utilities.nodes.get(id));
      };

      var _addSelectionToMap = function(id) {
        var selection = self.state.selections.get(id);
        var button = self.state.element.querySelector(".pag-button");

        if (!selection) {
          self.state.selections.set(id, { element: _template(), drawn: false, node: Utilities.nodes.get(id) });
          selection = self.state.selections.get(id);
          if (button) button.classList.remove("disabled");
        }
        if (!selection.drawn && !self.state.drawTool.atThreshold()) {
          self.state.drawTool.draw(id);
          selection.drawn = true;
        }
      };
      var _addSelectionToPrompt = function(node) {
        var munDimension = dimension.replace(" ", "");
        var use = `[Reporting General Ledger].[${munDimension}].[${munDimension}]->:[TM].[${munDimension}].[${munDimension}].[@MEMBER].[${node.attributes.id}]`;
        var display = node.attributes.name;
        var selections = $scope.state.get("selections");
        selections.set(node.attributes.id, { display: display, use: use });
        $scope.state.get("prompt").Value.add(display, use);
      };
      var _onDeselect = function(node) {
        var selections = $scope.state.get("selections");
        selections.delete(node.attributes.id);
      };
      var _setValues = function() {
        var prompt = $scope.state.get("prompt");
        var values = Array.from($scope.state.get("selections"), function(element) {
          return element[1];
        });
        if (!prompt) return;
        prompt.Value.set(values);
      };
      var _getInitialSelections = function() {
        if (!PromptAPI) return;
        var prompt = $scope.state.get("prompt");
        var selections = prompt.Value.get.all();
        console.log(selections, typeof selections);
        if (selections.length == 0) return;
        if (typeof selections === "object") {
          console.log(selections, "object", !!selections.display);
          _addSelectionToMap(selections.display);
        } else {
          selections.map(function(selection) {
            _addSelectionToMap(selection.display);
          });
        }
      };
      var _deselectAll = function() {
        if (self.state.removingValues || self.state.addingValues) return;
        self.state.removingValues = true;
        var chunk = 2000;
        var values = self.state.selections.values();
        var value = values.next();
        doChunk();
        function doChunk() {
          var cnt = chunk;
          while (cnt-- && value.value) {
            value.value.node.actions.get("deselect")();
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
      var _selectAll = function() {
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
      var drawTool = function() {
        var _state = {
          threshold: 20,
          index: 0,
          count: 20,
          element: null
        };
        var _draw = function(id) {
          if (_atThreshold()) return;
          var selection = self.state.selections.get(id);
          var element = selection.element;
          $scope.state
            .get("root")
            .querySelector(".nodes")
            .insertAdjacentElement("beforeend", element);
          element.innerHTML = `
          <div class="minus"><i class="fas fa-minus-square"></i></div>
          <div class="minus-label">${id}</div>
        `;
          element.querySelector(".minus").addEventListener("click", function() {
            var node = Utilities.nodes.get(id);
            node.actions.get("deselect")();
            _setValues();
          });
          _state.index++;
          return element;
        };
        var _drawLoadMore = function() {
          if (self.state.element.querySelector(".pag-button")) return;
          var button = document.createElement("a");
          button.addEventListener("click", _drawToThreshold);
          button.classList.add("pag-button");
          button.innerHTML = "Load More";
          self.state.element.insertAdjacentElement("beforeend", button);
        };
        var _clearLoadMore = function() {
          var button = self.state.element.querySelector(".pag-button");
          if (button) button.remove();
        };
        var _drawToThreshold = function() {
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
        var _atThreshold = function() {
          var atThreshold = false;
          if (_state.count == _state.index) {
            atThreshold = true;
            _drawLoadMore();
          }

          return atThreshold;
        };
        this.draw = function(id) {
          _draw(id);
        };
        this.remove = function(id) {
          var selection = self.state.selections.get(id);
          selection.element.remove();
          selection.drawn = false;
          _state.index--;
          if (_state.count > _state.threshold) _state.count--;
          if (!_atThreshold()) _clearLoadMore();
        };
        this.clear = function() {
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

      !(function onInit() {
        $scope.state.set("selections", new Map());
        self.state.drawTool = new drawTool();

        var selection = document.createElement("div");
        self.state.element = selection;
        selection.classList.add("content");
        selection.classList.add("bi-selection");
        selection.innerHTML = '<div class="nodes"></div>';
        _config.root.insertAdjacentElement("beforeend", selection);
        $scope.state.set("current-selection", self);

        var bContainer = document.createElement("div");
        bContainer.classList.add("bi-buttons");
        _config.root.insertAdjacentElement("beforeend", bContainer);
        var button = document.createElement("div");

        button.classList.add("select-btn");
        button.addEventListener("click", _selectAll);
        button.innerHTML = "Select All";
        bContainer.insertAdjacentElement("beforeend", button);

        button = document.createElement("div");
        button.classList.add("deselect-btn");
        button.innerHTML = "Deselect All";
        button.addEventListener("click", _deselectAll);
        bContainer.insertAdjacentElement("beforeend", button);

        self.state.values = _getInitialSelections() || [];
        var values = self.state.values;

        for (var i = 0; i < values.length; i++) {
          var node = Utilities.nodes.get(values[i].display);
          if (node) node.actions.get("select")();
        }
      })();

      return {
        state: this.state,
        removeSelection: this.removeSelection,
        addSelection: this.addSelection
      };
    };

    var Toolbar = function(root) {
      var _state = {
        ref: null,
        sections: []
      };

      var _template = function() {
        var template = document.createElement("div");
        template.classList.add("bi-toolbar");

        return template;
      };

      this.addSection = function(name, element) {
        var section = document.createElement("div");
        section.classList.add("toolbar-section");
        section.insertAdjacentElement("beforeend", element);

        _state.ref.insertAdjacentElement("beforeend", section);
        _state.sections.push({ name: name, ref: section });
      };

      !(function onInit() {
        var toolbar = _template();
        _state.ref = toolbar;
        root.insertAdjacentElement("afterbegin", toolbar);
      })();

      return {
        addSection: this.addSection
      };
    };
    this.state = new State();
    this.init = function(config) {
      $scope.state.set("root", config.root);
      var prompt = PromptAPI ? PromptAPI.get("parameter", parameterCodes[dimension]) : undefined;
      $scope.state.set("prompt", prompt);
      window._STATE_ = $scope.state;
      window._PromptAPI_ = PromptAPI;
      var loading = Loading("current-load");
      var selectionTreeContainer = document.createElement("div");
      selectionTreeContainer.classList.add("sel-tree-container");
      config.root.insertAdjacentElement("beforeend", selectionTreeContainer);

      var toolbar = new Toolbar(config.root);

      var treeRoot = document.createElement("div");
      treeRoot.classList.add("tree-root");
      $scope.state.set("tree-root", treeRoot);
      treeRoot.innerHTML = '<div class="tree"></div>';

      var searchRoot = document.createElement("div");
      searchRoot.classList.add("search-root");
      $scope.state.set("search-root", searchRoot);

      var selectRoot = document.createElement("div");
      selectRoot.classList.add("select-root");
      $scope.state.set("select-root", selectRoot);

      var subsetRoot = document.createElement("div");
      subsetRoot.classList.add("subset-root");
      $scope.state.set("subset-root", subsetRoot);

      var title = document.createElement("div");
      title.innerHTML = `${dimension}`;
      toolbar.addSection("title", title);
      toolbar.addSection("subsets", subsetRoot);
      toolbar.addSection("search", searchRoot);

      selectionTreeContainer.insertAdjacentElement("beforeend", treeRoot);
      var treeConfig = Object.assign({}, config);
      treeConfig.root = treeRoot.querySelector(".tree");
      treeConfig.searchChildren = true;
      loading.transferChild(treeRoot, "beforeend");

      var tree = new Tree(treeConfig);

      nodesAreLoading();

      function nodesAreLoading() {
        if ($scope.state.get("nodes-loaded")) {
          // config.root.insertAdjacentElement("afterbegin", searchRoot);
          var searchConfig = Object.assign({}, config);
          searchConfig.treeFragment = FragmentHandler.get("current-fragment");
          searchConfig.root = searchRoot;
          var search = new Search(searchConfig);
          $scope.state.set(`${dimension}-search`, search);

          var scroller = new SearchScrollIterator(searchRoot, treeRoot);
          $scope.state.set("scroller", scroller);

          selectionTreeContainer.insertAdjacentElement("beforeend", selectRoot);
          var selectionConfig = Object.assign({}, config);
          selectionConfig.root = selectRoot;
          new Selection(selectionConfig);

          // config.root.insertAdjacentElement("afterbegin", subsetRoot);
          var subsetsConfig = Object.assign({}, config);
          subsetsConfig.root = subsetRoot;
          new Subsets(subsetsConfig);
          subsetsLoaded();

          $scope.state.set("initial-data", config.data);
          $scope.state.set("initial-roots", config.definedRoots);
        } else {
          setTimeout(nodesAreLoading, 500);
        }
      }
      function subsetsLoaded() {
        if ($scope.state.get("subsets-loaded")) {
          $scope.state
            .get("subsets")
            .get("Subset All")
            .setTitle();
        } else {
          setTimeout(subsetsLoaded, 500);
        }
      }
    };
    return {
      init: this.init,
      state: this.state
    };
  })();

  function start() {
    JbTree.init({
      data: data,
      root: document.getElementById("ACCOUNT"),
      searchMethod: "inlineSearch",
      subsets: true,
      definedRoots: roots,
      name: "tree-root",
      selectionType: "multi"
    });
  }
  if (ENVIRONMENT === "TEST") {
    data = [
      { name: "Parent 1", id: "Parent 1", parents: null, level: 10 },
      {
        name: "Parent 1 - FY 2017",
        id: "Parent 1 - FY 2017",
        parents: null,
        level: 0
      },
      {
        name: "Alternative Parent",
        id: "Alternative Parent",
        parents: null,
        level: 10
      },
      {
        name: "Child 1",
        id: "Child 1",
        parents: [{ name: "Parent 1", id: "Parent 1" }, { name: "Alternative Parent", id: "Alternative Parent" }],
        level: 1
      },
      {
        name: "Grand Child 1",
        id: "Grand Child 1",
        parents: [{ name: "Child 1", id: "Child 1" }],
        level: 0
      },
      {
        name: "Grand Child 2",
        id: "Grand Child 2",
        parents: [{ name: "Child 1", id: "Child 1" }],
        level: 0
      }
    ];
    roots = [
      { name: "Parent 1", id: "Parent 1", parents: null, level: 10 },
      {
        name: "Parent 1 - FY 2017",
        id: "Parent 1 - FY 2017",
        parents: null,
        level: 0
      },
      {
        name: "Alternative Parent",
        id: "Alternative Parent",
        parents: null,
        level: 10
      }
    ];

    start();
  }
  if (ENVIRONMENT === "TM1-DEV" || ENVIRONMENT == "BI-DEV") {
    var rootsRequest = new AsyncWrapper(server);
    var elementsRequest = new AsyncWrapper(server);

    rootsRequest
      .post()
      .endpoint("ExecuteMDXSetExpression?$expand=Tuples($expand=Members($expand=Parent($select=Name,UniqueName)))")
      //.header("Content-Type", "application/json; charset=utf-8")
      // .header("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==")
      .body(
        JSON.stringify({
          MDX: `{{Filter({TM1SubsetAll([${dimension}])}, [${dimension}].CurrentMember.Parent.Name="")}}`
        })
      );

    elementsRequest.get().endpoint(`Dimensions('${dimension}')/Hierarchies('${dimension}')/Elements?$expand=Parents`);
    // .header("Authorization", "CAMNamespace MTAwMDMyNjI3OjdETGNnY2IxMjMhITpKYWJpbF9BRA==");
    // .send().then(function (results) {
    // })

    Promise.all([rootsRequest.send(), elementsRequest.send()])
      .then(function(results) {
        var rootData = JSON.parse(results[0]);
        var elements = JSON.parse(results[1]);

        for (let i = 0; i < rootData.Tuples.length; i++) {
          var root = rootData.Tuples[i];

          data.push({
            name: root.Members[0].Attributes[alias],
            id: root.Members[0].Attributes[alias],
            parents: null,
            level: root.Members[0].Level
          });
          roots.push({
            name: root.Members[0].Attributes[alias],
            id: root.Members[0].Attributes[alias],
            parents: null,
            level: root.Members[0].Level
          });
        }
        for (let i = 0; i < elements.value.length; i++) {
          var value = elements.value[i];
          var pArray = [];
          for (let j = 0; j < value.Parents.length; j++) {
            pArray.push({ id: value.Parents[j].Attributes[alias] });
          }
          data.push({
            name: value.Attributes[alias],
            id: value.Attributes[alias],
            parents: pArray.length == 0 ? null : pArray,
            level: value.Level
          });
        }
      })
      .then(function() {
        window["_TREE_"] = start();
      });
  }
});
