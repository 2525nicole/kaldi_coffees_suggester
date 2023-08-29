#!/usr/bin/env node

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import enquirer from "enquirer";
import {
  TasteClassification,
  BodyClassification,
} from "./coffee_classification.js";
import dedent from "dedent";

function suggestCoffees() {
  console.log(dedent`
    カルディコーヒーファームで取り扱っている23種類のラインナップからあなたにぴったりのコーヒーを提案します;)
    まずはあなたのお好みを聞かせてください！\n`);

  displaySuggestion();
}

async function displaySuggestion() {
  try {
    const suggestedCoffees = await decideSuggestions();

    console.log(dedent`
      \nあなたにぴったりなコーヒーは以下の${suggestedCoffees.length}つです。
      ぜひ試してみてくださいね:) 素敵なコーヒーライフを☕️\n`);

    suggestedCoffees.sort(function (a, b) {
      if (a.bitternessLevel < b.bitternessLevel) return -1;
      if (a.bitternessLevel > b.bitternessLevel) return 1;
      return 0;
    });

    suggestedCoffees.forEach(function (element) {
      console.log(
        dedent`
        🐱${element.name}(${element.kinds})
        【苦味】${element.bitternessLevel}  【コク】${element.richnessLevel}  【ロースト】${element.roastingDepth}
        【コメント】${element.comment}\n`,
      );
    });

    console.log(dedent`
    \n🐈各項目の数値について🐈-------------------------------
    カルディコーヒーファームのCOFFEE GUIDEまたはコーヒーケースに記載の数値です。
    ・【苦味】 10段階（0 ←酸味が強い | 苦味が強い→ 10）
    ・【コク深さ】 4段階（0 ←すっきり | コク深い→ 10）
    ・【ロースト】 7段階（0 ←浅煎り | 深煎り→ 7）
    -------------------------------------------------------\n`);
  } catch (error) {
    console.log(error);
  }
}

async function decideSuggestions() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const preference = await askForPreference();

    let allCoffees = await fs.readFile(`${__dirname}/coffee_list.json`, "utf8");
    allCoffees = JSON.parse(allCoffees);
    allCoffees = allCoffees.coffees;

    const tasteClassification = new TasteClassification(allCoffees);

    const tasteResult = narrowDownByTaste(preference, tasteClassification);

    const mediumValue = preference.tasteResult === "bitterTaste" ? 3 : 2;

    const bodyClassification = new BodyClassification(tasteResult, mediumValue);

    const suggestedCoffees = narrowDownByBody(preference, bodyClassification);
    return suggestedCoffees;
  } catch (error) {
    console.log(error);
  }
}

async function askForPreference() {
  try {
    const preference = {};
    const { prompt } = enquirer;
    prompt.on("cancel", () => {
      console.log("\nまたの機会に是非お好みを聞かせてくださいね！よい1日を🐈");
      process.exit();
    });

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
  } catch (error) {
    console.log(error);
  }
}

function narrowDownByTaste(preference, tasteClassification) {
  try {
    if (preference.tasteResult === "acidicTaste") {
      return tasteClassification.isAcidicTaste();
    } else if (preference.tasteResult === "bitterTaste") {
      return tasteClassification.isBitterTaste();
    } else {
      return tasteClassification.isWellBalancedTaste();
    }
  } catch (error) {
    console.log(error);
  }
}

function narrowDownByBody(preference, bodyClassification) {
  try {
    if (preference.bodyResult === "lightBody") {
      return bodyClassification.isLightBody();
    } else if (preference.bodyResult === "fullBody") {
      return bodyClassification.isFullBody();
    } else {
      return bodyClassification.isMediumBody();
    }
  } catch (error) {
    console.log(error);
  }
}

suggestCoffees();
