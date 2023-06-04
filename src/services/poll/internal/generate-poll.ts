import { Configuration, OpenAIApi } from "openai";
import {
  PollGenerateData,
  PollGenerateParams,
} from "../../../domain/poll/service/poll-service";
import { readYaml } from "../../helpers";
import { join } from "path";
import { getRandomInt } from "../../../domain/base/util";

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

  return JSON.parse((response.data.choices[0].message?.content || "").trim());
};
