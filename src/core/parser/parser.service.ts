import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import puppeteer from 'puppeteer';
import { IAbiturient } from '../DTO/IAbiturient';

@Injectable()
export class HtmlParserService {
  constructor(private readonly httpService: HttpService) {}

  async fetchHtml(url: string, SNILS: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }); // Ждём, пока страница полностью загрузится

    await page.type('#searchBox', SNILS);

    const content = await page.content(); // Получаем HTML содержимое
    await browser.close();
    return content;
  }

  parseSuperList(html: string, find_SNILS: string) {
    const $ = cheerio.load(html);
    let abiturient: IAbiturient | null = null;
    $('.tabulator-row').each((i, row) => {
      const cells = $(row).find('.tabulator-cell');

      const getValue = (num: number) => {
        return cells.eq(num).text();
      };
      const number = getValue(0);
      const placeWithoutOrigs = getValue(1);
      const placeWithOrigs = getValue(2);
      const SNILS = getValue(3);
      const prioritet = getValue(4);
      const orig = getValue(5);
      const EGE = getValue(6);
      const ID = getValue(7);
      const objaga = getValue(8);
      const VUZs = getValue(12).split('<br>');

      if (SNILS === find_SNILS) {
        abiturient = {
          number,
          placeWithoutOrigs,
          placeWithOrigs,
          SNILS,
          prioritet,
          orig,
          EGE,
          ID,
          objaga,
          VUZs,
        };
      }
    });

    return abiturient;
  }
}
