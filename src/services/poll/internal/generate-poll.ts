import { Configuration, OpenAIApi } from "openai";
import {
  PollGenerateData,
  PollGenerateOptionData,
  PollGenerateParams,
} from "../../../domain/poll/service/poll-service";
import { readYaml } from "../../helpers";
import { join } from "path";
import { getRandomInt, uniq } from "../../../domain/base/util";
import logger from "../../../domain/logger";

type JsonData = {
  question: string;
  answers: {
    title: string;
    description: string;
    textToSearchImage?: string;
    entityType?: string;
  }[];
  description: string;
  tags: string[];
};

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getTags = (data: JsonData) => {
  const tags = uniq(
    (data.tags || []).concat(
      data.answers
        .filter(
          (a) =>
            a.entityType &&
            (a.entityType.includes("PERSON") ||
              a.entityType.startsWith("ORG") ||
              a.entityType.includes("PLACE"))
        )
        .map((a) => a.title.trim())
    )
  );
  if (tags.length <= 5) return tags;

  return tags.filter((t) => t !== t.toLowerCase()).slice(0, 5);
};

export default async ({
  language,
  info,
}: PollGenerateParams): Promise<PollGenerateData> => {
  const versions = readYaml<string[]>(
    join(__dirname, "../../../../data/polls", `${language}.yaml`)
  );
  let prompt = versions[getRandomInt(0, versions.length - 1)];
  if (info) prompt += `\n${info.slice(0, 300)}`;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
    n: 1,
    // stop: STOP
  });

  const json: JsonData = JSON.parse(
    (response.data.choices[0].message?.content || "").trim()
  );

  if (!json) throw new Error("PollGenerate: No data");
  const data: PollGenerateData = {
    title: json.question,
    options: json.answers.map<PollGenerateOptionData>((a) => ({
      title: a.title,
      description: a.description,
      textToSearchImage: a.textToSearchImage,
    })),
    description: json.description,
    tags: getTags(json),
    language,
  };
  if (!data.title) throw new Error("PollGenerate: No title");
  if (data.options?.length !== 2) throw new Error("PollGenerate: No options");

  logger.info(`PollGenerate:`, data);

  return data;
};
