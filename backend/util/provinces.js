const provinces = ["Keski-Suomi", "Etelä-Pohjanmaa", "Pohjanmaa", "Satakunta", "Pirkanmaa", "Uusimaa", "Varsinais-Suomi", "Kanta-Häme", "Päijät-Häme", "Kymenlaakso", "Etelä-Karjala", "Etelä-Savo", "Pohjois-Savo", "Pohjois-Karjala", "Kainuu", "Keski-Pohjanmaa", "Pohjois-Pohjanmaa", "Lappi"];
const subareas = {
  "Länsi-Suomi": ["Keski-Suomi", "Etelä-Pohjanmaa", "Pohjanmaa", "Satakunta", "Pirkanmaa"],
  "Helsinki-Uusimaa": ["Uusimaa"],
  "Etelä-Suomi": ["Varsinais-Suomi", "Kanta-Häme", "Päijät-Häme", "Kymenlaakso", "Etelä-Karjala"],
  "Pohjois- ja Itä-Suomi": ["Etelä-Savo", "Pohjois-Savo", "Pohjois-Karjala", "Kainuu", "Keski-Pohjanmaa", "Pohjois-Pohjanmaa", "Lappi"],
};

const subAreaOf = (province) => {
  for (const [key, value] of Object.entries(subareas)) {
    if (value.includes(province)) return key;
  }
  return "";
};

module.exports = { provinces, subAreaOf };
