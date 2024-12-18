import { cloneDeep } from 'lodash';
import { IAskResponse, ICitation } from '../../types/conversationTypes';
import { IParsedAnswer } from '../../types/common';

export const enumerateCitations = (citations: ICitation[]) => {
  const filepathMap = new Map();
  for (const citation of citations) {
    const { filepath } = citation;
    let part_i = 1;
    if (filepathMap.has(filepath)) {
      part_i = filepathMap.get(filepath) + 1;
    }
    filepathMap.set(filepath, part_i);
    citation.part_index = part_i;
  }
  return citations;
};

export function parseAnswer(answer: IAskResponse): IParsedAnswer | null {
  if (typeof answer.answer !== 'string') return null;
  let answerText = answer.answer;
  const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g);

  const lengthDocN = '[doc'.length;

  let filteredCitations = [] as ICitation[];
  let citationReindex = 0;
  citationLinks?.forEach((link) => {
    // Replacing the links/citations with number
    const citationIndex = link.slice(lengthDocN, link.length - 1);
    const citation = cloneDeep(
      answer.citations[Number(citationIndex) - 1],
    ) as ICitation;
    if (!filteredCitations.find((c) => c.id === citationIndex) && citation) {
      answerText = answerText.replaceAll(link, ` ^${++citationReindex}^ `);
      citation.id = citationIndex; // original doc index to de-dupe
      citation.reindex_id = citationReindex.toString(); // reindex from 1 for display
      filteredCitations.push(citation);
    }
  });

  filteredCitations = enumerateCitations(filteredCitations);

  return {
    citations: filteredCitations,
    markdownFormatText: answerText,
    generated_chart: answer.generated_chart,
  };
}
