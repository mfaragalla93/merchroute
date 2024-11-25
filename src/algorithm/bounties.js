import { markets } from "./nodes.js";

/**
 * Bounties that can be completed in the game
 * Data is referenced from: https://brightershoreswiki.org/w/Merchant
 *
 * Experience data is referenced from: https://brightershoreswiki.org/w/Merchant_Guild_Bounties_XP_%26_Values
 * Experience scales with level, and the formula is currently unknown.
 * So we are using the maximum values currently reported on the wiki (currently level 153)
 */
export const bounties = {
  CARROTS: {
    name: "Carrots",
    level: 0,
    exp: 3718,
    seller: markets.GREENGROCERS,
    buyer: markets.TOY_STALL,
  },
  SOAP: {
    name: "Soap",
    level: 0,
    exp: 3625,
    seller: markets.SOAP_SHOP,
    buyer: markets.BUTCHERS_STALL,
  },
  RIBS: {
    name: "Ribs",
    level: 2,
    exp: 2654,
    seller: markets.BUTCHERS_STALL,
    buyer: markets.SOUVENIR_STALL,
  },
  MEAT_WRAP: {
    name: "Meat Wrap",
    level: 4,
    exp: 2667,
    seller: markets.HALLIGS_STREET_FOOD,
    buyer: markets.CHEESE_SHOP,
  },
  BEEF_JOINT: {
    name: "Beef Joint",
    level: 6,
    exp: 2236,
    seller: markets.HENDERSONS_MEAT,
    buyer: markets.HALLIGS_STREET_FOOD,
  },
  CLOCKWORK_SHEEP: {
    name: "Clockwork Sheep",
    level: 8,
    exp: 2594,
    seller: markets.PENNYS_CLOCKWORK,
    buyer: markets.CLOCK_STALL,
  },
  PORCELAIN_DOLL: {
    name: "Porcelain Doll",
    level: 12,
    exp: 3296,
    seller: markets.TOY_STALL,
    buyer: markets.FORTUNEHOLD_FARM,
  },
  PLATES: {
    name: "Plates",
    level: 16,
    exp: 3364,
    seller: markets.HERMARS_HOMEWARE,
    buyer: markets.JENNALERS_WINES,
  },
  PIN_BADGE: {
    name: "Pin Badge",
    level: 23,
    exp: 2590,
    seller: markets.SOUVENIR_STALL,
    buyer: markets.VICTOR_T_CYCLOPS,
  },
  PUMPKIN: {
    name: "Pumpkin",
    level: 28,
    exp: 3574,
    seller: markets.FORTUNEHOLD_FARM,
    buyer: markets.VASE_STALL,
  },
  PIZZA: {
    name: "Pizza",
    level: 35,
    exp: 3804,
    seller: markets.CHEF,
    buyer: markets.FRANCESCAS_FRUIT_STALL,
  },
  BANANAS: {
    name: "Bananas",
    level: 40,
    exp: 3860,
    seller: markets.FRANCESCAS_FRUIT_STALL,
    buyer: markets.PENNYS_CLOCKWORK,
  },
  TIN_POCKET_WATCH: {
    name: "Tin Pocket Watch",
    level: 49,
    exp: 4220,
    seller: markets.SNILCHS_WATCHES,
    buyer: markets.BOGGS_ANTIQUES,
  },
  HOMESPUN_CLOTH: {
    name: "Homespun Cloth",
    level: 54,
    exp: 3030,
    seller: markets.TEXTILES_STALL,
    buyer: markets.CLOCK_STALL,
  },
  RAINBOW_CHEESE: {
    name: "Rainbow Cheese",
    level: 61,
    exp: 2852,
    seller: markets.CHEESE_SHOP,
    buyer: markets.HENDERSONS_MEAT,
  },
  ARGANIAN_WINE: {
    name: "Arganian Wine",
    level: 66,
    exp: 3796,
    seller: markets.JENNALERS_WINES,
    buyer: markets.VASE_STALL,
  },
  OAK_PATTERNED_VASE: {
    name: "Oak Patterned Vase",
    level: 75,
    exp: 2874,
    seller: markets.VASE_STALL,
    buyer: markets.HENDERSONS_MEAT,
  },
  SCENTED_CANDLE: {
    name: "Scented Candle",
    level: 80,
    exp: 3551,
    seller: markets.CANDICES_CANDLES,
    buyer: markets.SOAP_SHOP,
  },
  UNICORN_DUST: {
    exp: 3298,
    level: 87,
    name: "Unicorn Dust",
    seller: markets.VICTOR_T_CYCLOPS,
    buyer: markets.JANESSAS_DELICACIES,
  },
  LANDSCAPE_PAINTING: {
    exp: 3228,
    level: 92,
    name: "Landscape Painting",
    seller: markets.BERTS_GALLERY,
    buyer: markets.TOMMY_SHOES_WINES,
  },
  CARRIAGE_CLOCK: {
    level: 101,
    name: "Carriage Clock",
    seller: markets.CLOCK_STALL,
    buyer: markets.PENNYS_CLOCKWORK,
  },
  SPECTACLES: {
    level: 106,
    name: "Spectacles",
    seller: markets.MONOCLE_MARKET,
    buyer: markets.CANDICES_CANDLES,
  },
  SHARPSEED_WINE: {
    level: 113,
    name: "Sharpseed Wine",
    seller: markets.TOMMY_SHOES_WINES,
    buyer: markets.JANESSAS_DELICACIES,
  },
  RUG: {
    level: 118,
    name: "Rug",
    seller: markets.BOGGS_ANTIQUES,
    buyer: markets.HERMARS_HOMEWARE,
  },
  CAVIAR: {
    level: 127,
    name: "Caviar",
    seller: markets.JANESSAS_DELICACIES,
    buyer: markets.BOGGS_ANTIQUES,
  },
  BATH_SALTS: {
    level: 132,
    name: "Bath Salts",
    seller: markets.SOAP_SHOP,
    buyer: markets.MONOCLE_MARKET,
  },
  TOMATOES: {
    level: 139,
    name: "Tomatoes",
    seller: markets.GREENGROCERS,
    buyer: markets.CHEF,
  },
  STEAK: {
    level: 144,
    name: "Steak",
    seller: markets.BUTCHERS_STALL,
    buyer: markets.HALLIGS_STREET_FOOD,
  },
  BURGER: {
    level: 153,
    name: "Burger",
    seller: markets.HALLIGS_STREET_FOOD,
    buyer: markets.JENNALERS_WINES,
  },
  HAM_LEG: {
    level: 158,
    name: "Ham Leg",
    seller: markets.HENDERSONS_MEAT,
    buyer: markets.TOY_STALL,
  },
  CLOCKWORK_DRAGON: {
    level: 165,
    name: "Clockwork Dragon",
    seller: markets.PENNYS_CLOCKWORK,
    buyer: markets.CHEESE_SHOP,
  },
  SNOW_GLOBE: {
    level: 170,
    name: "Snow Globe",
    seller: markets.TOY_STALL,
    buyer: markets.TOMMY_SHOES_WINES,
  },
  CUPS: {
    level: 179,
    name: "Cups",
    seller: markets.HERMARS_HOMEWARE,
    buyer: markets.SOUVENIR_STALL,
  },
  POSTCARDS: {
    level: 184,
    name: "Postcards",
    seller: markets.SOUVENIR_STALL,
    buyer: markets.TEXTILES_STALL,
  },
  RHUBARB: {
    level: 191,
    name: "Rhubarb",
    seller: markets.FORTUNEHOLD_FARM,
    buyer: markets.SOAP_SHOP,
  },
  CURRY: {
    level: 196,
    name: "Curry",
    seller: markets.CHEF,
    buyer: markets.SNILCHS_WATCHES,
  },
  ORANGES: {
    level: 216,
    name: "Oranges",
    seller: markets.FRANCESCAS_FRUIT_STALL,
    buyer: markets.TEXTILES_STALL,
  },
};

/**
 * The status of a bounty
 *
 * NOT_STARTED: The item still needs to be purchased
 * IN_PROGRESS: The item has been purchased but not yet sold
 * COMPLETED: The item has been purchased
 */
export const BountyStatus = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};
