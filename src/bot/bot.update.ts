import { Injectable } from '@nestjs/common';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { HtmlParserService } from 'src/core/parser/parser.service';
import { Context, Scenes } from 'telegraf';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(private htmlParserService: HtmlParserService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      `Привет! Здесь ты можешь посмотреть свое место в каждом поданном ВУЗе? Круто? Круто!
Вводи /snils и кайфуй дико`,
    );
  }

  @Command('snils')
  async onGetCnils(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Напиши свой СНИЛС в формате: XXXXXXXXXXX');
  }

  @On('text')
  async onSNILS(@Ctx() ctx: Scenes.SceneContext) {
    const SNILS = ctx.text;

    if (SNILS.length === 8 && Number.isInteger(Number(SNILS))) {
      return await ctx.reply(
        `Это либо СНИЛС не того формата, либо вообще не СНИЛС!!!`,
      );
    }

    const { message_id } = await ctx.reply('Идет загрузка списков 🕘');
    const html = await this.htmlParserService.fetchHtml(
      'https://list.mai.freenet.ru/knipm.html',
      SNILS,
    );

    const abiturient = this.htmlParserService.parseSuperList(html, SNILS);

    const editMessage = async (text: string) => {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        message_id,
        undefined,
        text,
      );
    };

    if (!abiturient) {
      await editMessage(`Простите, но вас нет в наших списках(
Попроуйте сами пж`);
    } else {
      await editMessage(`Ваши данные:
Номер: ${abiturient.number}
Место если подадите и никто не подаст: ${abiturient.placeWithoutOrigs} ${Number(abiturient.placeWithoutOrigs) <= 15 ? '📈' : ''}
Место если подадите и все подадут: ${abiturient.placeWithOrigs}
Ваш СНИЛС: ${abiturient.SNILS}
Приоритет: ${abiturient.prioritet}
Аттестат: ${abiturient.orig} ${abiturient.orig === 'Оригинал' ? '✅' : '❌'}
Баллы с ИД: ${abiturient.EGE}
ИД: ${abiturient.ID}
Общежитие: ${abiturient.objaga}
Все ВУЗЫ: ${abiturient.VUZs.map((VUZ) => `\n${VUZ} ${VUZ.includes('МАИ') ? '📈' : VUZ.includes('МИРЭА') ? '📉' : ''}`)}`);
    }
  }
}
