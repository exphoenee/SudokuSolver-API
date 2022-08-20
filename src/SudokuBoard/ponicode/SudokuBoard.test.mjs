const SudokuBoard = require("../SudokuBoard.mjs");
// @ponicode
describe("SudokuBoard.default.getFirstFeeCell", () => {
  let inst;

  beforeEach(() => {
    inst = new SudokuBoard.default();
  });

  test("0", () => {
    let result = inst.getFirstFeeCell();
    expect(result).toMatchSnapshot();
  });
});
