import Cell from './Cell/Cell.js';
import Batch from './Batch/Batch.js';
import type {
  CellSelector,
  BoardSize,
  CellValue,
  ConfigOptions,
  PuzzleInput,
  PuzzleFormat,
} from '../../types.js';

export default class SudokuBoard {
  #boxSizeX: number;
  #boxSizeY: number;
  #dimensionX: number;
  #dimensionY: number;
  #cellNumber: number;
  #boxSize: number;
  #cells: Cell[] = [];
  #rows: Batch[] = [];
  #cols: Batch[] = [];
  #boxes: Batch[] = [];
  #separator: string;

  constructor(
    boxSizeX: number,
    boxSizeY: number,
    puzzle: PuzzleInput | null = null,
    _options: ConfigOptions = {}
  ) {
    this.#boxSizeX = boxSizeX;
    this.#boxSizeY = boxSizeY;
    this.#dimensionX = boxSizeX ** 2;
    this.#dimensionY = boxSizeY ** 2;
    this.#cellNumber = this.#dimensionX * this.#dimensionY;
    this.#boxSize = this.#boxSizeX * this.#boxSizeY;
    this.#separator = ',';

    this.#generateBoard();
    if (this.#boardFormat(puzzle)[0] !== 'err') {
      this.setBoard(puzzle, true);
    }
  }

