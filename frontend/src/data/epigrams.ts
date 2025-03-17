import { Epigram } from '@/types/epigram';

export const epigrams: Epigram[] = [
  {
    id: '1',
    content: "One man's constant is another man's variable.",
    author: 'Alan J. Perlis',
    upvotes: 42,
    downvotes: 5,
    createdAt: '2023-01-15T12:00:00Z',
    topics: ['Programming', 'Variables'],
  },
  {
    id: '2',
    content:
      'Functions delay binding; data structures induce binding. Moral: Structure data late in the programming process.',
    author: 'Alan J. Perlis',
    upvotes: 38,
    downvotes: 3,
    createdAt: '2023-02-20T14:30:00Z',
    topics: ['Functions', 'Data Structures', 'Programming'],
  },
  {
    id: '3',
    content: 'Syntactic sugar causes cancer of the semicolon.',
    author: 'Alan J. Perlis',
    upvotes: 56,
    downvotes: 12,
    createdAt: '2023-03-10T09:15:00Z',
    topics: ['Syntax', 'Programming Languages'],
  },
  {
    id: '4',
    content:
      "Every program has (at least) two purposes: the one for which it was written and another for which it wasn't.",
    author: 'Alan J. Perlis',
    upvotes: 67,
    downvotes: 2,
    createdAt: '2023-04-05T16:45:00Z',
    topics: ['Software Design', 'Programming Philosophy'],
  },
  {
    id: '5',
    content:
      'Is it possible that software is not like anything else, that it is meant to be discarded: that the whole point is to always see it as a soap bubble?',
    author: 'Alan Kay',
    upvotes: 29,
    downvotes: 8,
    createdAt: '2023-05-12T11:20:00Z',
    topics: ['Software Development', 'Software Lifecycle'],
  },
];
