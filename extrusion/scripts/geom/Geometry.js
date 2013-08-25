// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Color, Edge, Face3, Face4, Geometry, Vec2, Vec3, Vec4;

  Vec2 = require('pex/geom/Vec2');
  Vec3 = require('pex/geom/Vec3');
  Vec4 = require('pex/geom/Vec4');
  Edge = require('pex/geom/Edge');
  Face3 = require('pex/geom/Face3');
  Face4 = require('pex/geom/Face4');
  Color = require('pex/color/Color');
  return Geometry = (function() {
    function Geometry(_arg) {
      var colors, edges, faces, indices, normals, tangents, texCoords, vertices;

      vertices = _arg.vertices, normals = _arg.normals, texCoords = _arg.texCoords, tangents = _arg.tangents, colors = _arg.colors, indices = _arg.indices, edges = _arg.edges, faces = _arg.faces;
      if (vertices == null) {
        vertices = true;
      }
      if (normals == null) {
        normals = false;
      }
      if (texCoords == null) {
        texCoords = false;
      }
      if (tangents == null) {
        tangents = false;
      }
      if (colors == null) {
        colors = false;
      }
      if (indices == null) {
        indices = false;
      }
      if (edges == null) {
        edges = false;
      }
      if (faces == null) {
        faces = true;
      }
      this.attribs = {};
      if (vertices) {
        this.addAttrib('vertices', 'position', vertices, false);
      }
      if (normals) {
        this.addAttrib('normals', 'normal', normals, false);
      }
      if (texCoords) {
        this.addAttrib('texCoords', 'texCoord', texCoords, false);
      }
      if (tangents) {
        this.addAttrib('tangents', 'tangent', tangents, false);
      }
      if (colors) {
        this.addAttrib('colors', 'color', colors, false);
      }
      if (indices) {
        this.addIndices(indices);
      }
      if (edges) {
        this.addEdges(edges);
      }
      if (faces) {
        this.addFaces(faces);
      }
    }

    Geometry.prototype.addAttrib = function(propertyName, attributeName, data, dynamic) {
      if (data == null) {
        data = null;
      }
      if (dynamic == null) {
        dynamic = false;
      }
      this[propertyName] = data && data.length ? data : [];
      this[propertyName].name = attributeName;
      this[propertyName].dirty = true;
      this[propertyName].dynamic = dynamic;
      this.attribs[propertyName] = this[propertyName];
      return this;
    };

    Geometry.prototype.addFaces = function(data, dynamic) {
      if (data == null) {
        data = null;
      }
      if (dynamic == null) {
        dynamic = false;
      }
      this.faces = data && data.length ? data : [];
      this.faces.dirty = true;
      this.faces.dynamic = false;
      return this;
    };

    Geometry.prototype.addEdges = function(data, dynamic) {
      if (data == null) {
        data = null;
      }
      if (dynamic == null) {
        dynamic = false;
      }
      this.edges = data && data.length ? data : [];
      this.edges.dirty = true;
      this.edges.dynamic = false;
      return this;
    };

    Geometry.prototype.addIndices = function(data, dynamic) {
      if (data == null) {
        data = null;
      }
      if (dynamic == null) {
        dynamic = false;
      }
      this.indices = data && data.length ? data : [];
      this.indices.dirty = true;
      this.indices.dynamic = false;
      return this;
    };

    Geometry.prototype.isDirty = function(attibs) {
      var attrib, attribAlias, dirty, _ref;

      dirty = false;
      dirty || (dirty = this.faces && this.faces.dirty);
      dirty || (dirty = this.edges && this.edges.dirty);
      _ref = this.attribs;
      for (attribAlias in _ref) {
        attrib = _ref[attribAlias];
        dirty || (dirty = attrib.dirty);
      }
      return dirty;
    };

    Geometry.prototype.addEdge = function(a, b) {
      var ab, ba;

      if (!this.edges) {
        this.addEdges();
      }
      if (!this.edgeHash) {
        this.edgeHash = [];
      }
      ab = a + '_' + b;
      ba = b + '_' + a;
      if (!this.edgeHash[ab] && !this.edgeHash[ba]) {
        this.edges.push(new Edge(a, b));
        return this.edgeHash[ab] = this.edgeHash[ba] = true;
      }
    };

    Geometry.prototype.computeEdges = function() {
      var a, b, c, face, i, _i, _j, _len, _ref, _ref1, _results, _results1;

      if (this.edges) {
        this.edges.length = 0;
      } else {
        this.edges = [];
      }
      if (this.faces && this.faces.length) {
        _ref = this.faces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          face = _ref[_i];
          if (face instanceof Face3) {
            this.addEdge(face.a, face.b);
            this.addEdge(face.b, face.c);
            this.addEdge(face.c, face.a);
          }
          if (face instanceof Face4) {
            this.addEdge(face.a, face.b);
            this.addEdge(face.b, face.c);
            this.addEdge(face.c, face.d);
            _results.push(this.addEdge(face.d, face.a));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        _results1 = [];
        for (i = _j = 0, _ref1 = this.vertices.length - 1; _j <= _ref1; i = _j += 3) {
          a = i;
          b = i + 1;
          c = i + 2;
          this.addEdge(a, b);
          this.addEdge(b, c);
          _results1.push(this.addEdge(c, a));
        }
        return _results1;
      }
    };

    return Geometry;

  })();
});