geom = geom || require('../build/geom')

{ hem, Vec3 } = geom

class example
    constructor:(@hem,@face) ->
        @direction = Vec3.create().copy(face.getNormal())
        center = face.getCenter()
        avgDist = 0

 Defining a fuction
polygon = (sides, size, center) ->
    # Setting up angles to iterate to get polygon
    circle = 2 * Math.PI
    angle = circle / sides
    points = []

    # With the polygon defined we iterate through
    # the sides to get the nth polygon we want. 
    for i in [0..sides]
        x = (Math.cos(angle * i) * size) + center[0]
        y = (Math.sin(angle * i) * size) + center[1]
        points[i] = {"x": x, "y": y}

    return points

# The additional code
console.log polygon(6, 10, [0,0])