exports.handler = async (event) => {
  try {
    const inputs = JSON.parse(event.body);

    // VALIDACIJA
    const required = ['b3', 'b7', 'b8', 'b9', 'b10', 'h2'];
    for (let field of required) {
      if (!inputs[field] || isNaN(inputs[field])) throw new Error('Obavezno polje nije ispravno.');
    }
    if (inputs.b10 === 0) throw new Error('Broj godina ne može biti 0.');
    if (inputs.h2 === 0) throw new Error('Kurs ne može biti 0.');

    // TROŠAK GUMA
    const h3 = calculateTiresCost(inputs);

    // UKUPNI TROŠAK
    const b23 = calculateTotalCost(inputs, h3);

    // OSTALO
    const b24 = b23 / inputs.b10;
    const b25 = b24 / 12;
    const b26 = (b23 * inputs.h2) / (inputs.b10 * inputs.b7);

    return {
      statusCode: 200,
      body: JSON.stringify({ b23, b24, b25, b26 })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function calculateTiresCost(inputs) {
  const { b10, b12, b13, i2, j2, k2, l2, b7 } = inputs;
  if (b12 === 1) {
    const numSets = Math.max(Math.floor((b10 * b7) / i2), Math.floor(b10 / j2));
    return b13 * numSets + k2 * numSets;
  } else {
    const numSets = Math.max(Math.floor((b10 * b7) / l2), Math.floor(b10 / j2));
    return b13 * 2 * numSets + b10 * 2 * k2;
  }
}

function calculateTotalCost(inputs, h3) {
  const {
    b3, b4, b5, b6, b7, b8, b9, b10, b11, b14, b15, b16, b17,
    b18, b19, b20, b21, h2, m2
  } = inputs;

  const initialPrice = b3;
  const initialInvestment = b4;
  const annualMaintenance = b5 * b10;
  const annualRegistration = b6 * b10;
  const fuelCost = ((b7 / 100) * b8 * (b9 / h2)) * b10;
  const kaskoInsurance = (b11 / h2) * b10;
  const parkingCost = (b14 / h2) * b10;
  const tollsCost = (b15 / h2) * b10;
  const finesCost = (b16 / h2) * b10;
  const washingCost = (b17 / h2) * b10;
  const creditInterest = b18;
  const garageRent = b19;
  const tiresCostEur = h3 / h2;
  const majorService = b20 * Math.floor(b10 / m2);
  const carValueAfter = -b21;

  return initialPrice + initialInvestment + annualMaintenance +
         annualRegistration + fuelCost + kaskoInsurance +
         parkingCost + tollsCost + finesCost + washingCost +
         creditInterest + garageRent + tiresCostEur + majorService + carValueAfter;
}
