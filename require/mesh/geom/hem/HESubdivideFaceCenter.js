define([
  'mesh/geom/hem/HEMesh',
  'mesh/geom/hem/HEVertex',
  'mesh/geom/hem/HEEdge',
  'mesh/geom/hem/HEFace',
  'mesh/geom/Vec3'
  ],
  function(HEMesh, HEVertex, HEEdge, HEFace, Vec3) {

  function HESubdivideFaceCenter() {
  }

  HEMesh.prototype.subdivideFaceCenter = function() {
    var numFaces = this.faces.length;
    var edgesToSelect = [];

    for(var i=0; i<numFaces; i++) {
      var face = this.faces[i];
      var newEdge = this.splitFaceAtPoint(face, face.getCenter());
      edgesToSelect.push(newEdge);
    }

    this.clearSelection();
    edgesToSelect.forEach(function(edge) {
      edge.vert.selected = true;
    })

    return this;
  };

  return HESubdivideFaceCenter;
});
