import { Bot, CommandContext, Context, GrammyError, HearsContext, HttpError, InlineKeyboard, InputFile, Keyboard, session } from "grammy";
import { DataSource } from "typeorm";
import { Downloader } from 'nodejs-file-downloader'
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import { hydrate, HydrateFlavor } from "@grammyjs/hydrate";
import { config } from 'dotenv'
import { CalculateEntity } from "./entities/calculate.entity";
import { FurnitureService } from "./entities/furniture.entity";
import { Services } from "./entities/services.entity";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import { Role, Users } from "./entities/users.entity";
import { sign } from 'jsonwebtoken'
import { Config } from "./entities/config.entity";
import { ShopCartEntity } from "./entities/shopcart.entity";
config()

type MyContext = FileFlavor<Context> & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

bot.api.config.use(hydrateFiles(bot.token));
async function CheckManager(ctx: CommandContext<MyContext> | HearsContext<MyContext>) {
    const user = await AppDataSource.getRepository(Users).findOneBy({ userTelegramID: ctx.from?.id, userRole: "Manager", activated: true })
    return !user ? false : true;
}
async function addCategory(conversation: MyConversation, ctx: MyContext) {
    await ctx.deleteMessage()
    const mes1 = await ctx.reply("Введите название категории, которую хотите добавить");
    const text = await conversation.form.text();
    const mes2 = await ctx.reply(`Вы ввели название ${text}. Вы точно хотите добавить категорию с таким именем?!`, {
        reply_markup: new InlineKeyboard().text("Да", "yes").text("Нет", "no")
    });
    const data = await conversation.waitFor("callback_query:data");
    
    if (data.callbackQuery.data == "yes") await AppDataSource.getRepository(FurnitureService).save([
        {
            serviceName: text
        }
    ]);
    ctx.deleteMessages([mes1.message_id, mes2.message_id])
}
async function deleteService(conversation: MyConversation, ctx: MyContext) {
    const data = await fetch(process.env.BACKEND_URI! + "furniture/services");
    const jsonData: any[] = await data.json();
    const mes4 = await ctx.reply("Выберете товар, который вы хотите удалить!", {
        reply_markup: InlineKeyboard.from(
            jsonData.map((el) => [InlineKeyboard.text(el.Name)])
        )
    });
    const SelectedService = await conversation.waitFor("callback_query:data");
    ctx.deleteMessages([mes4.message_id]);
    const data2 = await fetch(process.env.BACKEND_URI! + `furniture/services?serviceName=${SelectedService.callbackQuery.data}`);
    const json2Data: any[] = await data2.json();

    const mes2 = await ctx.reply(
        `Вы точно хотите удалить продукт?
            Название товара: ${json2Data[0].Name}
            Стоимость: ${json2Data[0].Price}
            Посмотреть фото: <a href='${process.env.BACKEND_URI! + String(json2Data[0].Image).substring(1)}' target='_blank'>Перейти</a>
        `, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().text("Да", "yes").text("Нет", "no")
    });
    const gettedData = await conversation.waitFor("callback_query:data");

    if (gettedData.callbackQuery.data == "yes") {
        await AppDataSource.getRepository(Services).delete({
            Name: SelectedService.callbackQuery.data
        });
        await ctx.reply("Успешно удалено")
    }
    ctx.deleteMessages([mes2.message_id, mes4.message_id])
}
async function deleteCategory(conversation: MyConversation, ctx: MyContext) {
    await ctx.deleteMessage()
    const furnitureRepository = AppDataSource.getRepository(FurnitureService);

    const furnitures = await furnitureRepository.find()
    const mes4 = await ctx.reply("Выберете категорию, которую вы хотите удалить!", {
        reply_markup: InlineKeyboard.from(
            furnitures.map((el) => [InlineKeyboard.text(el.serviceName)])
        )
    });
    const SelectedCategory = await conversation.waitFor("callback_query:data");
    const mes2 = await ctx.reply(`Вы выбрали категорию ${SelectedCategory.callbackQuery.data}. Вы точно хотите удалить эту категорию с таким именем?!`, {
        reply_markup: new InlineKeyboard().text("Да", "yes").text("Нет", "no")
    });
    const data = await conversation.waitFor("callback_query:data");

    if (data.callbackQuery.data == "yes") await AppDataSource.getRepository(FurnitureService).delete({
        serviceName: SelectedCategory.callbackQuery.data
    });
    await ctx.deleteMessages([mes4.message_id,mes2.message_id]);
}
async function adduser(conversation: MyConversation, ctx: MyContext) {
    const mes2 = await ctx.reply(`Добавить мастера с фото или без?`, {
        reply_markup: new InlineKeyboard().text("Да", "yes").text("Нет", "no")
    });
    const data = await conversation.waitFor("callback_query:data");
    var authToken = sign({ userId: ctx.from?.id }, process.env.BOT_TOKEN!, {
        expiresIn: "10m"
    })
    if (data.callbackQuery.data == "no") {
        const mes1 = await ctx.reply("Введите ФИО мастера");
        const name = await conversation.form.text();

        const PostData = await fetch(process.env.BACKEND_URI + "telegram/add_master", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name: name,

            })
        })
        console.log(await PostData.json())
        await ctx.deleteMessages([mes1.message_id]);
    } else {
        const mes1 = await ctx.reply("Введите ФИО мастера");
        const name = await conversation.form.text();
        const mes3 = await ctx.reply("Отправьте фотографию мастера");
        const image = await conversation.waitFor("message:file")
        var file = await image.getFile();
        var fileUrl = `${file.getUrl()}`
        const PostData = await fetch(process.env.BACKEND_URI + "telegram/add_master", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name: name,
                userPhotoUrl: fileUrl
            })
        })
        console.log(await PostData.json())
        await ctx.deleteMessages([mes1.message_id]);
    }

}
async function addService(conversation: MyConversation, ctx: MyContext) {
    const furnitureRepository = AppDataSource.getRepository(FurnitureService);

    const furnitures = await furnitureRepository.find()
    const mes1 = await ctx.reply("Введите название товара, которое хотите добавить");
    const name = await conversation.form.text();

    const mes2 = await ctx.reply("Введите цену товара");

    const price = await conversation.form.number();
    const mes3 = await ctx.reply("Отправьте фотографию товара");

    const image = await conversation.waitFor("message:file")
    var authToken = sign({ userId: ctx.from?.id }, process.env.BOT_TOKEN!, {
        expiresIn: "10m"
    })
    const mes4 = await ctx.reply("Выберете категорию, в которую вы хотите добавить товар", {
        reply_markup: InlineKeyboard.from(
            furnitures.map((el) => [InlineKeyboard.text(el.serviceName)])
        )
    });

    const data = await conversation.waitFor("callback_query:data");
    var file = await image.getFile();
    var fileUrl = `${file.getUrl()}`
    const PostData = await fetch(process.env.BACKEND_URI + "furniture/create-service", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Name: name,
            Price: price,
            serviceName: data.callbackQuery.data,
            ImageUrl: fileUrl
        })
    })
    const result = await PostData.json();
    await ctx.reply("Успешно отправлен запрос на добавление. Тело ответа на запрос: " + "```json " + `${JSON.stringify(result)}` + "```", {
        parse_mode: "Markdown"
    })
    await ctx.deleteMessages([mes1.message_id, mes2.message_id, mes3.message_id, mes4.message_id])
}
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(deleteService, "deleteservice"))
bot.use(createConversation(addCategory, "addcategory"))
bot.use(createConversation(addService, "addservice"))
bot.use(createConversation(deleteCategory, "deletecategory"))
bot.use(createConversation(adduser, "addmaster"))
const ManagerKeyboard = new Keyboard()
    .text("Добавить категорию").row()
    .text("Удалить категорию").row()
    .text("Удалить продукт").row()
    .text("Добавить товар по категории").row()
    .text("Добавить нового мастера").resized()
