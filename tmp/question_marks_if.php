<?php


class Node {
	public $val = null;
	public $right = null;
	public $left = null;

	public function __construct($val = null) {
		$this->setVal($val);
	}

	public function setVal($val) {
		$this->val = $val;
	}

	public function hasLeft() {
		return !!$this->left;
	}

	public function getLeft() {
		return $this->left;
	}

	public function hasRight() {
		return !!$this->right;
	}

	public function getRight() {
		return $this->right;
	}

	public function setLeft($val = null) {
		$this->left = new Node($val);
	}

	public function setRight($val = null) {
		$this->right = new Node($val);
	}

	public function __toString() {
		return $this->val ?? '[null]'; }
}


class BTree {
	public $root;

	public function __construct($rootVal = null) {
		$this->setRoot($rootVal);
	}

	public function setRoot($val) {
		if (is_null($this->root)) {
			$this->root = new Node();
		}

		$this->root->setVal($val);
	}

	public function getRoot() {
		return $this->root;
	}

	public function __toString() {
		return $this->_printTree($this->root);
	}

	protected function _printTree(Node $node, $indentation = 0) {
		$retHtml = str_repeat("\t", $indentation) . $node . PHP_EOL;
		if ($node->hasLeft()) {
			$retHtml.= $this->_printTree($node->getLeft(), $indentation + 1);
		}

		if ($node->hasRight()) {
			$retHtml.= $this->_printTree($node->getRight(), $indentation + 1);
		}

		return $retHtml;
	}
}



$cond = 'a?g?h:i?k:t:w?v:u';
$tree = new BTree();

function convert($s, $i = 0, Node $node = null) {
	$node->setVal($s[$i]);
	if ($i >= strlen($s) - 1) {
		return $i;
	}

	if ($s[$i + 1] == ':') {
		return $i;
	}

	if ($s[$i + 1] == '?') {
		$node->setLeft(null);
		$node->setRight(null);

		$i = convert($s, $i+2, $node->getLeft());
		$i = convert($s, $i+2, $node->getRight());
	}

	return $i;
}

$root = $tree->getRoot();
convert($cond, 0, $root);
echo $tree;


