/**
 * Search for images on google
 *
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { URL } from "url";
import { uniqBy } from "ramda";
import { WebSearchImage } from "../../domain/image/service/web-image-service";

const INVALID_HOSTS = ["feelgrafix.com", "picturesstar.com"];

export default async function (
  name: string,
  options: {
    limit: number;
    type?: string;
    minWidth?: number;
    minHeight?: number;
    country?: string;
  }
): Promise<WebSearchImage[]> {
  const limit = options.limit || 2;
  const type = options.type || "photo";
  const minWidth = options.minWidth || 0;
  const minHeight = options.minHeight || 0;
  const country = options.country;
  let url =
    "https://www.google.com/search?q={q}&lr=&cr={country}&prmd=imvnslo&source=lnms&tbm=isch&tbas=0&tbs=itp:{type},isz:l,islt:qsvga,ift:jpg&safe=on";
  url = url.replace("{q}", encodeURIComponent(name)).replace("{type}", type);
  //.replace('{lang}', lang || 'en');

  if (country) {
    url = url.replace("{country}", "country" + country.toUpperCase());
  } else {
    url = url.replace("{country}", "");
  }

  const reqOptions: AxiosRequestConfig = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Accept-Language":
        "en-US,en;q=0.8,cs;q=0.6,es;q=0.4,hu;q=0.2,it;q=0.2,lt;q=0.2,ro;q=0.2,ru;q=0.2,sk;q=0.2,uk;q=0.2,pl;q=0.2,bg;q=0.2",
    },
    maxRedirects: 1,
    responseType: "text",
  };

  let response: AxiosResponse<string>;
  try {
    response = await axios(url, reqOptions);
  } catch (e) {
    throw new Error(e.message);
  }
  const html = response.data;

  let regResult;
  const reg = /"(https?:\/\/[^"]+\.(?:jpg|jpeg|webp))",\s*(\d+),\s*(\d+)/gi;
  const list: WebSearchImage[] = [];
  while ((regResult = reg.exec(html))) {
    const href = regResult[1];
    if (!href) continue;
    const height = parseInt(regResult[2], 10);
    const width = parseInt(regResult[3], 10);
    if (height < minHeight || width < minWidth) continue;

    if (INVALID_HOSTS.find((item) => href.includes(item))) continue;
    list.push({ url: href, hostname: new URL(href).hostname, width, height });

    if (list.length >= limit) break;
  }

  return uniqBy((item) => item.url, list);
}
