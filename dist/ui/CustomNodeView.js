'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Standard className for selected node.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_NodeViewProps', {
  value: require('prop-types').shape({
    editorView: require('prop-types').any.isRequired,
    getPos: require('prop-types').func.isRequired,
    node: require('prop-types').any.isRequired,
    selected: require('prop-types').bool.isRequired
  })
}); // @xflow

var SELECTED_NODE_CLASS_NAME = 'ProseMirror-selectednode';

var mountedViews = new _set2.default();
var pendingViews = new _set2.default();

function onMutation(mutations, observer) {
  var root = document.body;
  if (!root) {
    return;
  }

  var mountingViews = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pendingViews), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var view = _step.value;

      var el = view.dom;
      if (root.contains(el)) {
        pendingViews.delete(view);
        mountingViews.push(view);
        view.__renderReactComponent();
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(mountedViews), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _view = _step2.value;

      var el = _view.dom;
      if (!root.contains(el)) {
        mountedViews.delete(el);
        _reactDom2.default.unmountComponentAtNode(el);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  mountingViews.forEach(function (view) {
    return mountedViews.add(view);
  });

  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

var mutationObserver = new MutationObserver(onMutation);

// This implements the `NodeView` interface and renders a Node with a react
// Component.
// https://prosemirror.net/docs/ref/#view.NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429

var CustomNodeView = function () {
  function CustomNodeView(node, editorView, getPos) {
    (0, _classCallCheck3.default)(this, CustomNodeView);


    this.props = {
      editorView: editorView,
      getPos: getPos,
      node: node,
      selected: false
    };

    pendingViews.add(this);

    // The editor will use this as the node's DOM representation
    var dom = this.createDOMElement();
    this.dom = dom;

    if (pendingViews.size === 1) {
      mutationObserver.observe(document, { childList: true, subtree: true });
    }
  }

  (0, _createClass3.default)(CustomNodeView, [{
    key: 'update',
    value: function update(node, decorations) {
      this.props = (0, _extends3.default)({}, this.props, {
        node: node
      });
      this.__renderReactComponent();
      return true;
    }
  }, {
    key: 'stopEvent',
    value: function stopEvent() {
      return false;
    }

    // Mark this node as being the selected node.

  }, {
    key: 'selectNode',
    value: function selectNode() {
      this.dom.classList.add(SELECTED_NODE_CLASS_NAME);
      this.props = (0, _extends3.default)({}, this.props, {
        selected: true
      });
      this.__renderReactComponent();
    }

    // Remove selected node marking from this node.

  }, {
    key: 'deselectNode',
    value: function deselectNode() {
      this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);
      this.props = (0, _extends3.default)({}, this.props, {
        selected: false
      });
      this.__renderReactComponent();
    }

    // This should be overwrite by subclass.

  }, {
    key: 'createDOMElement',
    value: function createDOMElement() {
      // The editor will use this as the node's DOM representation.
      // return document.createElement('span');
      throw new Error('not implemented');
    }

    // This should be overwrite by subclass.

  }, {
    key: 'renderReactComponent',
    value: function renderReactComponent() {
      // return <CustomNodeViewComponent {...this.props} />;
      throw new Error('not implemented');
    }
  }, {
    key: '__renderReactComponent',
    value: function __renderReactComponent() {
      _reactDom2.default.render(this.renderReactComponent(), this.dom);
    }
  }]);
  return CustomNodeView;
}();

exports.default = CustomNodeView;