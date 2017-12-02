'use strict';

const { replaceIn, minOf } = require('../../utils/tools');

function updateRootNode(posibleRoot) {
  return posibleRoot.parentNode === undefined
    ? posibleRoot
    : updateRootNode(posibleRoot.parentNode);
}

function updateRootOf(tree) {
  let newRootNode = updateRootNode(tree.rootNode);
  newRootNode.setColor('BLACK');
  tree.rootNode = newRootNode;
}

function addIn(tree, newRBNode) {
  /* calling the insert function of BST prototype object */
  Object.getPrototypeOf(tree.__proto__).insert.call(tree, newRBNode);
  newRBNode.insertFixUp(tree);
  updateRootOf(tree);
  return tree;
}

function removeFrom(rbTree, node) {
  let x;
  let nodeOriginalColor = node.getColor();

  if (!node.hasChildrens()) {
    x = node.rightChild;
    replaceIn(rbTree, node, node.rightChild);
  } else if (node.leftChild.isALeaf() || node.rightChild.isALeaf()) {
    const nodeChild = node.leftChild.isALeaf()
      ? node.rightChild
      : node.leftChild;
    x = nodeChild;
    replaceIn(rbTree, node, nodeChild);
  } else {
    const succesor = minOf(node.rightChild);
    node.setKey(succesor.getValue());
    nodeOriginalColor = succesor.getColor();
    x = succesor.rightChild;
    replaceIn(rbTree, succesor, succesor.rightChild);

  }

  if (nodeOriginalColor === 'BLACK') {
    if (x.isALeaf() && x === rbTree.rootNode) {
      rbTree.rootNode = undefined;
    } else {
      deleteFixUp(rbTree, x);
    }
  }

  return rbTree;
}

function deleteFixUp(tree, x) {
  let node = x;
  let sibling;
  while (node.parentNode !== undefined && node.getColor() === 'BLACK') {
    let { parentNode } = node;

    if (node.isALeftChild()) {
      sibling = parentNode.rightChild;

      if (sibling.getColor() === 'RED') {
        sibling.setColor('BLACK');
        parentNode.setColor('RED');
        parentNode.rotateToLeft(tree);
        sibling = parentNode.rightChild;
      }

      if (
        sibling.leftChild.getColor() === 'BLACK' &&
        sibling.rightChild.getColor() === 'BLACK'
      ) {
        sibling.setColor('RED'); // case 2
        node = parentNode; // case 2
      } else {
        if (sibling.rightChild.getColor() === 'BLACK') {
          sibling.leftChild.setColor('BLACK'); // case 3
          sibling.setColor('RED'); // case 3
          sibling.rotateToRight(tree); // case 3
          sibling = parentNode.rightChild; // case 3
        }

        sibling.setColor(parentNode.getColor()); // case 4
        parentNode.setColor('BLACK'); // case 4
        sibling.rightChild.setColor('BLACK'); // case 4
        parentNode.rotateToLeft(tree); // case 4

        node = tree.rootNode; // case 4
      }
    } else {
      sibling = parentNode.leftChild;

      if (sibling.getColor() === 'RED') {
        sibling.setColor('BLACK');
        parentNode.setColor('RED');
        parentNode.rotateToRight(tree);
        sibling = parentNode.leftChild;
      }

      if (
        sibling.leftChild.getColor() === 'BLACK' &&
        sibling.rightChild.getColor() === 'BLACK'
      ) {
        sibling.setColor('RED');
        node = parentNode;
      } else {
        if (sibling.leftChild.getColor() === 'BLACK') {
          sibling.rightChild.setColor('BLACK');
          sibling.setColor('RED');
          sibling.rotateToLeft(tree);
          sibling = parentNode.leftChild;
        }

        sibling.setColor(parentNode.getColor());
        parentNode.setColor('BLACK');
        sibling.leftChild.setColor('BLACK');
        parentNode.rotateToRight(tree);
        node = tree.rootNode;
      }
    }
  }

  node.setColor('BLACK');
}

function filterTree(fn,tree,treeNode){
  if(treeNode !== undefined && !treeNode.isALeaf()){
    const succesor = treeNode.succesor();

    if(!fn(treeNode.getValue())){
      removeFrom(tree,treeNode);
    }

    if(succesor !== undefined){
      filterTree(fn,tree,tree.find(succesor.getValue()));
    }
  }
}

module.exports = {
  updateRootOf,
  addIn,
  removeFrom,
  filterTree,
  deleteFixUp
};
