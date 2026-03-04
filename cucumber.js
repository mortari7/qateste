require("ts-node/register");

module.exports = {
  default: {
    require: [
      "./features/step-definitions/**/*.ts"
    ],
    paths: [
      "./features/**/*.feature"
    ],
    publishQuiet: true,
    format: ["progress"]
  }
};
