export const assert = ({
  caseDesc,
  first,
  check,
  excepted,
  tests,
  failed,
  length,
}) => {
  tests++;
  const tooLong = length || 250;
  let testResult;

  let results;
  let printout = "";
  let stepText = "";

  /* Creating test desctiption text */
  caseDesc = caseDesc ? `TESTCASE: ${caseDesc}\n` : "";

  try {
    if (first) {
      const firstValue = JSON.stringify(first());
      stepText = `Called first: ${first}, returned: ${firstValue}\n`;
    }

    /* Creating exeption text */
    const exceptValue = JSON.stringify(excepted) || "";
    const excepText = `Exceptation is: ${
      exceptValue.length > tooLong ? "...too long..." : exceptValue
    }\n`;

    /* Creating the check and result text */
    const resultValue = JSON.stringify(check());
    const resultText = `${first ? "Then c" : "C"}alled: ${check},\nReturned: ${
      resultValue && resultValue.length > tooLong
        ? "...too long..."
        : resultValue
    }\n`;

    /* Creating the decision text */
    testResult = resultValue == exceptValue;
    const decision = `Result:     ${
      resultValue == exceptValue ? `📗successed📗` : `📕FAILED📕`
    }`;

    !testResult && failed++;

    /* printout */
    printout = caseDesc + stepText + resultText + excepText + decision;
  } catch (e) {
    failed++;
    testResult = false;

    printout = `Test is 📕FAILED📕\nSomething went wrong with ${caseDesc}\n${
      first ? `Called first: ${first},\nthen c` : "C"
    }alled: ${check}\n${e}`;
    console.error(e);
  }

  /* Creating the header */
  const header = `------------------------------ TEST STEP: ${tests} Failed: ${failed} ------------------------------\n`;

  printout = header + printout + "\n";

  return [{ printout, testResult }, tests, failed];
};

export const batchAssert = (
  cases,
  { showFailed, showSuccessed, length } = {
    showFailed: true,
    showSuccessed: false,
  }
) => {
  let tests = 0;
  let failed = 0;
  let result;

  const results = cases.map((cs) => {
    [result, tests, failed] = assert({ ...cs, tests, failed, length });
    return result;
  });

  const faliedTests = results.filter((result) => result.testResult);
  const successedTests = results.filter((result) => !result.testResult);

  const summaryHeader =
    "----------------------------------- TESTS ENDED! -----------------------------------\n";

  let summary = summaryHeader;
  summary += `${tests} performed\n`;
  summary += `${tests - failed} test was 📗successed📗\n`;
  failed > 0 && (summary += `${failed} test was 📕FAILED📕\n`);
  summary += summaryHeader;

  console.warn(summary);

  showFailed && successedTests.forEach((sT) => console.warn(sT.printout));
  showSuccessed && faliedTests.forEach((fT) => console.warn(fT.printout));
};
