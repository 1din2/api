import { Configuration, OpenAIApi } from "openai";
import {
  PollGenerateData,
  PollGenerateParams,
  PollGenerateTextData,
} from "../../../domain/poll/service/poll-service";
import { readYaml } from "../../helpers";
import { join } from "path";
import { getRandomInt } from "../../../domain/base/util";
import logger from "../../../domain/logger";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async ({
  language,
  news,
}: PollGenerateParams): Promise<PollGenerateData> => {
  const versions = readYaml<string[]>(
    join(__dirname, "../../../../data/polls", `${language}.yaml`)
  );
  let prompt = versions[getRandomInt(0, versions.length - 1)];
  if (news) prompt += `\nNews:\n${news.slice(0, 500)}`;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
    n: 1,
    // stop: STOP
  });

  const json: {
    question: string;
    answers: { title: string; description: string; tags: string[] }[];
    description: string;
    tags: string[];
  } = JSON.parse((response.data.choices[0].message?.content || "").trim());

  if (!json) throw new Error("PollGenerate: No data");
  const data: PollGenerateData = {
    title: json.question,
    options: json.answers.map<PollGenerateTextData>((a) => ({ ...a })),
    description: json.description,
    tags: json.tags,
    language,
  };
  if (!data.title) throw new Error("PollGenerate: No title");
  if (data.options?.length !== 2) throw new Error("PollGenerate: No options");

  logger.info(`PollGenerate:`, data);

  return data;
};
