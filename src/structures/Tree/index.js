const Tree = require("./prototype");

// TODO: Implement map function in the tree
// TODO: Implement max function that return the max value in the tree
// TODO: Implement min function that return the min value in the tree
// TODO: Implement filter function in the tree
// TODO: Implement reduce function in the tree
// CHANGED: Change the name of createTree funtion by createBST

function createEmptyTree() {
  return Object.assign(Object.create(Tree), { rootNode: undefined });
}

function createNewTreeWith(args) {
  return createEmptyTree().insert(args);
}

function createTree(...args) {
  return args.length === 0 ? createEmptyTree() : createNewTreeWith(args);
}

module.exports = {
  createTree
};
