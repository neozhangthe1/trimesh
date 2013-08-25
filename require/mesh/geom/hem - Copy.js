define(
  [
    'mesh/geom/hem/HEMesh',
    'mesh/geom/hem/HEMarking',
    'mesh/geom/hem/HEGeometryConverter',
    'mesh/geom/hem/HEExtrude',
    'mesh/geom/hem/HECatmullClark',
    'mesh/geom/hem/HETriangulate',
    'mesh/geom/hem/HESubdivideTriangles',
    'mesh/geom/hem/HESubdivideFaceCenter',
    'mesh/geom/hem/HEPull',
    'mesh/geom/hem/HEDooSabin',
  ],
  function(HEMesh, HEMarking, HEGeometryConverter, HEExtrude, HECatmullClark, HETriangulate,
    HESubdivideTriangles, HESubdivideFaceCenter, HEPull, HEDooSabin) {
    return function() {
      return new HEMesh();
    }
  }
);
