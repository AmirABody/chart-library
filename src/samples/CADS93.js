const { Profile } = require("../Profile");

class CADS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره کل" },
    L2: { eng: "interpretation", fr: "تفسیر" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه افسردگی کودکان و نوجوانان - جان‌بزرگی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 883 + 2 * this.padding.x,
          height: 705 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 10,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      maxValue: 56 /* Maximum value of raw mark provided by the dataset */,
      offsetY: 83 /* Vertical offset from items */,
      rect: {
        width: 815 /* Width of the raw rectangle */,
        height: 20 /* Height of the raw rectangle */,
        br: 5 /* Border radius of the raw rectangle */,
      },
      widthCoeff: 14 /* Used for converting mark to the width */,
      stops: [1, 7, 18, 28, 56] /* Stops array for the raw mark */,
      interprets: [
        { fill: "#71717A", eng: "no_depression", fr: "" },
        { fill: "#FBBF24", eng: "mild", fr: "خفیف" },
        { fill: "#FB923C", eng: "moderate", fr: "متوسط" },
        { fill: "#EF4444", eng: "severe", fr: "شدید" },
        { fill: "#B91C1C", eng: "extreme", fr: "بسیار شدید" },
      ] /* Interprets array for the raw mark */,
      label: {
        stops: {
          line: {
            length: 32,
          },
          number: {
            offsetY: 15,
          },
        },
        shape: {
          width: 42,
          height: 41.83,
          offsetY: 35,
        },
      },
    },
    /* "questions" is the general term for question items to be drawn in the profile */
    questions: {
      rect1: {
        width: 32,
        height: 28,
        br: 4,
      },
      rect2: {
        width: 811,
        height: 28,
        br: 4,
      },
      rect3: {
        width: 32,
        height: 130,
        br: 5,
      },
      rect4: {
        width: 382.5,
        height: 28,
        br: 4,
      },
      offsetX: 4,
      offsetY: 6,
      get distanceY() {
        return this.rect1.height + this.offsetY;
      },
      colors: ["#F4F4F5", "#F1F5F9"],
      choices: [
        { text: "الف", fill: "#71717A" },
        { text: "ب", fill: "#FBBF24" },
        { text: "ج", fill: "#FB923C" },
        { text: "د", fill: "#EF4444" },
        { text: "هـ", fill: "#B91C1C" },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels)
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    // Deconstructing the Spec of the Profile
    const { raw: rawSpec, questions: questionsSpec } = spec;

    // Separate Raw Data from the Dataset
    let rawData = dataset.score[0];

    // Separate Interpretation from the Dataset
    let interpret = dataset.score[1].mark;

    const questions = [
      dataset.questions.slice(0, 12).map((question, index) => ({
        number: index + 1,
        answer: {
          choice: questionsSpec.choices[question.user_answered - 1],
          text: question.answer.options[question.user_answered - 1],
        },
      })),
      dataset.questions.slice(12).map((question, index) => ({
        text: question.text,
        answer: question.user_answered - 1,
      })),
    ];

    const raw = {
      mark: rawData.mark,
      label: rawData.label,
      width: rawData.mark !== 0 ? (rawData.mark - 1) * rawSpec.widthCoeff + 45 : 0,
      interpret: rawSpec.interprets.find((interpretation) => interpretation.eng === interpret),
      stops: rawSpec.stops.map((stop) => ({
        mark: stop,
        width: (stop - 1) * rawSpec.widthCoeff + 45,
      })),
    };

    return [{ raw, questions }];
  }
}

module.exports = CADS93;
