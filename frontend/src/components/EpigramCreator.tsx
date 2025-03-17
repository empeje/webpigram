import { Epigram } from "@/types/epigram";

interface EpigramCreatorProps {
  epigrams: Epigram[];
  setEpigrams: React.Dispatch<React.SetStateAction<Epigram[]>>;
}

export function useEpigramCreator(epigrams: Epigram[], setEpigrams: React.Dispatch<React.SetStateAction<Epigram[]>>) {
  const handleAddEpigram = (newEpigram: Omit<Epigram, "id" | "upvotes" | "downvotes" | "createdAt">) => {
    const epigramToAdd: Epigram = {
      id: (epigrams.length + 1).toString(),
      content: newEpigram.content,
      author: newEpigram.author,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      topics: newEpigram.topics || [],
    };

    setEpigrams([epigramToAdd, ...epigrams]);
  };

  return { handleAddEpigram };
} 