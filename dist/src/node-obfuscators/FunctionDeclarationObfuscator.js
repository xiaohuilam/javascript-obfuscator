"use strict";
const estraverse = require('estraverse');
const NodeType_1 = require("../enums/NodeType");
const NodeObfuscator_1 = require('./NodeObfuscator');
const NodeUtils_1 = require("../NodeUtils");
const Utils_1 = require('../Utils');
class FunctionDeclarationObfuscator extends NodeObfuscator_1.NodeObfuscator {
    constructor(...args) {
        super(...args);
        this.functionName = new Map();
    }
    obfuscateNode(functionDeclarationNode, parentNode) {
        if (parentNode.type === NodeType_1.NodeType.Program) {
            return;
        }
        this.replaceFunctionName(functionDeclarationNode);
        this.replaceFunctionCalls(functionDeclarationNode);
    }
    replaceFunctionName(functionDeclarationNode) {
        estraverse.replace(functionDeclarationNode.id, {
            leave: (node) => {
                if (NodeUtils_1.NodeUtils.isIdentifierNode(node) && !this.isReservedName(node.name)) {
                    this.functionName.set(node.name, Utils_1.Utils.getRandomVariableName());
                    node.name = this.functionName.get(node.name);
                    return;
                }
                return estraverse.VisitorOption.Skip;
            }
        });
    }
    replaceFunctionCalls(functionDeclarationNode) {
        let scopeNode = NodeUtils_1.NodeUtils.getBlockScopeOfNode(functionDeclarationNode);
        estraverse.replace(scopeNode, {
            enter: (node, parentNode) => {
                this.replaceNodeIdentifierByNewValue(node, parentNode, this.functionName);
            }
        });
    }
}
exports.FunctionDeclarationObfuscator = FunctionDeclarationObfuscator;
