import { load } from 'cheerio';
import { z } from 'zod';

import type AddEditItem from '@/components/AddEditItem';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const crawlerRouter = createTRPCRouter({
  crawl: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (input.url.startsWith('https://www.amazon')) {
        return amazonProductCrawler(input.url);
      }

      if (input.url.startsWith('https://www.citadium.com')) {
        return citadiumProductCrawler(input.url);
      }

      return;
    }),
});

const amazonProductCrawler = async (
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

const citadiumProductCrawler = async (
  url: string,
): Promise<Parameters<typeof AddEditItem>['0']['item']> => {
  const $ = load(await fetch(url).then((res) => res.text()));

  const productTitle = $('main h1').first();
  const name = productTitle.text().trim();
  const priceString = productTitle.next().next().text().trim();
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
