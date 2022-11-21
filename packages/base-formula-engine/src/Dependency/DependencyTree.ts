import { IRangeData, IUnitRange } from '@univer/core';
import { BaseAstNode } from '../AstNode/BaseAstNode';
import { IFormulaData } from '../Basics/Common';

export enum FDtreeStateType {
    DEFAULT,
    ADDED,
    SKIP,
}

export class FormulaDependencyTree implements IFormulaData {
    node: BaseAstNode;
    children: FormulaDependencyTree[] = [];
    parents: FormulaDependencyTree[] = [];

    private _state = FDtreeStateType.DEFAULT;

    formula: string;
    row: number;
    column: number;
    sheetId: string;
    unitId: string;

    rangeList: IUnitRange[] = [];

    private _pushParent(tree: FormulaDependencyTree) {
        this.parents.push(tree);
    }

    setAdded() {
        this._state = FDtreeStateType.ADDED;
    }

    isAdded() {
        return this._state === FDtreeStateType.ADDED;
    }

    setSkip() {
        this._state = FDtreeStateType.SKIP;
    }

    isSkip() {
        return this._state === FDtreeStateType.SKIP;
    }

    compareRangeData(rangeData: IRangeData) {
        const startRow = rangeData.startRow;
        const startColumn = rangeData.startColumn;
        const endRow = rangeData.endRow;
        const endColumn = rangeData.endColumn;

        if (this.row < startRow || this.row > endRow || this.column < startColumn || this.column > endColumn) {
            return false;
        }

        return true;
    }

    pushChildren(tree: FormulaDependencyTree) {
        this.children.push(tree);
        tree._pushParent(this);
    }

    pushRangeList(range: IUnitRange) {
        this.rangeList.push(range);
    }

    dependency(dependenceTree: FormulaDependencyTree) {
        if (this.rangeList.length === 0) {
            return false;
        }

        for (let r = 0, len = this.rangeList.length; r < len; r++) {
            const unitRange = this.rangeList[r];
            const unitId = unitRange.unitId;
            const sheetId = unitRange.sheetId;
            const rangeData = unitRange.rangeData;

            if (dependenceTree.unitId === unitId && dependenceTree.sheetId === sheetId && dependenceTree.compareRangeData(rangeData)) {
                return true;
            }
        }

        return false;
    }
}