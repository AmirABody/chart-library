const { Profile, FS } = require("../Profile");

class STAIY93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "trait", fr: "رگه اضطراب" },
    L2: { eng: "state", fr: "حالت اضطراب" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه حالت - رگه اضطراب اسپیلبرگر" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 550 + 2 * this.padding.x,
          height: 476 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 70,
        y: 70,
      },
    },
    /* "items" is the general term used for independent data elements to be drawn in the profile */
    items: {
      rect: {
        width: 180 /* Width of label rectangle */,
        height: 42 /* Height of label rectangle */,
        br: 10 /* Border radius of label rectangle */,
        offsetX: 190 /* Horizontal offset between label rectangles */,
        offsetY: 84 /* Vetical offset between label rectangles and items */,
        get distanceY() {
          return this.height + this.offsetY;
        },
      },
      offsetX: 2 /* Horizontal offset between two items element */,
      minValue: 20 /* Minimum value of items data element */,
      maxValue: 80 /* Maximum value of items data element */,
      get range() {
        return this.maxValue - this.minValue;
      },
      trait: {
        stops: [20, 34, 45, 56, 80],
        fill: "#581C87",
        circle: {
          R: 175 /* Radius of the outer circle of the items element */,
          r: 130 /* Radius of the inner circle of the items element */,
          brs: {
            tl: 0 /* Top left border radius */,
            bl: 0 /* Bottom left border radius */,
            tr: 0 /* Top right border radius */,
            br: 0 /* Bottom right border radius */,
          } /* Border radiuses at each end of the gauge of the items element */,
          angles: {
            start: FS.toRadians(-90),
            end: FS.toRadians(90),
          } /* Angles of each end of the items element */,
          direction: false /* Clockwise direction for the items gauge element */,
        },
      },
      state: {
        stops: [20, 30, 42, 53, 80],
        fill: "#BE185D",
        circle: {
          R: 175 /* Radius of the outer circle of the items element */,
          r: 130 /* Radius of the inner circle of the items element */,
          brs: {
            tl: 0 /* Top left border radius */,
            bl: 0 /* Bottom left border radius */,
            tr: 0 /* Top right border radius */,
            br: 0 /* Bottom right border radius */,
          } /* Border radiuses at each end of the gauge of the items element */,
          angles: {
            start: FS.toRadians(-90),
            end: FS.toRadians(90),
          } /* Angles of each end of the items element */,
          direction: true /* Clockwise direction for the items gauge element */,
        },
      },
      interprets: [
        { opacity: 0.4, eng: "none", fr: "هیچ یا کمترین حد" },
        { opacity: 0.6, eng: "mild", fr: "خفیف" },
        { opacity: 0.8, eng: "moderate", fr: "متوسط" },
        { opacity: 1, eng: "severe", fr: "شدید" },
      ],
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
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
    const { items: itemsSpec } = spec;

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      angle: this._markToAngle(
        data.mark.value,
        itemsSpec.minValue,
        itemsSpec.maxValue,
        itemsSpec[data.label.eng].circle.angles,
        itemsSpec[data.label.eng].circle.direction
      ),
      stops: itemsSpec[data.label.eng].stops.map((stop) => ({
        mark: stop,
        angle: this._markToAngle(
          stop,
          itemsSpec.minValue,
          itemsSpec.maxValue,
          itemsSpec[data.label.eng].circle.angles,
          itemsSpec[data.label.eng].circle.direction
        ),
      })),
    }));

    return [{ items }];
  }

  _markToAngle(mark, min, max, angles, direction) {
    const totalAngle = this._calcDiffAngle(angles.end, angles.start, direction);
    const deltaTheta = ((mark - min) / (max - min)) * totalAngle;
    return this._calcDistAngle(deltaTheta, angles.start, direction);
  }

  _calcDiffAngle(theta, theta0, direction) {
    return direction ? 2 * Math.PI - (theta - theta0) : theta - theta0;
  }

  _calcDistAngle(deltaTheta, theta0, direction) {
    return direction ? 2 * Math.PI - deltaTheta + theta0 : deltaTheta + theta0;
  }
}

module.exports = STAIY93;
