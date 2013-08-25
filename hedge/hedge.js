TriMesh = function() {

	HEdge = function() {
		this.id = -1;
		this.orign = null; //from node
		this.face = null;
		this.edge = null;
		this.twin = null; //twin edge
		this.next = null; //next edge
		this.prev = null; //prev edge

		this.data = null
	}

	Vertex = function() {
		this.id = -1;
		this.edge = null;
		this.data = null;

		this.get_edges = function() {
			var edges = []
			var p_edge = this.edge;
			do {
				edges.push(p_edge);
				p_edge = p_edge.twin.next;
			} while (p_edge != this.edge)
			return edges;
		}

		this.get_faces = function() {
			var faces = []
			var p_edge = this.edge;
			var p_face = p_edge.face;
			do {
				faces.push(p_face);
				p_edge = p_face.twin.next;
				p_face = p_edge.face;
			} while (p_edge != this.edge)
		}
	}

	Face = function() {
		this.edge = null;

		this.get_vertices = function() {
			var vertices = [];
			var p_edge = this.edge;
			do {
				vertices.push(p_edge.orign);
				p_edge = p_edge.next;
			} while (p_edge != this.edge)
		}
	}

	var _self = this;

	this.faces = [];
	this.vertices = {}
	this.edges = [];

	this.add_vertex = function(vertex) {
		var nid = id(vertex);
		var _vertex = new Vertex();
		_vertex.id = nid;
		_vertex.data = vertex;
		this.vertex[nid] = _vertex;
		return _vertex
	};

	function id(node) {
		var id = '';
		if(node.id) {
			id = node.id;
		} else if(node._id) {
			id = node._id;
		} else if(node.name) {
			id = node.name;
		} else if(node.label) {
			id = node.label;
		} else if(typeof node === 'string') {
			id = node;
		}
		return id;
	};

	this.edge_hash = function(e) {
		var i = this.vertices.indexOf(e.orign);
		var j = this.vertices.indexOf(e.next.orign);
		var hash = i + "_" + j;
		return hash;
	}

	this.add_faces = function(faces) {
		faces.forEach(function(f) {
			this.add_face(f);
		});
		this.fix_duplicated_edges();
		this.fix_vertex_edges();
		this.fix_edge_twins();
		this.check();
		return this;
	}

	this.add_face = function(vertices) {
		var num_edge = 3;
		var new_face = new Face();
		this.faces.push(new_face);

		var new_edges = [null, null, null, null, null, null];
		for (var i = 0; i < num_edge; i++) {
			new_edges[i] = new HEdge();
			this.edges.push(new_edges[i]);
			vid = id(vertices[i])
			var vertex = null
			if (!this.vertices[vid]) {
				vertex = _self.add_vertex(this.vertices[vid]);
			} else {
				vertex = this.vertices[vid];
			}
			new_edges[j].origin = vertex;
			new_edges[j].face = new_face;
		}
		for (var k = 0; k < num_edge; k++) {
			new_edges[k].next = new_edges[(k + 1) % num_edge];
			new_edges[(k + 1) % num_edge].prev = new_edges[k]
		}
		return new_face;
	}

	this.fix_duplicated_edges = function() {
		var uniques = [];
		for (var i = 0; i < this.edges.length; i++) {
			var edge = this.edges[i];
			var hash = this.edgeHash(edge);
			var duplicateIndex = uniques.indexOf(hash);
			var duplicate = (duplicateIndex !== -1);
			if (!duplicate) {
				uniques.push(hash);
			} else {
				var duplicateEdge = this.edges[duplicateIndex];
				this.edges.splice(i, 1);
				i--;
				this.vertices.forEach(function(v) {
					if (v.edge == edge) v.edge = duplicateEdge;
				});
				this.faces.forEach(function(f) {
					if (f.edge == edge) {
						f.edge = duplicateEdge;
						f.edge.face = f;
					}
				});
			}
		}
	}

	this.fix_vertex_edges = function() {
		this.vertices.forEach(function(v) {
			v.edge = null;
		});
		for (var i in this.edges) {
			var edge = this.edges[i];
			edge.origin.edge = edge;
		}
		return this;
	}

	this.fix_edge_twins = function() {
		for (var i = 0; i < this.edges.length; i++) {
			this.edges[i].twin = null;
		}
		var numPairs = 0;
		var hash = {};
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].index = i;
		}
		for (var i = 0; i < this.edges.length; i++) {
			var edge = this.edges[i];
			var edgeHash = edge.origin.index + "," + edge.next.origin.index;
			var twinEdgeHash = edge.next.origin.index + "," + edge.origin.index;
			hash[edgeHash] = edge;
			if (hash[twinEdgeHash]) {
				edge.twin = hash[twinEdgeHash];
				edge.twin.twin = edge;
			}
		}
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].index = -1;
		}
		return this;
	}

	this.check = function() {
		for (var i in this.vertices) {
			if (this.vertices[i].edge == null) {
				console.log("Missing vertex edge at ", i);
			} else if (this.vertices[i] != this.vertices[i].edge.vert) {
				console.log("Edge doesn't point to it's vertex at ", i);
			}
		}

		for (var i in this.faces) {
			if (this.faces[i].edge == null) {
				console.log("Missing faces edge at ", i);
			} else if (this.faces[i] != this.faces[i].edge.face) {
				console.log("Edge doesn't point to it's face at ", i);
			}

			if (this.edges.indexOf(this.faces[i].edge) === -1) {
				console.log("Invalid face edge at ", i);
			}
		}

		for (var i in this.edges) {
			var edge = this.edges[i];
			var e = edge;
			var watchDog = 0;

			if (edge.twin == null) {
				console.log("Edge doesn't have it's twin", i);
			} else if (edge.twin.twin != edge) {
				console.log("Edge twin doesn't match", i, this.edges.indexOf(edge), this.edges.indexOf(edge.twin), this.edges.indexOf(edge.twin.twin));
			}

			do {
				if (++watchDog > 100) {
					console.log("Edge watchDog break at", i, " . Wrong edge loop pointers?");
					break;
				}
				if (watchDog > 6) {
					console.log("Warning! Face with " + watchDog + " vertices");
				}
				if (e.next == null) {
					console.log("Missing edge next at ", i, ". Open loop.");
					break;
				}
				e = e.next;
			} while (e != edge)
		}

		return this;
	};
}

