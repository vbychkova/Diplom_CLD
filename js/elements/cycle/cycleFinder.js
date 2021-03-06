function Graph() {
    this.nodes = [];
    this.arrows = new Map();
}
Graph.prototype.findCycles = function findCycles() {
    let startNode;
    const stack = [];
    const cycles = [];
    const blocked = new Map();

    const b = new Map();

    const graph = this;

    function addCycle(start, stack) {
        const orders = [start.order].concat(
            stack.map(function(n) {
                return n.order;
            })
        );

        if (Math.min.apply(null, orders) !== start.order) {
            cycles.push([].concat(stack).concat(start));
        }
    }

    function unblock(u) {
        blocked.set(u, false);

        if (b.has(u)) {
            b.get(u).forEach(function(w) {
                b.get(u).delete(w);
                if (blocked.get(w)) {
                    unblock(w);
                }
            });
        }
    }

    function cycle(node) {
        let found = false;

        stack.push(node);
        blocked.set(node, true);

        graph.arrows.get(node).forEach(function(w) {
            if (w === startNode) {
                found = true;
                addCycle(startNode, stack);
            } else if (!blocked.get(w)) {
                if (cycle(w)) {
                    found = true;
                }
            }
        });

        if (found) {
            unblock(node);
        } else {
            graph.arrows.get(node).forEach(function(w) {
                let entry = b.get(w);

                if (!entry) {
                    entry = new Set();
                    b.set(w, entry);
                }

                entry.add(node);
            });
        }

        stack.pop();
        return found;
    }

    graph.nodes.forEach(function(node) {
        startNode = node;
        graph.arrows.get(node).forEach(cycle);
    });

    return cycles;
};