define(
  [
    'pex/geom/Vec3',
    'pex/geom/hem',
    'pex/geom/BoundingBox',
    'pex/geom/Octree'
  ],
  function(Vec3, hem, BoundingBox, Octree) {
    return {
      Vec3 : Vec3,
      hem : hem,
      BoundingBox : BoundingBox,
      Octree : Octree
    };
  }
);


