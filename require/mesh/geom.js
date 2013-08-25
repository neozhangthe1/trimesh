define(
  [
    'mesh/geom/Vec2',
    'mesh/geom/Vec3',
    'mesh/geom/Vec4',
    'mesh/geom/Geometry',
    'mesh/geom/gen',
    'mesh/geom/Edge',
    'mesh/geom/Face3',
    'mesh/geom/Face4',
    'mesh/geom/hem',
    'mesh/geom/BoundingBox',
    'mesh/geom/Octree'
  ],
  function(Vec2, Vec3, Vec4, Geometry, gen, Edge, Face3, Face4, hem, BoundingBox, Octree) {
    return {
      Vec2 : Vec2,
      Vec3 : Vec3,
      Vec4 : Vec4,
      Geometry : Geometry,
      gen : gen,
      Edge : Edge,
      Face3 : Face3,
      Face4 : Face4,
      hem : hem,
      BoundingBox : BoundingBox,
      Octree : Octree
    };
  }
);


