import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

import { glob } from "glob";

const execPromise = promisify(exec);

async function formatFile(filepath: string) {
  try {
    await execPromise(
      `npx eslint -c ${path.join(ROOT_DIR, ".eslintrc.json")} --fix "${filepath}"`,
    );
    // OR, if you want eslint fixes too:
    // await execPromise(`npx eslint --fix "${filepath}"`);
  } catch (err) {
    console.error(`Error formatting ${filepath}:`, err);
  }
}

function dashToCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Parse inline style string into an object
function parseStyle(styleStr: string) {
  const style: Record<string, string> = {};

  styleStr.split(";").forEach((rule) => {
    const [key, value] = rule.split(":").map((s) => s.trim());

    if (key && value) {
      style[dashToCamel(key)] = value;
    }
  });

  return style;
}

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, "src");
const LIB_DIR = path.join(ROOT_DIR, "lib");
const OUTPUT_DIR = path.join(ROOT_DIR, "lib/images/svg");

async function findIconifyIds(): Promise<Set<string>> {
  const srcFiles = await glob(`${SRC_DIR}/**/*.{ts,tsx,jsx,vue,html}`);
  const libFiles = await glob(`${LIB_DIR}/**/*.{ts,tsx,jsx,vue,html}`);
  const files = [...srcFiles, ...libFiles];
  const iconIds = new Set<string>();

  const localSrcRegex = /localSrc=["']([^"']+)["']/g;
  const regex = /\bsvg:[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+/g;

  for (const file of files) {
    const content = await fs.promises.readFile(file, "utf-8");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      iconIds.add(match[0].replaceAll("svg:", ""));
    }

    while ((match = localSrcRegex.exec(content)) !== null) {
      iconIds.add(`localSrc:${file}:${match[1]}`);
    }
  }

  return iconIds;
}

async function downloadImage(imageId: string, forceRefresh: boolean = false) {
  const [prefix, name] = imageId.split(":");

  if (!prefix || !name) {
    console.warn(`Invalid image format: ${imageId}`);

    return;
  }

  const url = `https://api.iconify.design/${prefix}/${name}.svg`;

  try {
    let svg = "";

    if (prefix !== "local" && prefix !== "localSrc") {
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`Failed to download ${imageId}: ${res.statusText}`);

        return;
      }
      svg = await res.text();
    } else if (prefix === "localSrc") {
      const [, sourceFile, imageFile] = imageId.split(":");
      const folder = sourceFile
        .split("/")
        .reverse()
        .slice(1)
        .reverse()
        .join("/");

      let sourceImageFile = "";

      if (imageFile.startsWith("@/")) {
        const relativePath = imageFile.replace("@/", "src/");

        sourceImageFile = path.join(ROOT_DIR, relativePath);
      } else {
        sourceImageFile = path.resolve(folder, imageFile);
      }
      svg = fs.readFileSync(path.resolve(OUTPUT_DIR, sourceImageFile), "utf-8");
    }

    // --- REMOVE width and height attributes from <svg> tag ---
    svg = svg.replace(/\s(width|height)="[^"]*"/g, "");

    svg = svg.replace(/style="([^"]*)"/g, (_, styleStr) => {
      const styleObj = parseStyle(styleStr);

      return `style={${JSON.stringify(styleObj)}}`;
    });

    // Convert dashed attributes outside style (e.g., stroke-width => strokeWidth)
    svg = svg.replace(/([a-z]+)-([a-z]+)/gi, (_, part1, part2) => {
      return part1 + part2.charAt(0).toUpperCase() + part2.slice(1);
    });

    let componentName = `${prefix}_${name}`.replace(/(^\w|[-_]\w)/g, (match) =>
      match.replace(/[-_]/, "").toUpperCase(),
    );

    if (prefix === "localSrc") {
      componentName = imageId
        .split(":")?.[2]
        ?.split("/")
        ?.pop()
        ?.replace(/(^\w|[-_]\w)/g, (match) =>
          match.replace(/[-_]/, "").toUpperCase(),
        )
        ?.replaceAll(".svg", "")!;
    }
    const outputFile = path.join(OUTPUT_DIR, `${componentName}.tsx`);

    const reactComponent = `
import { SVGProps } from "react";

export const ${componentName} = (props: SVGProps<SVGSVGElement>) => (
  ${svg.replace("<svg", "<svg {...props}")}
);
export default ${componentName};

`.trim();

    if (
      !fs.existsSync(outputFile) ||
      (fs.existsSync(outputFile) && forceRefresh)
    ) {
      await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.promises.writeFile(outputFile, reactComponent, "utf-8");
      formatFile(outputFile);
      console.log(`Downloaded and cleaned: ${imageId}`);

      return "downloaded";
    } else {
      console.log(`Icon: ${imageId} is cached.`);

      return "cached";
    }
  } catch (err) {
    console.error(`Error downloading ${imageId}:`, err);

    return "error";
  }
}

async function main() {
  console.log("Scanning for icons...");
  const allImages = await findIconifyIds();
  const images = [...new Set(allImages)].filter(
    (image) => image && !image.startsWith("local:"),
  );

  console.log(`Found ${images.length} icons.`);
  const indexComponent = [];
  const results = [];
  let lazyMap = `export const iconMap: Record<string, () => Promise<any>> = {`;

  for (const image of images) {
    results.push(await downloadImage(image));
    const [prefix, name] = image.split(":");
    let componentName = `${prefix}_${name}`.replace(/(^\w|[-_]\w)/g, (match) =>
      match.replace(/[-_]/, "").toUpperCase(),
    );

    if (prefix === "localSrc") {
      componentName = image
        .split(":")?.[2]
        ?.split("/")
        ?.pop()
        ?.replace(/(^\w|[-_]\w)/g, (match) =>
          match.replace(/[-_]/, "").toUpperCase(),
        )
        ?.replaceAll(".svg", "")!;
    }

    indexComponent.push(`export * from "./${componentName}";`);
    let key = image;

    if (image.startsWith("localSrc")) {
      key = image.split(":")[2];
    }
    lazyMap = `${lazyMap}
  "${key}": () => import("./${componentName}"),`;
  }
  const indexFile = path.join(OUTPUT_DIR, `index.tsx`);
  const mapFile = path.join(OUTPUT_DIR, `iconMap.tsx`);

  if (results.some((result) => result === "downloaded")) {
    await fs.promises.writeFile(
      indexFile,
      indexComponent.join("\n") + "\n",
      "utf-8",
    );

    await fs.promises.writeFile(
      mapFile,
      `${lazyMap}
};
`,
      "utf-8",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