const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DBHOST,
    port: 3306,
    username: process.env.DBUSERNAME,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    entities: [CalculateEntity, FurnitureService, Services, Users, Config, ShopCartEntity],
})

// Handle the /start command.
bot.command("start", async (ctx) => {
    const user = await AppDataSource.getRepository(Users).findOneBy({ userTelegramID: ctx.from?.id, userRole: "Manager" })
    if (user) {
        await ctx.reply("Приветствую менеджера", {
            reply_markup: { force_reply: true, ...ManagerKeyboard },
            reply_parameters: { message_id: ctx.msg.message_id }
        })
        return;
    }
    await ctx.reply("Приветствую пользователя")
});
const temp = {
    id: "123",
    products: ["12", "21"]
}
const loadLabel = (data: string[]) => {

    const labelDataPairs = [
        ["‹", `prev_${data[1]}_${Number(data[2]) == 0 ? 0 : Number(data[2]) - 1}`],
        ["Перейти в профиль", "profile"],
        ["›", `next_${data[1]}_${Number(data[2]) + 1}`],
    ];
    return labelDataPairs
}
bot.command("test", async ctx => {
    const labelDataPairs = [
        ["‹", `prev_${temp.id}_${0}`],
        ["Перейти в профиль", "profile"],
        ["›", `next_${temp.id}_${1}`],
    ];
    const buttonRow = labelDataPairs
        .map(([label, data]) => InlineKeyboard.text(label, data));
    const keyboard = InlineKeyboard.from([buttonRow]);
    await ctx.reply("ddd", {
        reply_markup: keyboard
    })
})
const loadNewKeyBoardWithService = async (data: string[]) => {
    var shopCartId = Number(data[1]);
    var nextProduct = Number(data[2]);
    var shopCart = await AppDataSource.getRepository(ShopCartEntity).findOneBy({
        cartID: shopCartId
    });
    if (shopCart) {
        var products = shopCart.products.split(",")
        var service = await AppDataSource.getRepository(Services).findOneBy({
            serviceID: products[nextProduct]
        });
        return {
            keyboard: products.length - 1 == nextProduct ? [
                ["‹", `prev_${shopCartId}_${nextProduct - 1}`],
            ] : nextProduct == 0 ? [
                ["›", `next_${shopCartId}_${nextProduct + 1}`],
            ] : [
                ["‹", `prev_${shopCartId}_${nextProduct - 1}`],
                ["›", `next_${shopCartId}_${nextProduct + 1}`],
            ],
            viewed: nextProduct,
            count: products.length-1,
            service: service,
            tgName: `https://t.me/${shopCart.telegramUserName}`
        }
    }


}
bot.on("callback_query:data", async ctx => {
    await ctx.answerCallbackQuery();
    ctx.from.username
    var data: string[] = ctx.callbackQuery.data.split('_');
    var callbackData = await loadNewKeyBoardWithService(data);
    if (callbackData?.service) {
        const buttonRow = callbackData.keyboard
            .map(([label, data]) => InlineKeyboard.text(label, data));
        const keyboard = InlineKeyboard.from([buttonRow]).row().url("Посмотреть профиль",callbackData.tgName)
        await ctx.editMessageMedia({
            media: new InputFile({ url: `https://1640350c0d13.vps.myjino.ru${callbackData.service.Image}` }),
            type: "photo",
            caption: `Информация о товаре:\nНазвание: ${callbackData.service.Name}\nЦена: ${callbackData.service.Price} руб\n\nТекущая страница ${callbackData.viewed} из ${callbackData.count}`,
            parse_mode: "HTML",

        }, {
            reply_markup: keyboard,
            
        })
    }
})

