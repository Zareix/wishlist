import { load } from 'cheerio';

import type AddEditItem from '@/components/AddEditItem';

export const amazonProductCrawler = async (
  url: string,
): Promise<Parameters<typeof AddEditItem>['0']['item']> => {
  const $ = load(await fetch(url).then((res) => res.text()));

  const productTitle = $('#productTitle').text().trim();
  const priceString = $('#corePrice_feature_div .a-price .a-offscreen')
    .first()
    .text()
    .trim();
  const imgUrl = $('#imgTagWrapperId > img').attr('src');
  const images = $('#aplus_feature_div img')
    .map((_, el) => ({
      image: $(el).attr('data-src'),
    }))
    .get()
    .filter((img) => img.image)
    .map(
      (img) =>
        img as {
          image: string;
        },
    );
  if (imgUrl) {
    images.unshift({
      image: imgUrl,
    });
  }
  const price = priceString
    ? parseFloat(priceString.replace(',', '.').replace(/[$€£]/g, ''))
    : 0;

  return {
    name: productTitle,
    price,
    links: [
      {
        name: 'Amazon',
        link: url,
        price,
      },
    ],
    images,
  };
};

export const citadiumProductCrawler = async (
  url: string,
): Promise<Parameters<typeof AddEditItem>['0']['item']> => {
  const $ = load(await fetch(url).then((res) => res.text()));

  const productTitle = $('main h1').first();
  const name = productTitle.text().trim();
  const priceString = productTitle.next().text().trim();
  console.log('price', priceString);

  const price = priceString
    ? parseFloat(priceString.replace(',', '.').replace(/[$€£]/g, ''))
    : 0;
  const images = $('.swiper-container-fiche-produit img')
    .map((_, el) => ({
      image: $(el).attr('data-src'),
    }))
    .get()
    .filter((img) => img.image)
    .map(
      (img) =>
        img as {
          image: string;
        },
    );

  return {
    name,
    price,
    links: [
      {
        name: 'Citadium',
        link: url,
        price,
      },
    ],
    images,
  };
};
