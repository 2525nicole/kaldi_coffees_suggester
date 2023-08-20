#!/usr/bin/env node

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import enquirer from "enquirer";
import {
  TasteClassification,
  BodyClassification,
} from "./coffee_classification.js";

const { prompt } = enquirer;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function suggestCoffees() {
  console.log(
    `カルディコーヒーファームで取り扱っている23種類のラインナップからあなたにぴったりのコーヒーを提案します;)
まずはあなたのお好みを聞かせてください！\n`
  );

  async function displaySuggestion() {
    try {
      const suggestedCoffees = await decideSuggestions();

      console.log(
        `\nあなたにぴったりなコーヒーは以下の${suggestedCoffees.length}つです。
ぜひ試してみてくださいね:) 素敵なコーヒーライフを☕️\n`
      );

      suggestedCoffees.forEach(function (element) {
        console.log(`
  🐱${element.name}(${element.kinds})
  【苦味】${element.bitternessLevel}  【コク】${element.richnessLevel}  【ロースト】${element.roastingDepth}
  【コメント】${element.comment}`);
      });

      console.log(`\n🐈各項目の数値について🐈-------------------------------
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
      const preference = await askForPreference();

      let allCoffees = await fs.readFile(
        `${__dirname}/coffee_list.json`,
        "utf8"
      );
      allCoffees = JSON.parse(allCoffees);
      allCoffees = allCoffees.coffees;

      const tasteClassification = new TasteClassification(allCoffees);

      function narrowDownByTaste() {
        if (preference.tasteResult === "acidicTaste") {
          return tasteClassification.isAcidicTaste();
        } else if (preference.tasteResult === "bitterTaste") {
          return tasteClassification.isBitterTaste();
        } else {
          return tasteClassification.isWellBalancedTaste();
        }
      }

      const tasteResult = narrowDownByTaste();

      const mediumValue = preference.tasteResult === "bitterTaste" ? 3 : 2;

      const bodyClassification = new BodyClassification(
        tasteResult,
        mediumValue
      );

      function narrowDownByBody() {
        if (preference.bodyResult === "lightBody") {
          return bodyClassification.isLightBody();
        } else if (preference.bodyResult === "fullBody") {
          return bodyClassification.isFullBody();
        } else {
          return bodyClassification.isMediumBody();
        }
      }

      const suggestedCoffees = narrowDownByBody();
      suggestedCoffees.sort(function (a, b) {
        if (a.bitternessLevel < b.bitternessLevel) return -1;
        if (a.bitternessLevel > b.bitternessLevel) return 1;
        return 0;
      });
      return suggestedCoffees;
    } catch (error) {
      console.log(error);
    }
  }

  async function askForPreference() {
    const preference = { tasteResult: "", bodyResult: "" };
    try {
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
          result(value) {
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
          result(value) {
            preference.bodyResult = this.focused.value;
          },
        },
      ]);
      return preference;
    } catch (error) {
      console.log(error);
    }
  }
  displaySuggestion();
}

suggestCoffees();