var vismatrix = new TriMesh();
vismatrix.add_face(["1","2","3"])
// d3.csv('iris.csv', function(flowers) {
// 	vismatrix.data(flowers).layout().render();
// });

var w = 960,
	h = 500;

var labelDistance = 0;

var vis = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);

var nodes = [];
var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];

for (var i = 0; i < 30; i++) {
	var node = {
		label: "node " + i
	};
	nodes.push(node);
	labelAnchors.push({
		node: node
	});
	labelAnchors.push({
		node: node
	});
};

for (var i = 0; i < nodes.length; i++) {
	for (var j = 0; j < i; j++) {
		if (Math.random() > .95)
			links.push({
				source: i,
				target: j,
				weight: Math.random()
			});
	}
	labelAnchorLinks.push({
		source: i * 2,
		target: i * 2 + 1,
		weight: 1
	});
};

var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
	return x.weight * 10
});


force.start();

var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
force2.start();

var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 3);
node.call(force.drag);


var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks) //.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
anchorNode.append("svg:text").text(function(d, i) {
	return i % 2 == 0 ? "" : d.node.label
}).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

var updateLink = function() {
	this.attr("x1", function(d) {
		return d.source.x;
	}).attr("y1", function(d) {
		return d.source.y;
	}).attr("x2", function(d) {
		return d.target.x;
	}).attr("y2", function(d) {
		return d.target.y;
	});

}

var updateNode = function() {
	this.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	});

}


force.on("tick", function() {

	force2.start();

	node.call(updateNode);

	anchorNode.each(function(d, i) {
		if (i % 2 == 0) {
			d.x = d.node.x;
			d.y = d.node.y;
		} else {
			var b = this.childNodes[1].getBBox();

			var diffX = d.x - d.node.x;
			var diffY = d.y - d.node.y;

			var dist = Math.sqrt(diffX * diffX + diffY * diffY);

			var shiftX = b.width * (diffX - dist) / (dist * 2);
			shiftX = Math.max(-b.width, Math.min(0, shiftX));
			var shiftY = 5;
			this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
		}
	});


	anchorNode.call(updateNode);

	link.call(updateLink);
	anchorLink.call(updateLink);

});