bot.hears("Добавить категорию", async ctx => {
    if (await CheckManager(ctx)) await ctx.conversation.enter("addcategory")
})
bot.hears("Удалить категорию", async ctx => {
    if (await CheckManager(ctx)) await ctx.conversation.enter("deletecategory")

})
bot.hears("Удалить продукт", async ctx => {
    if (await CheckManager(ctx)) await ctx.conversation.enter("deleteservice")
});
bot.hears("Добавить товар по категории", async ctx => {
    if (await CheckManager(ctx)) await ctx.conversation.enter("addservice")
})
bot.hears("Добавить нового мастера", async ctx => {
    if (await CheckManager(ctx)) await ctx.conversation.enter("addmaster")
})
bot.on("message", async ctx => {
    var code = (await AppDataSource.getRepository(Config).find())[0].generatedID;
    if (ctx.message.text == code) {
        await AppDataSource.getRepository(Config).update({
            tableId: "1"
        }, {
            generatedID: `key_${crypto.randomUUID()}`
        })
        if (await AppDataSource.getRepository(Users).findOne({ where: { userTelegramName: ctx.from.username } })) {
            return
        }
        await AppDataSource.getRepository(Users).save([
            {
                userTelegramID: ctx.from.id,
                userTelegramName: ctx.from.username,
                userRole: "Manager"
            }
        ]);
        await ctx.reply("Введите заново команду /start");
    }
})
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        bot.start();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
