import languagesCodeList from "./language-codes";

const LANGUAGE_CODE_REG = /^([A-Za-z]{2}([-_][A-Za-z]{2})?)$/;
const LANGUAGE_REGION_SEPARATOR = "-";

// TODO: refactor to typescript properly
export default (code: string) => {
  if (!code) {
    return null;
  }
  // eslint-disable-next-line no-param-reassign
  code = code.toLowerCase().trim();
  if (code === "zh-hant") {
    // eslint-disable-next-line no-param-reassign
    code = "zh-TW";
  }
  if (code.startsWith("iw")) {
    // eslint-disable-next-line no-param-reassign
    code = "he";
  }
  const result = LANGUAGE_CODE_REG.exec(code);
  if (!result) {
    return null;
  }

  const [language, region] = code.split(/[-_]/);

  let resultCode = language;

  if (region) {
    resultCode =
      language.toLowerCase() + LANGUAGE_REGION_SEPARATOR + region.toUpperCase();
    if (languagesCodeList.indexOf(resultCode) < 0) {
      // get only language - without region
      resultCode = resultCode.substr(0, 2);
    }
  }

  if (languagesCodeList.indexOf(resultCode) < 0) {
    return null;
  }

  return resultCode;
};
