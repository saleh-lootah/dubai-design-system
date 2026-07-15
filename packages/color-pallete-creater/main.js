const chroma = require("chroma-js");

const varlabels = [
  "--dda-color-primary-0",
  "--dda-color-primary-4",
  "--dda-color-primary-5",
  "--dda-color-primary-6",
  "--dda-color-primary-10",
  "--dda-color-primary-12",
  "--dda-color-primary-17",
  "--dda-color-primary-20",
  "--dda-color-primary-22",
  "--dda-color-primary-24",
  "--dda-color-primary-25",
  "--dda-color-primary-30",
  "--dda-color-primary-35",
  "--dda-color-primary-40",
  "--dda-color-primary-50",
  "--dda-color-primary-60",
  "--dda-color-primary-70",
  "--dda-color-primary-80",
  "--dda-color-primary-87",
  "--dda-color-primary-90",
  "--dda-color-primary-92",
  "--dda-color-primary-94",
  "--dda-color-primary-95",
  "--dda-color-primary-96",
  "--dda-color-primary-98",
  "--dda-color-primary-99",
  "--dda-color-primary-100",
];

// Function to generate a color spectrum from darkest to lightest
function generateColorSpectrum(primaryColor) {
  // Define the number of steps for darker and lighter shades
  const numSteps = 13;

  // Generate darker shades
  const darkerShades = chroma
    .scale([chroma(primaryColor).darken(5), primaryColor])
    .mode("lab")
    .colors(numSteps);

  // Generate lighter shades
  var lighterShades = chroma
    .scale([chroma(primaryColor).brighten(5), primaryColor])
    .mode("lab")
    .colors(numSteps);

  lighterShades.reverse();

  // Combine darker and lighter shades
  return [...darkerShades, primaryColor, ...lighterShades];
}

async function RunAPI(req, res) {
  var QParams = req.query | {};
  console.log(req.query)
  // Example usage
  var primaryColor = "#1C308A"; // Material Design's indigo 500
  // console.log(QParams);
  // if (!!QParams && !!QParams.color) {
  //   primaryColor = QParams.color;
  // }

  const colorSpectrum = generateColorSpectrum(primaryColor);
  var spectrumNames = [];

  // Print the generated color spectrum
  console.log("Generated Color Spectrum:");
  colorSpectrum.forEach((color, index) => {
    // console.log(`background: ${color};`);
    spectrumNames.push(varlabels[index] + " : " + color);
    console.log(varlabels[index] + " : " + color + ";");
  });

  res.send({
    Status: 200,
    Result: spectrumNames,
  });

  // spectrumNames.forEach
}

module.exports = RunAPI;
