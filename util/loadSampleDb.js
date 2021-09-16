require("dotenv").config();

const async = require("async");
const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");

const mongoose = require("mongoose");
const mongoDB = process.env.DB_URL;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let whiskies = [];
let categories = [];
let distilleries = [];

const categoryCreate = (name, description, callback) => {
  const category = new Category();
  category.name = name;
  category.description = description;

  category.save((err) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(`added category: ${category.name}`);
    categories.push(category);
    callback(null, category);
  });
};

const distilleryCreate = (name, location, callback) => {
  const distillery = new Distillery();
  distillery.name = name;
  distillery.location = location;

  distillery.save((err) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(`added distillery: ${distillery.name}`);
    distilleries.push(distillery);
    callback(null, distillery);
  });
};

const whiskyCreate = (
  name,
  description,
  price,
  stockQuantity,
  imgUrl,
  category,
  distillery,
  callback
) => {
  const whisky = new Whisky();
  whisky.name = name;
  whisky.description = description;
  whisky.price = price;
  whisky.stockQuantity = stockQuantity;
  whisky.imgUrl = imgUrl;
  whisky.category = category;
  whisky.distillery = distillery;

  whisky.save((err) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(`added whisky: ${whisky.name}`);
    whiskies.push(whisky);
    callback(null, whisky);
  });
};

const createCategories = (callback) => {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Rye",
          "A type of whisky Made from mostly rye grain. Popular in Canada.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Bourbon",
          "A type of whisky Made from mostly corn. Typically made in Southern USA.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Scotch",
          "A type of whisky Made from mostly barley but not always. Made in Scotland.",
          callback
        );
      },
    ],
    callback
  );
};

