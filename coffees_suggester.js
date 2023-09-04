#!/usr/bin/env node

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import enquirer from "enquirer";
const { prompt } = enquirer;
import {
  TasteClassification,
  BodyClassification,
} from "./coffee_classification.js";
import dedent from "dedent";

async function suggestCoffees() {
  console.log(dedent`
    カルディコーヒーファームで取り扱っている23種類のラインナップからあなたにぴったりのコーヒーを提案します;)
    まずはあなたのお好みを聞かせてください！\n`);

  const preference = await askPreference();
  const suggestedCoffees = await decideSuggestions(preference);
  displaySuggestion(suggestedCoffees);
}

async function askPreference() {
  prompt.on("cancel", () => {
    console.log("\nまたの機会に是非お好みを聞かせてくださいね！よい1日を🐈");
    process.exit();
  });

  const preference = {};
  await prompt([
    {
      type: "select",
      name: "taste",
      message: "お好みのテイストはどちらですか?",
      choices: [
        { name: "酸味が強い", value: "acidicTaste" },
        { name: "苦味が強い", value: "bitterTaste" },
        { name: "酸味と苦味のバランスが良い", value: "wellBalancedTaste" },
      ],
      result() {
        preference.tasteResult = this.focused.value;
      },
    },
    {
      type: "select",
      name: "body",
      message: "口当たりや後味のお好みはどちらですか?",
      choices: [
        {
          name: "あっさりと軽い口当たり、後味スッキリ",
          value: "lightBody",
        },
        {
          name: "濃厚でコク深い口あたり、余韻が長く楽しめる",
          value: "fullBody",
        },
        {
          name: "コクもありつつ、すっきりとしたマイルドな飲み心地",
          value: "mediumBody",
        },
      ],
      result() {
        preference.bodyResult = this.focused.value;
      },
    },
  ]);
  return preference;
}

async function decideSuggestions(preference) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let allCoffees = await fs.readFile(`${__dirname}/coffee_list.json`, "utf8");
  allCoffees = JSON.parse(allCoffees);
  allCoffees = allCoffees.coffees;

  const medianTaste = 5;
  const tasteClassification = new TasteClassification(allCoffees, medianTaste);
  const tasteResult = tasteClassification.suggestByTaste(
    preference.tasteResult,
  );

  const medianBody = preference.tasteResult === "bitterTaste" ? 3 : 2;
  const bodyClassification = new BodyClassification(tasteResult, medianBody);
  const suggestedCoffees = bodyClassification.suggestByBody(
    preference.bodyResult,
  );
  return suggestedCoffees;
}

async function displaySuggestion(suggestedCoffees) {
  console.log(dedent`
      \nあなたにぴったりなコーヒーは以下の${suggestedCoffees.length}つです。
      ぜひ試してみてくださいね:) 素敵なコーヒーライフを☕️\n`);

  suggestedCoffees.sort((a, b) => {
    if (a.bitternessLevel < b.bitternessLevel) return -1;
    if (a.bitternessLevel > b.bitternessLevel) return 1;
    return 0;
  });

  suggestedCoffees.forEach((element) => {
    console.log(dedent`
        🐱${element.name}(${element.kinds})
        【苦味】${element.bitternessLevel}  【コク】${element.richnessLevel}  【ロースト】${element.roastingDepth}
        【コメント】${element.comment}\n`);
  });

  console.log(dedent`
    \n🐈各項目の数値について🐈-------------------------------
    カルディコーヒーファームのCOFFEE GUIDEまたはコーヒーケースに記載の数値です。
    ・【苦味】 10段階（0 ←酸味が強い | 苦味が強い→ 10）
    ・【コク深さ】 4段階（0 ←すっきり | コク深い→ 10）
    ・【ロースト】 7段階（0 ←浅煎り | 深煎り→ 7）
    -------------------------------------------------------\n`);
}

suggestCoffees();
