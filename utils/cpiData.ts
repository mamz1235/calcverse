
// US CPI-U Annual Averages (1950-2024)
// Source: Bureau of Labor Statistics
export const CPI_DATA: Record<number, number> = {
  1950: 24.1, 1951: 26.0, 1952: 26.5, 1953: 26.7, 1954: 26.9, 
  1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1,
  1960: 29.6, 1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31.0, 
  1965: 31.5, 1966: 32.4, 1967: 33.4, 1968: 34.8, 1969: 36.7,
  1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3, 
  1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6,
  1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9, 
  1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0,
  1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 
  1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6,
  2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 
  2005: 195.3, 2006: 201.6, 2007: 207.3, 2008: 215.3, 2009: 214.5,
  2010: 218.1, 2011: 224.9, 2012: 229.6, 2013: 233.0, 2014: 236.7, 
  2015: 237.0, 2016: 240.0, 2017: 245.1, 2018: 251.1, 2019: 255.7,
  2020: 258.8, 2021: 270.9, 2022: 292.7, 2023: 304.7, 2024: 314.1
};

export interface HistoricalItem {
  item: string;
  price: number;
  image?: string; // Could add icons/images later
}

// Representative prices for various years
export const FUN_FACTS: Record<number, HistoricalItem[]> = {
  1950: [
    { item: "New House", price: 7354 },
    { item: "New Car", price: 1510 },
    { item: "Gallon of Gas", price: 0.18 },
    { item: "Loaf of Bread", price: 0.14 },
    { item: "Movie Ticket", price: 0.46 }
  ],
  1955: [
    { item: "New House", price: 10950 },
    { item: "New Car", price: 1900 },
    { item: "Gallon of Gas", price: 0.23 },
    { item: "Minimum Wage (Hr)", price: 0.75 }
  ],
  1960: [
    { item: "New House", price: 12700 },
    { item: "New Car", price: 2600 },
    { item: "Gallon of Gas", price: 0.25 },
    { item: "Men's Suit", price: 50 }
  ],
  1965: [
    { item: "New House", price: 21500 },
    { item: "Ford Mustang", price: 2427 },
    { item: "Gallon of Milk", price: 0.95 }
  ],
  1970: [
    { item: "New House", price: 23450 },
    { item: "New Car", price: 3570 },
    { item: "Movie Ticket", price: 1.55 }
  ],
  1975: [
    { item: "New House", price: 39300 },
    { item: "Microwave Oven", price: 400 },
    { item: "Gallon of Gas", price: 0.57 }
  ],
  1980: [
    { item: "New House", price: 68700 },
    { item: "New Car", price: 7200 },
    { item: "Gallon of Milk", price: 1.60 }
  ],
  1985: [
    { item: "New House", price: 84300 },
    { item: "Nintendo NES", price: 199 },
    { item: "Movie Ticket", price: 3.55 }
  ],
  1990: [
    { item: "New House", price: 123000 },
    { item: "New Car", price: 16000 },
    { item: "Gallon of Gas", price: 1.16 }
  ],
  1995: [
    { item: "New House", price: 133900 },
    { item: "Sony PlayStation", price: 299 },
    { item: "Avg Rent", price: 550 }
  ],
  2000: [
    { item: "New House", price: 165300 },
    { item: "New Car", price: 21850 },
    { item: "Movie Ticket", price: 5.39 }
  ],
  2005: [
    { item: "New House", price: 297000 },
    { item: "Xbox 360", price: 399 },
    { item: "Gallon of Gas", price: 2.30 }
  ],
  2010: [
    { item: "New House", price: 221800 },
    { item: "iPad (1st Gen)", price: 499 },
    { item: "Movie Ticket", price: 7.89 }
  ],
  2015: [
    { item: "New House", price: 289500 },
    { item: "Netflix (Mo)", price: 10 },
    { item: "New Car", price: 33560 }
  ],
  2020: [
    { item: "New House", price: 391900 },
    { item: "iPhone 12", price: 799 },
    { item: "New Car", price: 39500 }
  ]
};
