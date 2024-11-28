import { useCallback, useEffect, useRef, useState } from "react";
import { createOCREngine, OCRClient } from "tesseract-wasm";
import { bounties as bountyData } from "../algorithm/bounties.js";

const useOCR = () => {
  const client = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  const ocr = useCallback((imageBitmap) => {
    const loadClient = async () => {
      const c = await createOCREngine();

      const r = await fetch(
        "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata",
      );
      if (!r.ok) {
        throw new Error("Failed to fetch model: " + r.statusText);
      }

      const buffer = await r.arrayBuffer();
      await c.loadModel(buffer);

      c.setVariable(
        "tessedit_char_whitelist",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ",
      );

      console.log("whitelist", c.getVariable("tessedit_char_whitelist"));

      client.current = c;
    };

    const run = async () => {
      if (!client.current) {
        await loadClient();
      }

      console.log(client.current);

      await client.current.loadImage(imageBitmap);
      const textBoxes = await client.current.getTextBoxes("word", setProgress);

      const names = Object.values(bountyData).map((bounty) =>
        bounty.name.toLowerCase(),
      );

      const result = {
        bounties: {},
        availableBounties: {},
      };

      console.log(textBoxes);

      // return;

      let bounties = null;
      let availableBounties = null;

      // First pass, find bounties & available bounties
      for (let i = 0; i < textBoxes.length; i++) {
        const { rect, text } = textBoxes[i];

        if (text.toLowerCase() === "bounties") {
          if (i > 0 && textBoxes[i - 1].text.toLowerCase() === "available") {
            availableBounties = (textBoxes[i - 1].rect.left + rect.right) / 2;
          } else {
            bounties = (rect.left + rect.right) / 2;
          }
        }
      }

      if (!bounties && !availableBounties) {
        console.warn("could not find bounties or available bounties");
        return;
      }

      for (let i = 0; i < textBoxes.length; i++) {
        if (
          i > 0 &&
          (textBoxes[i - 1].text.toLowerCase() === "from" ||
            textBoxes[i - 1].text.toLowerCase() === "to")
        ) {
          continue;
        }

        for (const name of names) {
          const parts = name.split(" ");

          const match = parts.every((part, index) => {
            if (i + index >= textBoxes.length) {
              return false;
            }

            const text = textBoxes[i + index].text.toLowerCase();
            if (text === "pumpkin") {
              console.log("pumpkin", text, part);
            }

            return text === part;
          });

          if (!match) {
            continue;
          }

          const position =
            (textBoxes[i].rect.left +
              textBoxes[i + parts.length - 1].rect.right) /
            2;
          let key = "";
          if (bounties && availableBounties) {
            if (
              Math.abs(position - bounties) <
              Math.abs(position - availableBounties)
            ) {
              key = "bounties";
            } else {
              key = "availableBounties";
            }
          } else if (bounties) {
            key = "bounties";
          } else {
            key = "availableBounties";
          }

          if (!result[key][name]) {
            result[key][name] = 1;
          } else {
            result[key][name] += 1;
          }
        }
      }

      console.log("bounties", bounties);
      console.log("availableBounties", availableBounties);
      console.log("result", result);

      // for (const textBox of textBoxes) {
      //   if (textBox.text.toLowerCase().includes("available bounties")) {
      //     type = "availableBounties";
      //   }
      //
      //   if (textBox.text.toLowerCase().includes("bounties")) {
      //     type = "bounties";
      //   }
      //
      //   // if (!type) {
      //   //   continue;
      //   // }
      //
      //   const defaultedType = type === "" ? "availableBounties" : type;
      //
      //   for (const name of names) {
      //     if (textBox.text.toLowerCase().includes(name)) {
      //       const key = name.toUpperCase().replaceAll(" ", "_");
      //       if (!result[defaultedType][key]) {
      //         result[defaultedType][key] = 1;
      //       } else {
      //         result[defaultedType][key] += 1;
      //       }
      //     }
      //   }
      // }

      console.log(result);
    };

    setProgress(0);
    run();
  }, []);

  return {
    ocr,
    progress,
  };
};

export default useOCR;