  #generateBoard(): void {
    this.#createCells();
    this.#createRows();
    this.#createCols();
    this.#createBoxes();
  }

  get boardSize(): BoardSize {
    return {
      x: this.#dimensionX,
      y: this.#dimensionY,
      boxSizeX: this.#boxSizeX,
      boxSizeY: this.#boxSizeY,
    };
  }

  #createCells(): void {
    for (let y = 0; y < this.#dimensionY; y++) {
      for (let x = 0; x < this.#dimensionX; x++) {
        const bx = Math.floor(x / this.#boxSizeX);
        const by = Math.floor(y / this.#boxSizeY);
        this.#cells.push(
          new Cell({
            id: y * this.#dimensionX + x,
            x,
            y,
            boxId: this.#boxSizeX * by + bx,
            bx,
            by,
            accepted: { unfilled: 0, min: 1, max: this.#boxSize },
          })
        );
      }
    }
  }

  get cells(): Cell[] {
    return this.#cells;
  }
  get info(): unknown[] {
    return this.#cells.map(cell => cell.info);
  }

  clearIssued(): void {
    this.#cells.forEach(cell => cell.unsetIssued());
  }

  #filterSameBatchID(numberOfBatches: number, cellsInBatch: number, id: string): Batch[] {
    const collector: Batch[] = [];
    for (let i = 0; i < numberOfBatches; i++) {
      const batch = new Batch(i, cellsInBatch, id);
      this.#cells
        .filter(cell => (cell as unknown as Record<string, number>)[id] === i)
        .forEach(cell => batch.addCell(cell));
      collector.push(batch);
    }
    return collector;
  }

  #createCols(): void {
    this.#cols = this.#filterSameBatchID(this.#dimensionX, this.#dimensionY, 'x');
  }
  #createRows(): void {
    this.#rows = this.#filterSameBatchID(this.#dimensionY, this.#dimensionX, 'y');
  }
  #createBoxes(): void {
    this.#boxes = this.#filterSameBatchID(this.#boxSize, this.#boxSize, 'boxId');
  }

  getCol(colNr: number): Batch {
    return this.#cols[colNr];
  }
  getRow(rowNr: number): Batch {
    return this.#rows[rowNr];
  }
  getAllCols(): Batch[] {
    return this.#cols;
  }
  getAllBoxes(): Batch[] {
    return this.#boxes;
  }
  getAllRows(): Batch[] {
    return this.#rows;
  }
  getBox(boxNr: number): Batch {
    return this.#boxes[boxNr];
  }

  #filterValuesFromBatch(batch: Batch): CellValue[] {
    return batch.cells.map(cell => cell.value);
  }

  getRowValues(rowNr: number): CellValue[] {
    return this.#filterValuesFromBatch(this.getRow(rowNr));
  }
  getColValues(colNr: number): CellValue[] {
    return this.#filterValuesFromBatch(this.getCol(colNr));
  }
  getBoxValues(boxNr: number): CellValue[] {
    return this.#filterValuesFromBatch(this.getBox(boxNr));
  }
  getFilledFromBatch(batch: Batch): CellValue[] {
    return batch.getFilledNumbers();
  }
  getMissingFromBatch(batch: Batch): CellValue[] {
    return batch.getMissingNumbers();
  }

  getBatchesOfCell(params: CellSelector): Batch[] {
    const cell = this.getCell(params);
    return [this.getCol(cell.x), this.getRow(cell.y), this.getBox(cell.boxId)];
  }

  getCellPossibilities(params: CellSelector): CellValue[] {
    const cell = this.getCell(params);
    const [missingFromCol, missingFromRow, missingFromBox] = this.getBatchesOfCell({ cell }).map(
      batch => batch.getMissingNumbers()
    );
    const intersection = (arr1: CellValue[], arr2: CellValue[]): CellValue[] =>
      arr1.filter(value => arr2.includes(value));
    return intersection(intersection(missingFromCol, missingFromRow), missingFromBox);
  }

  hasBatchDuplicates(batch: Batch): boolean {
    return batch.hasDuplicates();
  }

  hasCellDuplicates(params: CellSelector): boolean {
    const cell = this.getCell(params);
    return this.getBatchesOfCell({ cell }).every(batch => batch.hasDuplicates());
  }

  #markCellIssue(params: CellSelector): void {
    const cell = this.getCell(params);
    this.getBatchesOfCell({ x: cell.x, y: cell.y }).forEach(batch => {
      batch.cells.forEach(batchCell => batchCell.unsetIssued());
      batch.getDuplicateValuedCells().forEach(issuedCell => issuedCell.setIssued());
    });
  }

  getIssuedCells(): Cell[] {
    return [
      ...new Set(
        [...this.#rows, ...this.#cols, ...this.#boxes]
          .map(batch => batch.getDuplicateValuedCells())
          .flat()
      ),
    ];
  }

  #updateCellPossibilities(params: CellSelector): void {
    const cell = this.getCell(params);
    this.getBatchesOfCell({ x: cell.x, y: cell.y }).forEach(batch =>
      batch.cells.forEach(batchCell => {
        const possibilities = this.getCellPossibilities(batchCell);
        if (possibilities.length > 0) batchCell.setPossibilities(possibilities);
      })
    );
  }

  puzzleIsCorrect(): boolean {
    for (const batch of [...this.#rows, ...this.#cols, ...this.#boxes])
      if (batch.hasDuplicates()) return false;
    for (const cell of this.cells) if (cell.possibilities.length === 0) return false;
    return true;
  }

  getFirstFreeCell(): Cell | false {
    const freeCell = this.#cells.find(cell => cell.value === 0);
    return freeCell ?? false;
  }

  getCellsByValue(value: CellValue): Cell[] {
    return this.cells.filter(cell => cell.value === value);
  }

  updatePossibilityMap(): void {
    this.cells.forEach(cell => cell.setPossibilities(this.getCellPossibilities(cell)));
  }

  getPossibilityMatrix(): CellValue[][] {
    return this.cells.map(cell => this.getCellPossibilities(cell));
  }

  getFreeCellWithLeastPossibilities(): Cell | false {
    const sorted = this.#cells
      .filter(cell => cell.value === 0)
      .map(cell => ({ cell, possibilities: this.getCellPossibilities(cell) }))
      .sort((a, b) => a.possibilities.length - b.possibilities.length);
    const freeCell = sorted[0]?.cell;
    return freeCell && this.getCellPossibilities(freeCell).length > 0 ? freeCell : false;
  }

  coordsOfFirstFreeCell(): { x: number; y: number } | false {
    const freeCell = this.getFirstFreeCell();
    return freeCell ? { x: freeCell.x, y: freeCell.y } : false;
  }

  validateCoord(x: number, y: number): boolean {
    return 0 <= x && x <= this.#dimensionX - 1 && 0 <= y && y <= this.#dimensionY - 1;
  }

  #boardFormat(board: PuzzleInput | null): [string, string?] {
    if (board === null) return ['err', 'Board is null'];
    if (Array.isArray(board)) {
      if (
        board.length === this.#dimensionY &&
        board.every(row => Array.isArray(row) && row.length === this.#dimensionX)
      )
        return ['2D'];
      if (board.length === this.#cellNumber) return ['1D'];
      return ['err', `1D array must have exactly ${this.#cellNumber} elements`];
    }
    if (typeof board === 'string') {
      if (board.split(this.#separator).length === this.#cellNumber) return ['string'];
      return ['err', `String must have exactly ${this.#cellNumber} comma-separated values`];
    }
    return ['err', 'Invalid board format'];
  }

  setBoard(board: PuzzleInput | null, setGiven = false): void {
    if (board === null) return;
    const [format, msg] = this.#boardFormat(board);
    const convert1Dto2D = (arr: number[]): CellValue[][] => {
      const mBoard = [...arr];
      const board2D: CellValue[][] = [];
      while (mBoard.length) board2D.push(mBoard.splice(0, this.#dimensionX) as CellValue[]);
      return board2D;
    };
    let convertedBoard: CellValue[][] | null = null;
    if (format === '2D') convertedBoard = board as CellValue[][];
    else if (format === '1D') convertedBoard = convert1Dto2D(board as number[]);
    else if (format === 'string')
      convertedBoard = convert1Dto2D((board as string).split(',').map(Number));
    if (convertedBoard) {
      convertedBoard.forEach((row, y) =>
        row.forEach((cellValue, x) => {
          const cell = this.getCell({ x, y });
          cell.setValue(cellValue);
          if (setGiven) cell.isFilled() ? cell.setGiven() : cell.unsetGiven();
        })
      );
      this.#setAllIssuedCells();
    } else if (msg) throw new Error(msg);
  }

  clearBoard(): void {
    this.#cells.forEach(cell => cell.setValue(0));
  }

  getCellValues({
    format = '2D',
    unfilledChar = '0',
  }: { format?: PuzzleFormat; unfilledChar?: string } = {}): CellValue[][] | CellValue[] | string {
    const res = this.#cells.map(cell => cell.value);
    if (format.toUpperCase() === 'STRING') return res.join(',').replace(/0/g, unfilledChar || '0');
    if (format.toUpperCase() === '2D') {
      const board2D: CellValue[][] = [];
      while (res.length) board2D.push(res.splice(0, this.#dimensionX) as CellValue[]);
      return board2D;
    }
    return res;
  }

  getCell(params: CellSelector): Cell {
    if (params.cell && typeof params.cell === 'object' && 'value' in (params.cell as object)) {
      return params.cell as Cell;
    }
    if (params.x !== undefined && params.y !== undefined) {
      return this.#cells.find(
        c => this.validateCoord(params.x!, params.y!) && c.x === params.x && c.y === params.y
      ) as Cell;
    }
    if (params.id !== undefined) {
      return this.#cells.find(c => c.id === params.id) as Cell;
    }
    throw new Error('Invalid cell selector');
  }

  setCellValue(params: CellSelector, value: CellValue): void {
    const cell = this.getCell(params);
    cell.setValue(value);
    this.#markCellIssue(cell);
    this.#updateCellPossibilities(cell);
  }

  #setAllIssuedCells(): void {
    this.clearIssued();
    this.getIssuedCells().forEach(issuedCell => issuedCell.setIssued());
  }
}
