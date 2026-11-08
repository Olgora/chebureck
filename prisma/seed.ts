import { prisma } from "@/lib/prisma";

async function main() {
  // 🧹 1. Очистка зависимых таблиц (в правильном порядке связей)
  await prisma.orderItemIngredient.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dailyStock.deleteMany();
  await prisma.productPromo.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.weeklyPromo.deleteMany();
  await prisma.coupon.deleteMany();

  // 🍔 2. Категории
  const food = await prisma.category.create({
    data: {
      name_pt: "CHEBUREKS",
      name_en: "CHEBUREKS",
    },
  });

  const drinks = await prisma.category.create({
    data: {
      name_pt: "BEBIDAS",
      name_en: "DRINKS",
    },
  });

  const cerveja = await prisma.category.create({
    data: {
      name_pt: "CERVEJA",
      name_en: "BEER",
    },
  });

  const mais = await prisma.category.create({
    data: {
      name_pt: "MAIS",
      name_en: "MORE",
    },
  });

  // 🧀 3. Дополнительные ингредиенты (топпинги)
  const cheese = await prisma.ingredient.create({
    data: {
      name_pt: "Extra Cheese",
      name_en: "Extra Cheese",
      price: 0.8,
      isAvailable: true,
    },
  });

  const jalapeno = await prisma.ingredient.create({
    data: {
      name_pt: "Extra jalapeno",
      name_en: "Extra jalapeno",
      price: 0.8,
      isAvailable: true,
    },
  });

  const garlicSauce = await prisma.ingredient.create({
    data: {
      name_pt: "Sun-dried tomatoes in aromatic olive oil",
      name_en: "Sun-dried tomatoes in aromatic olive oil",
      price: 0.8,
      isAvailable: true,
    },
  });

  const herbs = await prisma.ingredient.create({
    data: {
      name_pt: "extra mushroom",
      name_en: "extra mushroom",
      price: 0.8,
      isAvailable: true,
    },
  });

  // Общий список ингредиентов для мясных чебуреков
  const cheburekIngredients = [
    { id: cheese.id },
    { id: jalapeno.id },
    { id: garlicSauce.id },
    { id: herbs.id },
  ];

  // 🍟 4. Продукты
  const burek1 = await prisma.product.create({
    data: {
      name_pt: "LAMBburek",
      name_en: "LAMBburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Preparado com uma massa fina e crocante, dourada no ponto perfeito, este cheburek é recheado com suculenta carne de borrego, combinada com cebola fresca, coentros aromáticos e um toque simples de sal e pimenta que realça o sabor natural dos ingredientes. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender!",
      description_en:
        "Discover the authentic taste of our handcrafted cheburek — a beloved specialty enjoyed across many cultures. Made with thin, crispy dough fried to golden perfection, this cheburek is filled with juicy lamb, fresh onion, fragrant coriander, and a simple seasoning of salt and pepper that enhances the natural flavors of the ingredients. Each bite offers an irresistible balance of crispiness and juiciness, creating a rich and comforting street food experience full of flavor.Perfect for anyone looking for something genuine, satisfying, and delicious.Try it and be pleasantly surprised!",
      price: 6.5,
      categoryId: food.id,
      availableIngredients: {
        connect: cheburekIngredients,
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_1.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_3.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek2 = await prisma.product.create({
    data: {
      name_pt: "BEEFburek",
      name_en: "BEEFburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Feito com uma massa fina, crocante e dourada, este cheburek é recheado com vitela suculenta, cebola e especiarias aromáticas que realçam os sabores naturais dos ingredientes. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender! ",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty loved across many cultures. Made with thin, crispy dough, fried to a perfect golden finish, this cheburek is filled with juicy veal, onion, and aromatic spices that enhance the natural flavors of the ingredients. Each bite reveals an irresistible balance of crispiness and juiciness, offering a genuine Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, authentic, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.9,
      categoryId: food.id,
      availableIngredients: {
        connect: cheburekIngredients,
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_1.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_3.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek3 = await prisma.product.create({
    data: {
      name_pt: "CHICKENburek",
      name_en: "CHICKENburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Feito com uma massa fina, crocante e perfeitamente dourada, este cheburek é recheado com suculento peito de frango, alho moído, salsa aromática e um toque de especiarias para realçar os sabores naturais dos ingredientes. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender!",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. Made with thin, crispy dough, perfectly golden-fried, this cheburek is filled with juicy chicken breast, ground garlic, aromatic parsley, and a touch of spices that enhance the natural flavors of the ingredients. Each bite reveals an irresistible balance of crispiness and juiciness, offering an authentic Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, genuine, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.9,
      categoryId: food.id,
      availableIngredients: {
        connect: cheburekIngredients,
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_2.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_1.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek4 = await prisma.product.create({
    data: {
      name_pt: "PIZZAburek",
      name_en: "PIZZAburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Feito com uma massa fina, crocante e dourada, este cheburek é recheado com queijo mussarela cremoso, pepperoni italiano e tomates com ervas aromáticas que realçam os sabores naturais dos ingredientes. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender! ",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. Made with thin, crispy, golden-fried dough, this cheburek is filled with creamy mozzarella, Italian pepperoni, and tomatoes with aromatic herbs that enhance the natural flavors of the ingredients. Each bite reveals an irresistible balance of crispiness and juiciness, offering a genuine Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, authentic, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.9,
      categoryId: food.id,
      availableIngredients: {
        connect: [{ id: cheese.id }, { id: jalapeno.id }],
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_3.jpg",
            isThumbnail: true,
            position: 1,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_6.jpg",
            position: 2,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek5 = await prisma.product.create({
    data: {
      name_pt: "FISHburek",
      name_en: "FISHburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Este cheburek, cozido até formar uma crosta fina, crocante e dourada, é recheado com purê de batatas macio e bacalhau, manteiga, creme de leite e especiarias aromáticas que realçam os sabores naturais dos ingredientes. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender! ",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. This cheburek, fried to a thin, crispy, golden crust, is filled with soft mashed potatoes and cod, butter, sour cream, and aromatic spices that enhance the natural flavors of the ingredients. Each bite reveals an irresistible balance of crispiness and creaminess, offering a genuine Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, authentic, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.5,
      categoryId: food.id,
      availableIngredients: {
        connect: [{ id: garlicSauce.id }, { id: herbs.id }],
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_5.jpg",
            isThumbnail: true,
            position: 2,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_7.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek6 = await prisma.product.create({
    data: {
      name_pt: "CHEESEburek",
      name_en: "CHEESEburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Feito com uma massa fina, crocante e dourada, este cheburek é recheado com queijo mussarela cremoso. Sabor verdadeiramente cremoso. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender!",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. Made with thin, crispy, golden dough, this cheburek is filled with creamy mozzarella. A truly rich and creamy flavor. Each bite reveals an irresistible balance of crispiness and juiciness, offering an authentic Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, genuine, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.5,
      categoryId: food.id,
      availableIngredients: {
        connect: [{ id: jalapeno.id }, { id: garlicSauce.id }],
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_4.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_5.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek7 = await prisma.product.create({
    data: {
      name_pt: "MUSHburek",
      name_en: "MUSHburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Feito com uma massa fina, crocante e perfeitamente dourada, este cheburek é recheado com cogumelos e queijo mozzarella. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender! ",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. Made with thin, crispy, perfectly golden dough, this cheburek is filled with mushrooms and mozzarella cheese. Each bite reveals an irresistible balance of crispiness and juiciness, offering an authentic Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, genuine, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 5.5,
      categoryId: food.id,
      availableIngredients: {
        connect: [{ id: cheese.id }, { id: garlicSauce.id }],
      },
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_6.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_4.jpg",
            position: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  const burek8 = await prisma.product.create({
    data: {
      name_pt: "SWEETburek",
      name_en: "SWEETburek",
      description_pt:
        "Large pastel. Descubra o verdadeiro sabor da tradição eslava com o nosso cheburek artesanal — uma especialidade querida por diferentes povos. Este cheburek, feito com uma massa fina, crocante e perfeitamente dourada, é recheado com maçãs aromáticas e canela. Cada dentada revela um equilíbrio irresistível entre crocância e suculência, trazendo consigo uma experiência autêntica de comida de rua do Leste Europeu — rica, reconfortante e cheia de história. Perfeito para quem procura algo diferente, genuíno e cheio de sabor. Experimente e deixe-se surpreender! ",
      description_en:
        "Large pastry. Discover the authentic taste of Slavic tradition with our handmade cheburek — a specialty cherished by many cultures. Made with thin, crispy, perfectly golden dough, this cheburek is filled with aromatic apples and cinnamon. Each bite reveals an irresistible balance of crispiness and juiciness, offering an authentic Eastern European street food experience — rich, comforting, and full of history. Perfect for those looking for something different, genuine, and full of flavor. Try it and let yourself be pleasantly surprised!",
      price: 4.8,
      categoryId: food.id,
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_6.jpg",
            position: 2,
            isThumbnail: true,
          },
          {
            url: "https://yepp.fun/images/checkimg_55_2.jpg",
            isMain: true,
            position: 1,
          },
        ],
      },
    },
  });

  const lemonade = await prisma.product.create({
    data: {
      name_pt: "LIMONADA Da Casa",
      name_en: "LIMONADA Da Casa",
      description_pt: "Limonada fresca preparada diariamente.",
      description_en: "Fresh homemade lemonade prepared daily.",
      price: 2.3,
      categoryId: drinks.id,
      images: {
        create: [
          {
            url: "https://yepp.fun/images/checkimg_2_8.webp",
            isMain: true,
            isThumbnail: true,
          },
        ],
      },
    },
  });

  // 📦 5. Инициализация остатков на текущий день (DailyStock)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const chebureksList = [
    burek1,
    burek2,
    burek3,
    burek4,
    burek5,
    burek6,
    burek7,
    burek8,
  ];

  // Задаем по 40 штук каждого чебурека на сегодня
  for (const item of chebureksList) {
    await prisma.dailyStock.create({
      data: {
        productId: item.id,
        date: today,
        totalAmount: 40,
        available: 40,
      },
    });
  }

  // Напитки (например, 100 порций)
  await prisma.dailyStock.create({
    data: {
      productId: lemonade.id,
      date: today,
      totalAmount: 100,
      available: 100,
    },
  });

  // 👤 6. Тестовый клиент
  await prisma.customer.create({
    data: {
      name: "Иван Петров",
      phone: "+351912345678",
      email: "ivan@test.com",
    },
  });

  console.log("🌱 Seed completed successfully with ingredients & daily stock!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });