import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

import { glob } from "glob";
import { CSSProperties } from "react";

import aliasMap from "./aliasMap.json";

type IconFormats = "svg";
type IconDefinition = {
  collection?: string;
  name?: string;
  alias?: string;
  file?: string;
  src?: string;
  isLocal?: boolean;
  id: string;
  libray?: string;
  filename?: string;
  format?: IconFormats;
  componentName?: string;
  sourceComponentFile?: string;
  absoluteSrc?: string;
};

type IconProps = {
  name?: string;
  src?: string;
  componentFile?: string;
};

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, "src");
const LIB_DIR = path.join(ROOT_DIR, "lib");
const OUTPUT_DIR = path.join(ROOT_DIR, "lib/images/svg");

const execPromise = promisify(exec);

const formatFile = async (filepath: string) => {
  try {
    await execPromise(
      `npx eslint -c ${path.join(ROOT_DIR, ".eslintrc.json")} --fix "${filepath}"`,
    );
  } catch (err) {
    console.error(`Error formatting ${filepath}:`, err);
  }
};

const dashToCamel = (str: string): string => {
  const cleaned = str.replace(/-+/g, "-").replace(/^-|-$/g, "");
  const camel = cleaned.replace(/-([a-zA-Z])/g, (_, letter) =>
    letter.toUpperCase(),
  );

  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const styleFromString = (styleStr: string): CSSProperties => {
  const style: Record<string | number, string> = {};

  styleStr.split(";").forEach((rule) => {
    const [key, value] = rule.split(":").map((s) => s.trim());

    if (key && value) {
      style[
        dashToCamel(key).charAt(0).toLowerCase() + dashToCamel(key).slice(1)
      ] = value;
    }
  });

  return style as CSSProperties;
};

const findIconProps = (componentText: string, file: string): IconProps[] => {
  const tagRegex = /<Icon\b([^>]*)>/g;
  const attrRegex = /(\w+)\s*=\s*"([^"]+)"/g;

  let match;

  const icons: IconProps[] = [];

  while ((match = tagRegex.exec(componentText)) !== null) {
    const propsString = match[1];
    const icon: IconProps = {};

    let attrMatch;

    while ((attrMatch = attrRegex.exec(propsString)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2];

      if (key === "name") icon.name = value;
      if (key === "src") icon.src = value;
    }
    icon.componentFile = file;
    icons.push(icon);
  }

  const tag2Regex = /<ImageSVG\b([^>]*)>/g;
  const attr2Regex = /(\w+)\s*=\s*"([^"]+)"/g;

  while ((match = tag2Regex.exec(componentText)) !== null) {
    const propsString = match[1];
    const icon: IconProps = {};

    let attrMatch;

    while ((attrMatch = attr2Regex.exec(propsString)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2];

      if (key === "name") icon.name = value;
      if (key === "src") icon.src = value;
    }

    icon.componentFile = file;
    icons.push(icon);
    console.log(icon);
  }

  return icons;
};

const iconId = (name?: string, src?: string): string => {
  let normalizedName = name;
  let normalizedSrc = src;

  if (name === undefined) {
    normalizedName = "no-name";
  }

  if (src === undefined) {
    normalizedSrc = "no-source";
  }

  const combined = `${normalizedName}:${normalizedSrc}`;
  const base64 = btoa(combined) // to Base64
    .replace(/\+/g, "-") // URL safe (optional)
    .replace(/\//g, "_") // URL safe (optional)
    .replace(/=+$/, "") // Remove padding
    .toLowerCase(); // Make lowercase

  return base64;
};

const parseIconPropToIconDefinition = (iconProp: IconProps): IconDefinition => {
  const iconDefintion: IconDefinition = {
    id: iconId(iconProp.name, iconProp.src),
    isLocal: iconProp.src !== undefined,
  };

  if (iconDefintion.isLocal) {
    iconDefintion.libray = "local";
  } else {
    iconDefintion.libray = "iconify";
  }

  if (iconProp.src !== undefined) {
    iconDefintion.src = iconProp.src;
  }
  let fullName = iconProp.name || "";

  if ((aliasMap as Record<string, string>)[fullName] !== undefined) {
    iconDefintion.alias = fullName;
    fullName = (aliasMap as Record<string, string>)[fullName];
  }

  const [collection, name] = fullName.split(":");

  let filename = "";

  if (collection !== undefined) {
    iconDefintion.collection = collection;
    filename = collection;
  }

  if (name !== undefined) {
    iconDefintion.name = name;
    filename = `${filename}-${name}`;
  }

  if (iconDefintion.src !== undefined) {
    filename = `${filename}-${iconDefintion.src.split("/")?.pop()?.split(".").slice(0, -1).join(".")}`;
    const format = iconDefintion.src
      .split("/")
      ?.pop()
      ?.split(".")
      .slice(-1)
      .join(".");

    if (format) {
      iconDefintion.format = format as IconFormats;
    }
  }

  filename = `${iconDefintion.libray}-${filename}`;

  if (!iconDefintion.format) {
    iconDefintion.format = "svg" as IconFormats;
  }

  iconDefintion.filename = `${dashToCamel(filename)}.${iconDefintion.format}`;
  iconDefintion.componentName = `${dashToCamel(filename)}`;
  iconDefintion.sourceComponentFile = iconProp.componentFile;

  if (iconDefintion.src) {
    const folder = iconProp
      .componentFile!.split("/")
      .reverse()
      .slice(1)
      .reverse()
      .join("/");

    let absoluteSrc = "";

    if (iconDefintion.src.startsWith("@/")) {
      const relativePath = iconDefintion.src.replace("@/", "src/");

      absoluteSrc = path.join(ROOT_DIR, relativePath);
    } else {
      absoluteSrc = path.resolve(folder, iconDefintion.src);
    }

    iconDefintion.absoluteSrc = absoluteSrc;
  }

  return iconDefintion;
};

const dedupeIcons = (icons: IconDefinition[]): IconDefinition[] => {
  const map = new Map();

  for (const item of icons) {
    if (!map.has(item.id)) {
      map.set(item.id, item); // only first appearance kept
    }
  }

  return Array.from(map.values());
};

const findIconTags = async (): Promise<IconDefinition[]> => {
  const srcFiles = await glob(`${SRC_DIR}/**/*.{ts,tsx,jsx,vue,html}`);
  const libFiles = await glob(`${LIB_DIR}/**/*.{ts,tsx,jsx,vue,html}`);
  const files = [...srcFiles, ...libFiles];
  let icons: IconDefinition[] = [];

  for (const file of files) {
    if (file.indexOf("lib/scripts/extractIcons.ts") === -1) {
      const content = await fs.promises.readFile(file, "utf-8");

      icons = [
        ...icons,
        ...findIconProps(content, file).map((icon) =>
          parseIconPropToIconDefinition(icon),
        ),
      ];
    }
  }

  icons = dedupeIcons(icons);

  return icons;
};

const getIconifyImage = async (icon: IconDefinition) => {
  if (icon.libray !== "iconify") {
    return null;
  }
  const { collection, name } = icon;

  if (!collection || !name) {
    console.warn(
      `Invalid Iconify Icon format: ${JSON.stringify(icon, undefined, 2)}`,
    );

    return null;
  }

  const url = `https://api.iconify.design/${collection}/${name}.svg`;

  try {
    let svg = "";

    const res = await fetch(url);

    if (!res.ok) {
      console.error(
        `Failed to download ${JSON.stringify(icon, undefined, 2)}: ${res.statusText}`,
      );

      return;
    }
    svg = await res.text();

    // --- REMOVE width and height attributes from <svg> tag ---
    svg = svg.replace(/\s(width|height)="[^"]*"/g, "");

    svg = svg.replace(/style="([^"]*)"/g, (_, styleStr) => {
      const styleObj = styleFromString(styleStr);

      return `style={${JSON.stringify(styleObj)}}`;
    });

    // Convert dashed attributes outside style (e.g., stroke-width => strokeWidth)
    svg = svg.replace(/([a-z]+)-([a-z]+)/gi, (_, part1, part2) => {
      return part1 + part2.charAt(0).toUpperCase() + part2.slice(1);
    });

    const outputFile = path.join(OUTPUT_DIR, `${icon.componentName}.tsx`);

    const reactComponent = `
import { SVGProps } from "react";

export const ${icon.componentName} = (props: SVGProps<SVGSVGElement>) => (
  ${svg.replace("<svg", "<svg {...props}")}
);
export default ${icon.componentName};

`.trim();

    if (!fs.existsSync(outputFile)) {
      await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.promises.writeFile(outputFile, reactComponent, "utf-8");
      formatFile(outputFile);
      // console.log(
      //   `Downloaded and cleaned: ${JSON.stringify(icon, undefined, 2)}`,
      // );

      return "downloaded";
    } else {
      //      console.log(`Icon: ${JSON.stringify(icon, undefined, 2)} is cached.`);

      return "cached";
    }
  } catch (err) {
    // console.error(
    //   `Error downloading ${JSON.stringify(icon, undefined, 2)}:`,
    //   err,
    // );

    return "error";
  }
};

const getLocalIcon = async (icon: IconDefinition) => {
  if (icon.libray !== "local") {
    return null;
  }
  const { src, absoluteSrc } = icon;

  if (!src || !absoluteSrc) {
    // console.warn(
    //   `Invalid Local Icon format: ${JSON.stringify(icon, undefined, 2)}`,
    // );

    return null;
  }

  try {
    let svg = "";

    svg = fs.readFileSync(absoluteSrc, "utf-8");

    // --- REMOVE width and height attributes from <svg> tag ---
    svg = svg.replace(/\s(width|height)="[^"]*"/g, "");

    svg = svg.replace(/style="([^"]*)"/g, (_, styleStr) => {
      const styleObj = styleFromString(styleStr);

      return `style={${JSON.stringify(styleObj)}}`;
    });

    // Convert dashed attributes outside style (e.g., stroke-width => strokeWidth)
    svg = svg.replace(/([a-z]+)-([a-z]+)/gi, (_, part1, part2) => {
      return part1 + part2.charAt(0).toUpperCase() + part2.slice(1);
    });

    const outputFile = path.join(OUTPUT_DIR, `${icon.componentName}.tsx`);

    const reactComponent = `
import { SVGProps } from "react";

export const ${icon.componentName} = (props: SVGProps<SVGSVGElement>) => (
  ${svg.replace("<svg", "<svg {...props}")}
);
export default ${icon.componentName};

`.trim();

    if (!fs.existsSync(outputFile)) {
      await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.promises.writeFile(outputFile, reactComponent, "utf-8");
      formatFile(outputFile);
      console.log(`Copied and cleaned: ${JSON.stringify(icon, undefined, 2)}`);

      return "copied";
    } else {
      console.log(`Icon: ${JSON.stringify(icon, undefined, 2)} is cached.`);

      return "cached";
    }
  } catch (err) {
    console.error(`Error copying ${JSON.stringify(icon, undefined, 2)}:`, err);

    return "error";
  }
};

const main = async () => {
  const icons: IconDefinition[] = await findIconTags();

  icons.forEach(async (icon) => {
    await getIconifyImage(icon);
    await getLocalIcon(icon);
  });
  let lazyLoadMap = `export const iconMap: Record<string, () => Promise<any>> = {`;

  icons.forEach((icon) => {
    console.log("alias", icon);

    if (icon.src) {
      lazyLoadMap = `${lazyLoadMap}
        "${icon.src}": () => import("./${icon.componentName}"),`;
    }

    if (icon.alias) {
      lazyLoadMap = `${lazyLoadMap}
          "${icon.alias}": () => import("./${icon.componentName}"),`;
    }
    if (icon.name && icon.collection) {
      lazyLoadMap = `${lazyLoadMap}
            "${icon.collection}:${icon.name}": () => import("./${icon.componentName}"),`;
    }
  });
  const mapFile = path.join(OUTPUT_DIR, `iconMap.tsx`);

  await fs.promises.writeFile(
    mapFile,
    `${lazyLoadMap}
    
  };
  `,
    { encoding: "utf8", flag: "w" },
  );
  await formatFile(mapFile);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
