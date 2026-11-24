export const restaurant = {
  name: "Sün Balázs Étterem - Menü",
  title: "Heti Menü kínálat",
  dateRange: "November 23-27.",
  orderPhone: "06 70 67 67 67 6",
  orderFrom: "Reggel 8:00 órától",
  pickupFrom: "11:00 órától lehetséges",
  address: "Budapest, Szőlő utca 13.",
  greeting: "Jó étvágyat",
};
export const priceTable = {
  soup: 1100,
  mainA: 1900,
  mainB: 2100,
  mainHeti: 2300,
  menuA: 2400,
  menuB: 2900,
  menuHeti: 2700,
  pickle: 350,
  packaging: 150,
};
export const formatFt = (n) => `${n.toLocaleString("hu-HU")} Ft`;
const heti = "Rántottsajt jázminrizs, tartár";
export const days = [
  {
    nap: "Hétfő",
    leves: "Karfiolleves",
    a: "Császármorzsa barackíz",
    b: "Lecsósszelet tarhonya",
    heti,
  },
  {
    nap: "Kedd",
    leves: "Sajtkrémleves piritott zsemlekocka",
    a: "Tepsis mákosguba",
    b: "Csirkemellborzaska amerikai káposztasaláta",
    heti,
  },
  {
    nap: "Szerda",
    leves: "Nyírségi gombócleves",
    a: "Eperlekváros gombóc",
    b: "Sültoldalas hagymás-törtburgonya",
    heti,
  },
  {
    nap: "Csütörtök",
    leves: "Májgombócleves",
    a: "Máglyarakás",
    b: "Bácskai rizseshús",
    heti,
  },
  {
    nap: "Péntek",
    leves: "Gulyásleves",
    a: "Hortobágyi húsospalacsinta",
    b: "Sült csirkecomb hasáb, lilakáposzta püré",
    heti,
  },
];
export const prices = {
  left: [
    { label: "Csak leves", price: priceTable.soup },
    { label: 'Csak főétel "A"', price: priceTable.mainA },
    { label: 'Csak főétel "B"', price: priceTable.mainB },
    { label: "Heti menü (Csak Főétel)", price: priceTable.mainHeti },
  ],
  right: [
    { label: "Teljes A-menü (Leves+Főétel)", price: priceTable.menuA },
    { label: "Teljes B-menü (Leves + Főétel)", price: priceTable.menuB },
    { label: "Teljes heti menü (Leves+Főétel)", price: priceTable.menuHeti },
    { label: "Savanyúság", price: priceTable.pickle },
    { label: "Csomagolás", price: priceTable.packaging, suffix: "Ft/db" },
  ],
};
