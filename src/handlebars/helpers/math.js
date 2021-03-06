// math Helper
// Implements Arithmetic Operations in Handlebars

function math(lvalue, operator, rvalue, options) {
  if (arguments.length < 4) {
    // Operator omitted, assuming "+"
    options = rvalue;
    rvalue = operator;
    operator = "+";
  }

  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue,
  }[operator];
}

module.exports = math;