const createDistilleries = (callback) => {
  async.series(
    [
      function (callback) {
        distilleryCreate("Laphroaig", "Islay, Scotland", callback);
      },
      function (callback) {
        distilleryCreate("Ardbeg", "Islay, Scotland", callback);
      },
      function (callback) {
        distilleryCreate("Buffalo Trace", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Knob Creek", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Blanton's", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Breckenbridge", "Colorado, USA", callback);
      },
      function (callback) {
        distilleryCreate("Barton 1792", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Bulleit Distilling", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Heaven Hill", "Kentucky, USA", callback);
      },
      function (callback) {
        distilleryCreate("Hiram Walker", "Ontario, Canada", callback);
      },
    ],
    callback
  );
};

// can run this one parrallel since order of input doesn't matter for this model
const createWhiskies = (callback) => {
  async.parallel(
    [
      function (callback) {
        whiskyCreate(
          "Laphroaig Select Islay Single Malt Scotch Whisky",
          "A blend of several casks including Oloroso sherry butts, white American oak, Pedro Ximenez, and seasoned hogshead lend a complex character to this flavourful whisky. Classic medicinal notes interplay with citrus and dark chocolate; offering nuanced notes of peat smoke, lemon and green apple on a rich/viscous palate.",
          69.95,
          24,
          "https://www.lcbo.com/content/dam/lcbo/products/478222.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[0],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Laphroaig 10 Year Old Islay Single Malt Scotch Whisky",
          "Distilled in the same way since its inception over 75 years ago, this ten-year-old pours a brilliant gold colour; smoky aromas fill the glass along with some seaweed and medicinal notes and just a hint of sweetness; full rounded mouthfeel with inviting sweetness, hints of sea salt and lingering peatiness on the finish.",
          81.95,
          12,
          "https://www.lcbo.com/content/dam/lcbo/products/248997.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[0],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Laphroaig Quarter Cask Islay Single Malt Scotch Whisky",
          "Double matured in American oak barrels; glistening gold colour in the glass, with lively aromas of peat smoke, vanilla, coconut and banana; the increased oak contact creates a soft velvety mouthfeel that is complemented by distinctive peatiness, followed by smoke and soft sweetness leading to a long drying finish.",
          89.95,
          8,
          "https://www.lcbo.com/content/dam/lcbo/products/019158.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[0],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Laphroaig 25YO Cask Strength",
          "Awarded the title Best Cask Strength Single Malt at the International Wine and Spirits Competition. Boasts aromas and flavours of smoke, iodine, dried fruit and spiced nut, followed by tar, sherry, citrus peel and seaweed. Full and rich on the palate with a long smoky/spicy finish. Enjoy neat or with a splash of water.",
          659.65,
          2,
          "https://www.lcbo.com/content/dam/lcbo/products/010235.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[0],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Ardbeg Wee Beastie 5 Year Old Whisky",
          "This, the youngest and feistiest Ardbeg offering, is aged in ex-bourbon and sherry cask before being unleashed. It has untamed aroma and flavours of peat, pine nut, herb and wood smoke with bacon and pepper elements. The palate is full and bold with notes of brine, chocolate, smoke and tar. Serve over ice or in a cocktail.",
          77.25,
          18,
          "https://www.lcbo.com/content/dam/lcbo/products/018828.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[1],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Ardbeg 10 Year Old Islay Scotch Whisky",
          "Revered for its balanced smoke and fruit character. Shows aromas of lemon, smoke, peat and brine with a kiss of sweet cereal. On the palate, it is warm and smoky with bold, yet balanced flavours, that resonate with the aromas. The finish is long sweet and smoky. Serve neat or with a few drops of pure water.",
          101.75,
          8,
          "https://www.lcbo.com/content/dam/lcbo/products/560474.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[1],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Ardbeg Corryvreckan Islay Single Malt Scotch Whisky",
          "Corryvreckan takes its name from a famous tidal whirlpool that lies to the north of Islay. It was created with the input of the Ardbeg Committee; a group of 120,000 from all over the world that love the products of the distillery. Expect an intense nose of cedar, brine, creosote, with caramel, smoky bacon, vanilla and clove. Very complex aromas. The palate is also intense but it is round and finely balanced with outstanding length. The lingering finish shows smoky black tarry coffee with chocolate. Not for the fainthearted. Score - 94. (Steve Thurlow, winealign.com, Nov. 24, 2019)",
          201.4,
          3,
          "https://www.lcbo.com/content/dam/lcbo/products/211730.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[2],
          distilleries[1],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Buffalo Trace Kentucky Straight Bourbon Whiskey",
          "Clear golden amber colour; floral, caramel, vanilla and citrus aromas; rich, elegant caramel and spice flavours; well balanced",
          42.05,
          24,
          "https://www.lcbo.com/content/dam/lcbo/products/605063.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[2],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Knob Creek Bourbon",
          "Handcrafted in limited quantities, this whisky pours a brilliant golden amber colour. The nose is fragrant with aromas of caramel, vanilla and a touch of sweet apricot; on the rich and full-bodied palate look for flavours of caramel followed by sweet oak spice on the long and flavourful finish.",
          49.95,
          21,
          "https://www.lcbo.com/content/dam/lcbo/products/326009.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[3],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Knob Creek Single Barrel",
          "Bright medium copper; aromas of toffee, honey, dried apricots and candied ginger; warming alcohol, medium body, with a finish of caramel and spice.",
          59.95,
          15,
          "https://www.lcbo.com/content/dam/lcbo/products/255232.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[3],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Blanton's Original Bourbon",
          "Medium amber colour; sweet new vanilla and caramel oak aromas and flavours",
          69.25,
          8,
          "https://www.lcbo.com/content/dam/lcbo/products/255349.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[4],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Breckenridge Bourbon",
          "Located in Breckenbridge, Colorado, this bourbon is distilled using corn, rye and un-malted barley. Clear amber in colour it jumps out with aromas of dried fig, vanilla, caramel and candied orange peel. The palate is full-bodied and smooth with flavours of caramel, spice, and honey leading to a long finish.",
          69.95,
          17,
          "https://www.lcbo.com/content/dam/lcbo/products/544130.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[5],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "1792 Small Batch Kentucky Straight Bourbon",
          "The distillery was named 1792, the year in which Kentucky became a state. A gold medal winner at the 2018 International Spirits Challenge, it pours deep amber with aromas of apple, citrus, toffee, vanilla, coffee and spice. Palate is full-bodied and rich, with notes of maple syrup, apricot and sweet oak the long finish.",
          49.95,
          14,
          "https://www.lcbo.com/content/dam/lcbo/products/208918.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[6],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Bulleit Bourbon Frontier Whiskey",
          "High rye concentration and limestone filtration along with highly charred barrels give this whisky a clear golden amber colour and aromas of rich toffee, roasted grain, spice and smoky oak notes. The palate is full body and smooth with flavours of vanilla, apple, sweet spice and smoky oak followed by a long finish.",
          41.45,
          20,
          "https://www.lcbo.com/content/dam/lcbo/products/054866.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[1],
          distilleries[7],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Rittenhouse Straight Rye Whisky 100 Bottled In Bond",
          "Produced in the tradition of the classic Pennsylvania or 'Monongahela' rye whiskeys this pours light amber and is perfumed with sweet corn, vanilla, brown sugar and spice aromas. The flavours match aromas with additional floral and spice present in the background and repeating on the long smooth finish.",
          49.95,
          12,
          "https://www.lcbo.com/content/dam/lcbo/products/230813.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[0],
          distilleries[8],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Bulleit Small Batch Rye Whiskey",
          "This small-batch, 95% rye whiskey pours a deep amber colour and offers pronounced aromas of toasted oak, spices, orange peel and vanilla. The palate is smooth with flavours of orange peel, peppery spice and herbs lingering on the finish. Serve over ice, or superb in a classic Manhattan.",
          41.45,
          20,
          "https://www.lcbo.com/content/dam/lcbo/products/350611.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[0],
          distilleries[7],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Knob Creek Rye",
          "A burnished copper colour, with deep copper highlights; on the nose, hints of spicy rye grain, chocolate and orange zest; on the palate, a round, viscous mouthfeel, medium body, and forward spicy, toasted oak, chocolate and citrus flavours; the finish is medium in length, with sweetness giving way to elegant dryness.",
          49.9,
          16,
          "https://www.lcbo.com/content/dam/lcbo/products/348235.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[0],
          distilleries[3],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Lot No.40 Dark Oak Canadian Whisky",
          "This whisky is finished in heavily charred barrels, giving it its deep amber colour. Expect aromas and flavours of caramel, vanilla, apricot, baking spice, and a hint of floral notes. It's full-bodied and fruity with a long-lasting finish. Enjoy neat alongside whisky-brushed ribs or pair it with dark chocolate cake.",
          60.1,
          15,
          "https://www.lcbo.com/content/dam/lcbo/products/019563.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[0],
          distilleries[9],
          callback
        );
      },
      function (callback) {
        whiskyCreate(
          "Lot No. 40 Single Copper Pot Still Canadian Whisky",
          "Two-time winner of the Canadian Whisky of the Year award. Made from 100% rye, pot-distilled and aged in new oak casks. Shows bold aromas and flavours of dark fruit, baking spice, vanilla and toffee with floral notes. The palate is smooth with dried fruit and spice on the finish. Enjoy neat, over ice or pair with chocolate.",
          39.95,
          24,
          "https://www.lcbo.com/content/dam/lcbo/products/382861.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
          categories[0],
          distilleries[9],
          callback
        );
      },
    ],
    callback
  );
};

async function dropDatabase(callback) {
  await db.dropDatabase();
  callback();
}

async function loadDatabase() {
  await async.series(
    [createCategories, createDistilleries, createWhiskies],
    function (err) {
      if (err) {
        console.log("Final Err: " + err);
      } else {
        console.log("Success: Data added");
      }
      // mongoose.connection.close();
    }
  );
}

async function resetDb() {
  // clear out database and then fill with sample data
  await dropDatabase(loadDatabase);
}

module.exports = resetDb;

// to call direct uncomment below line and run node loadSampleDb
// resetDb();
