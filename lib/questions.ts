export type Category = 'people' | 'democracy' | 'government' | 'values';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctIndex: number; // 0-based index into options array
  explanation: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  people: 'Australia and Its People',
  democracy: "Australia's Democratic Beliefs",
  government: 'Government and the Law',
  values: 'Australian Values',
};

export const CATEGORY_COLOURS: Record<Category, string> = {
  people: 'bg-blue-100 text-blue-800 border-blue-200',
  democracy: 'bg-au-green-50 text-au-green-700 border-au-green-100',
  government: 'bg-purple-100 text-purple-800 border-purple-200',
  values: 'bg-amber-100 text-amber-800 border-amber-200',
};

// The real test: 20 questions, must score 75% (15/20) overall.
// Values questions are mandatory — must answer all values questions correctly.
export const QUIZ_CONFIG = {
  totalQuestions: 20,
  passPercentage: 75,
  valuesRequiredCorrect: 1.0, // 100% of values questions must be correct
  timeLimit: 45 * 60, // 45 minutes in seconds
  questionsPerCategory: {
    people: 5,
    democracy: 5,
    government: 5,
    values: 5,
  },
};

export const QUESTIONS: Question[] = [
  // ─── AUSTRALIA AND ITS PEOPLE ───────────────────────────────────────────────
  {
    id: 'p01',
    category: 'people',
    question: 'What is the capital city of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctIndex: 2,
    explanation:
      'Canberra is the capital city of Australia. It was purpose-built as the capital as a compromise between Sydney and Melbourne.',
  },
  {
    id: 'p02',
    category: 'people',
    question: 'Who are the first peoples of Australia?',
    options: [
      'The British settlers',
      'Aboriginal and Torres Strait Islander peoples',
      'The ANZAC soldiers',
      'Pacific Islander migrants',
    ],
    correctIndex: 1,
    explanation:
      'Aboriginal and Torres Strait Islander peoples are the first peoples of Australia, with cultures going back more than 50,000 years.',
  },
  {
    id: 'p03',
    category: 'people',
    question: "What is Australia's national anthem?",
    options: [
      'God Save the King',
      'Advance Australia Fair',
      'Waltzing Matilda',
      'The Land Down Under',
    ],
    correctIndex: 1,
    explanation:
      '"Advance Australia Fair" became the official national anthem of Australia on 19 April 1984.',
  },
  {
    id: 'p04',
    category: 'people',
    question:
      'What does the large seven-pointed star (Commonwealth Star) on the Australian flag represent?',
    options: [
      'The six states and the territories',
      'The seven seas surrounding Australia',
      'The original seven colonies',
      'The seven founding fathers of federation',
    ],
    correctIndex: 0,
    explanation:
      'The Commonwealth Star (Federation Star) has seven points — six for the states and one for the territories.',
  },
  {
    id: 'p05',
    category: 'people',
    question: 'On what date did Australia become a federation?',
    options: [
      '26 January 1788',
      '1 January 1901',
      '25 April 1915',
      '9 October 1942',
    ],
    correctIndex: 1,
    explanation:
      'Australia became a federation on 1 January 1901 when the six colonies united as the Commonwealth of Australia.',
  },
  {
    id: 'p06',
    category: 'people',
    question: 'What are the colours of the Australian flag?',
    options: [
      'Red, white and blue',
      'Green and gold',
      'Blue and white',
      'Red and gold',
    ],
    correctIndex: 0,
    explanation:
      'The Australian flag features red, white and blue — including the Union Jack, the Southern Cross and the Commonwealth Star.',
  },
  {
    id: 'p07',
    category: 'people',
    question:
      'What do the stars of the Southern Cross on the Australian flag represent?',
    options: [
      "Australia's five original states",
      "The five founding fathers of Australia's constitution",
      "Australia's location in the Southern Hemisphere",
      'The five oceans surrounding Australia',
    ],
    correctIndex: 2,
    explanation:
      'The Southern Cross constellation represents Australia\'s location in the Southern Hemisphere.',
  },
  {
    id: 'p08',
    category: 'people',
    question: 'On what date is Australia Day celebrated?',
    options: ['1 January', '26 January', '25 April', '8 November'],
    correctIndex: 1,
    explanation:
      'Australia Day is celebrated on 26 January, commemorating the arrival of the First Fleet at Port Jackson in 1788.',
  },
  {
    id: 'p09',
    category: 'people',
    question: 'What do Australians commemorate on ANZAC Day (25 April)?',
    options: [
      'The federation of Australia',
      'The landing of Australian and New Zealand troops at Gallipoli in 1915',
      "Australia's independence from Britain",
      'The end of World War II',
    ],
    correctIndex: 1,
    explanation:
      'ANZAC Day commemorates the landing of Australian and New Zealand Army Corps (ANZAC) troops at Gallipoli, Turkey, on 25 April 1915.',
  },
  {
    id: 'p10',
    category: 'people',
    question: 'What is the largest city in Australia by population?',
    options: ['Canberra', 'Melbourne', 'Sydney', 'Brisbane'],
    correctIndex: 2,
    explanation:
      'Sydney is the largest city in Australia with a population of around 5 million people.',
  },
  {
    id: 'p11',
    category: 'people',
    question:
      'Which two animals on the Australian Coat of Arms are said to only move forwards (symbolising progress)?',
    options: [
      'The kangaroo and the emu',
      'The echidna and the platypus',
      'The koala and the wombat',
      'The dingo and the kookaburra',
    ],
    correctIndex: 0,
    explanation:
      'The kangaroo and the emu were chosen as emblems because they cannot easily move backwards, symbolising a nation always moving forward.',
  },
  {
    id: 'p12',
    category: 'people',
    question: 'Which ocean lies to the east of Australia?',
    options: ['Indian Ocean', 'Pacific Ocean', 'Southern Ocean', 'Arctic Ocean'],
    correctIndex: 1,
    explanation:
      'The Pacific Ocean lies to the east of Australia, while the Indian Ocean is to the west.',
  },
  {
    id: 'p13',
    category: 'people',
    question:
      'What does the Union Jack in the top-left corner of the Australian flag represent?',
    options: [
      "Australia's location near Britain",
      "Australia's historical links with Britain",
      'That Australia is part of the United Kingdom',
      "Britain's financial support for Australia",
    ],
    correctIndex: 1,
    explanation:
      "The Union Jack represents Australia's historical links with Britain.",
  },
  {
    id: 'p14',
    category: 'people',
    question:
      'When did the First Fleet (British ships carrying the first European settlers) arrive in Australia?',
    options: ['1770', '1788', '1801', '1851'],
    correctIndex: 1,
    explanation:
      'The First Fleet arrived in Australia in 1788, establishing the first European settlement at Sydney Cove.',
  },
  {
    id: 'p15',
    category: 'people',
    question: 'What are the national colours of Australia?',
    options: ['Red and white', 'Blue and white', 'Green and gold', 'Red and gold'],
    correctIndex: 2,
    explanation:
      "Australia's national colours are green and gold, which are worn by Australian athletes and sports teams.",
  },
  {
    id: 'p16',
    category: 'people',
    question:
      "Aboriginal and Torres Strait Islander peoples have lived in Australia for at least how long?",
    options: ['5,000 years', '15,000 years', '30,000 years', '50,000 years'],
    correctIndex: 3,
    explanation:
      'Aboriginal and Torres Strait Islander peoples have lived in Australia for at least 50,000 years, making them one of the oldest continuous cultures on Earth.',
  },
  {
    id: 'p17',
    category: 'people',
    question:
      'Australia has a population of approximately how many people?',
    options: ['5 million', '10 million', '26 million', '50 million'],
    correctIndex: 2,
    explanation:
      "Australia's population is approximately 26 million people.",
  },
  {
    id: 'p18',
    category: 'people',
    question:
      'What is the name of the booklet that contains all the information you need to pass the Australian citizenship test?',
    options: [
      'The Australian Handbook',
      'Our Common Bond',
      'The New Australian Guide',
      'Citizens of Australia',
    ],
    correctIndex: 1,
    explanation:
      '"Australian Citizenship: Our Common Bond" is the official resource published by the Department of Home Affairs that covers all testable content.',
  },
  {
    id: 'p19',
    category: 'people',
    question: "What is Australia's national language?",
    options: ['French', 'English', 'Mandarin', 'There is no official national language'],
    correctIndex: 1,
    explanation:
      'English is the national language of Australia and the language of government, courts and business.',
  },
  {
    id: 'p20',
    category: 'people',
    question:
      'Which of the following is one of the six states of Australia?',
    options: [
      'Canberra',
      'Northern Territory',
      'Queensland',
      'Australian Capital Territory',
    ],
    correctIndex: 2,
    explanation:
      'Queensland is one of the six states of Australia. The Northern Territory and Australian Capital Territory are territories, not states. Canberra is a city.',
  },

  // ─── AUSTRALIA'S DEMOCRATIC BELIEFS ─────────────────────────────────────────
  {
    id: 'd01',
    category: 'democracy',
    question: 'Which of the following is a fundamental democratic freedom in Australia?',
    options: [
      'The right to free housing',
      'Freedom of speech',
      'The right to a guaranteed job',
      'The right to free education',
    ],
    correctIndex: 1,
    explanation:
      "Freedom of speech is a fundamental democratic freedom in Australia. It allows people to express views and opinions freely within the law.",
  },
  {
    id: 'd02',
    category: 'democracy',
    question: 'What does freedom of religion mean in Australia?',
    options: [
      'Everyone must follow the same religion',
      'Christianity is the official state religion',
      "You can practise any religion or no religion, within the law",
      'Religion must be kept completely private',
    ],
    correctIndex: 2,
    explanation:
      'Freedom of religion in Australia means you can practise any religion or no religion at all, within the law.',
  },
  {
    id: 'd03',
    category: 'democracy',
    question: "Is voting in Australian federal elections compulsory for eligible citizens?",
    options: [
      'No, it is entirely optional',
      'Yes, it is compulsory',
      'Only for citizens born in Australia',
      'Only for citizens who have lived here for more than 10 years',
    ],
    correctIndex: 1,
    explanation:
      'Voting in Australian federal elections is compulsory for all eligible Australian citizens aged 18 and over.',
  },
  {
    id: 'd04',
    category: 'democracy',
    question: 'What does the "rule of law" mean in Australia?',
    options: [
      'The Prime Minister makes all rules',
      'The military enforces the law',
      'Different laws apply to different groups of people',
      'Everyone, including the government, must obey the law',
    ],
    correctIndex: 3,
    explanation:
      'The rule of law means that everyone — including the government, police and military — must obey the law. No one is above the law.',
  },
  {
    id: 'd05',
    category: 'democracy',
    question: 'Who can vote in Australian federal elections?',
    options: [
      'All residents of Australia',
      'All people aged 18 and over',
      'All Australian citizens aged 18 and over enrolled to vote',
      'Permanent residents and citizens aged 18 and over',
    ],
    correctIndex: 2,
    explanation:
      'Australian citizens aged 18 and over who are enrolled on the electoral roll can vote in federal elections.',
  },
  {
    id: 'd06',
    category: 'democracy',
    question: 'What does "freedom of association" mean in Australia?',
    options: [
      'You can form your own country',
      'You are free to meet and associate with other people',
      'Businesses can deny service to certain groups',
      'You can associate with foreign governments without restriction',
    ],
    correctIndex: 1,
    explanation:
      'Freedom of association means you are free to meet with and associate with other people, join groups and organisations, and form political parties.',
  },
  {
    id: 'd07',
    category: 'democracy',
    question:
      'What is one responsibility of Australian citizens?',
    options: [
      'Joining the military',
      'Attending church regularly',
      'Serving on a jury if called upon',
      'Paying to use public roads',
    ],
    correctIndex: 2,
    explanation:
      'One responsibility of Australian citizens is to serve on a jury if called upon. Jury duty is a key part of the justice system.',
  },
  {
    id: 'd08',
    category: 'democracy',
    question:
      'What is the role of a free and independent media in Australian democracy?',
    options: [
      'To follow government instructions and publicise policies',
      'To entertain people only',
      'To promote a particular political party',
      'To inform citizens and hold the government accountable',
    ],
    correctIndex: 3,
    explanation:
      'A free and independent media helps inform citizens, scrutinise the actions of government, and hold leaders accountable.',
  },
  {
    id: 'd09',
    category: 'democracy',
    question: 'What does "equality" mean in the Australian context?',
    options: [
      'Everyone earns the same amount of money',
      'All people are treated fairly and have equal opportunities under the law',
      'Only Australian citizens have equal rights',
      'Men have more rights than women',
    ],
    correctIndex: 1,
    explanation:
      'Equality in Australia means all people are treated fairly and have equal opportunities, regardless of their background, gender or religion.',
  },
  {
    id: 'd10',
    category: 'democracy',
    question:
      'Under Australian law, a person accused of a crime is considered:',
    options: [
      'Guilty until proven innocent',
      'Guilty if the police say so',
      'Innocent until proven guilty',
      'Guilty if they cannot afford a lawyer',
    ],
    correctIndex: 2,
    explanation:
      'A fundamental principle of Australian law is the presumption of innocence — a person is innocent until proven guilty by a court.',
  },
  {
    id: 'd11',
    category: 'democracy',
    question:
      'Can men and women have equal rights under Australian law?',
    options: [
      'No, men have more legal rights',
      'Only in the workplace',
      'Yes, men and women are equal under Australian law',
      'Only if they are Australian citizens',
    ],
    correctIndex: 2,
    explanation:
      'Men and women have equal rights under Australian law. Australia is committed to gender equality in all areas of life.',
  },
  {
    id: 'd12',
    category: 'democracy',
    question:
      'What democratic right do Australians have regarding political participation?',
    options: [
      'Only citizens can form political opinions',
      'The right to vote, join political parties and stand for parliament',
      'Political participation is limited to major parties',
      'Only men can stand for parliament',
    ],
    correctIndex: 1,
    explanation:
      'Australians have the right to vote, join or form political parties, campaign for a party or candidate, and stand for election themselves.',
  },
  {
    id: 'd13',
    category: 'democracy',
    question: 'What does "democracy" mean?',
    options: [
      'Rule by the military',
      'Government by a single all-powerful leader',
      'Rule by a religious authority',
      'Government by the people, through elected representatives',
    ],
    correctIndex: 3,
    explanation:
      'Democracy means government by the people. In a representative democracy, citizens elect representatives to make decisions on their behalf.',
  },
  {
    id: 'd14',
    category: 'democracy',
    question:
      'In Australia, can you join or form a political party of your choice?',
    options: [
      'No, only parties approved by the government are allowed',
      'Yes, you are free to join or form any legal political party',
      'Only if you are a born Australian citizen',
      'Only the two major parties are recognised',
    ],
    correctIndex: 1,
    explanation:
      'Freedom of political association means you are free to join or form any legal political party in Australia.',
  },
  {
    id: 'd15',
    category: 'democracy',
    question:
      "Why is the separation of powers important in Australia's system of government?",
    options: [
      'It makes the government more efficient',
      'It prevents any single person or group from having too much power',
      'It allows one person to hold all decision-making power',
      'It allows the military to govern in emergencies',
    ],
    correctIndex: 1,
    explanation:
      "The separation of powers divides government authority between the legislature, executive and judiciary. This prevents any single group from accumulating too much power.",
  },
  {
    id: 'd16',
    category: 'democracy',
    question:
      "Australia's system of government is best described as a:",
    options: [
      'Monarchy with an all-powerful King',
      'Military dictatorship',
      'Federal parliamentary democracy',
      'Single-party republic',
    ],
    correctIndex: 2,
    explanation:
      "Australia is a federal parliamentary democracy, with elected representatives in both state/territory and federal parliaments.",
  },
  {
    id: 'd17',
    category: 'democracy',
    question:
      "Which of the following is NOT one of Australia's democratic freedoms?",
    options: [
      'Freedom of speech',
      'Freedom of religion',
      'Freedom to break the law if you disagree with it',
      'Freedom of association',
    ],
    correctIndex: 2,
    explanation:
      "All Australians must obey the law. Disagreement with a law should be addressed through peaceful, democratic means — not by breaking the law.",
  },
  {
    id: 'd18',
    category: 'democracy',
    question:
      'Freedom of speech in Australia means you can:',
    options: [
      'Say anything, including threatening or inciting violence',
      'Express your views and opinions freely within the law',
      'Publish false information about people without any consequences',
      'Speak only in English in public spaces',
    ],
    correctIndex: 1,
    explanation:
      'Freedom of speech allows you to express views and opinions freely within the law. It does not protect speech that incites violence or breaks other laws.',
  },
  {
    id: 'd19',
    category: 'democracy',
    question:
      'What is one way Australians can participate in democracy beyond voting?',
    options: [
      'By paying higher taxes',
      'By working only for the government',
      'By joining a party, volunteering for a campaign, or contacting their local MP',
      'By owning a business',
    ],
    correctIndex: 2,
    explanation:
      'Beyond voting, Australians can join political parties, volunteer, contact their member of parliament, sign petitions, attend public meetings, and campaign for issues they care about.',
  },
  {
    id: 'd20',
    category: 'democracy',
    question:
      "In Australia, does the government have the right to detain someone without following legal procedures?",
    options: [
      'Yes, in any situation the government decides',
      'Yes, but only for serious crimes',
      'Yes, but only during national emergencies',
      'No, the government must follow legal procedures to detain anyone',
    ],
    correctIndex: 3,
    explanation:
      'The rule of law protects everyone from arbitrary arrest. The government must follow legal procedures when detaining any person.',
  },

  // ─── GOVERNMENT AND THE LAW ──────────────────────────────────────────────────
  {
    id: 'g01',
    category: 'government',
    question: "What is the name of Australia's national parliament?",
    options: [
      'The Australian Congress',
      'The National Assembly',
      'The Federal Parliament of Australia',
      'The Commonwealth Council',
    ],
    correctIndex: 2,
    explanation:
      "Australia's national parliament is called the Federal Parliament (or the Parliament of Australia), located in Canberra.",
  },
  {
    id: 'g02',
    category: 'government',
    question: 'What are the two houses of the Australian Federal Parliament called?',
    options: [
      'Congress and the Senate',
      'The Senate and the House of Representatives',
      'The Upper House and the Lower House',
      'The Lords and the Commons',
    ],
    correctIndex: 1,
    explanation:
      "Australia's Federal Parliament has two houses: the Senate (upper house) and the House of Representatives (lower house).",
  },
  {
    id: 'g03',
    category: 'government',
    question: 'Who is the head of state of Australia?',
    options: [
      'The Prime Minister',
      'The President',
      'The Governor-General',
      'The King of Australia',
    ],
    correctIndex: 3,
    explanation:
      "The King of Australia (currently King Charles III) is the head of state. The Governor-General represents the King in Australia.",
  },
  {
    id: 'g04',
    category: 'government',
    question: "Who represents the King of Australia in Australia?",
    options: [
      'The Prime Minister',
      'The Chief Justice',
      'The Governor-General',
      'The President of the Senate',
    ],
    correctIndex: 2,
    explanation:
      "The Governor-General is appointed by the King on the advice of the Prime Minister, and represents the King in Australia.",
  },
  {
    id: 'g05',
    category: 'government',
    question: "Who is the head of the Australian government?",
    options: [
      'The Governor-General',
      'The Prime Minister',
      'The King',
      'The Chief Justice',
    ],
    correctIndex: 1,
    explanation:
      "The Prime Minister is the head of the Australian government and leader of the party or coalition with a majority in the House of Representatives.",
  },
  {
    id: 'g06',
    category: 'government',
    question: 'How many states does Australia have?',
    options: ['4', '5', '6', '8'],
    correctIndex: 2,
    explanation:
      'Australia has six states: New South Wales, Victoria, Queensland, South Australia, Western Australia, and Tasmania.',
  },
  {
    id: 'g07',
    category: 'government',
    question: 'What are the three levels of government in Australia?',
    options: [
      'Federal, regional and city',
      'National, provincial and municipal',
      'Federal, state/territory and local',
      'Central, state and county',
    ],
    correctIndex: 2,
    explanation:
      "Australia has three levels of government: federal (national), state/territory, and local (council). Each has different responsibilities.",
  },
  {
    id: 'g08',
    category: 'government',
    question: 'Which is the highest court in Australia?',
    options: [
      'The Federal Court of Australia',
      'The Supreme Court',
      'The High Court of Australia',
      'The Court of Appeal',
    ],
    correctIndex: 2,
    explanation:
      'The High Court of Australia is the highest court. It hears appeals from all other Australian courts and resolves constitutional disputes.',
  },
  {
    id: 'g09',
    category: 'government',
    question: 'How often must federal elections be held in Australia?',
    options: [
      'Every year',
      'Every two years',
      'At least every three years',
      'Every five years',
    ],
    correctIndex: 2,
    explanation:
      "Federal elections for the House of Representatives must be held at least every three years, though the Prime Minister can call an election earlier.",
  },
  {
    id: 'g10',
    category: 'government',
    question: 'What is preferential voting in Australia?',
    options: [
      'Only preferred candidates can stand for election',
      "Voters number candidates in order of preference",
      'The government chooses preferred voters',
      'Candidates can refuse votes from certain people',
    ],
    correctIndex: 1,
    explanation:
      "Preferential voting allows voters to rank candidates in order of preference (1, 2, 3…). This ensures the winner has broad support.",
  },
  {
    id: 'g11',
    category: 'government',
    question: 'What is the main role of the Senate?',
    options: [
      'To elect the Prime Minister',
      'To appoint judges to the High Court',
      'To manage state governments',
      'To review and pass legislation as a house of review',
    ],
    correctIndex: 3,
    explanation:
      "The Senate reviews and passes legislation. It is sometimes called the 'house of review' and acts as a check on the House of Representatives.",
  },
  {
    id: 'g12',
    category: 'government',
    question:
      'Which of the following is a responsibility of local councils?',
    options: [
      'Making national laws',
      'Managing local roads, parks and rubbish collection',
      'Controlling immigration',
      'Running public hospitals',
    ],
    correctIndex: 1,
    explanation:
      'Local councils are responsible for local services such as roads, footpaths, parks, rubbish collection, libraries and local planning.',
  },
  {
    id: 'g13',
    category: 'government',
    question: 'What is the Australian Constitution?',
    options: [
      'A document written by British Parliament in 1770',
      'A list of citizens rights and responsibilities',
      'The set of rules by which Australia is governed, which came into effect in 1901',
      'An international treaty with New Zealand',
    ],
    correctIndex: 2,
    explanation:
      'The Australian Constitution is the document that sets out the rules for governing Australia. It came into effect on 1 January 1901 when Australia became a federation.',
  },
  {
    id: 'g14',
    category: 'government',
    question: 'Which party or coalition forms the Australian government?',
    options: [
      'The party that wins the most states',
      'The party chosen by the Senate',
      'The party or coalition with a majority in the House of Representatives',
      'The party chosen by the Governor-General independently',
    ],
    correctIndex: 2,
    explanation:
      'The party or coalition that wins a majority of seats in the House of Representatives forms the government.',
  },
  {
    id: 'g15',
    category: 'government',
    question:
      "Which of the following is a responsibility of the federal government?",
    options: [
      'Local rubbish collection',
      'Primary school education',
      'Defence and national security',
      'Local planning permits',
    ],
    correctIndex: 2,
    explanation:
      'Defence and national security are federal government responsibilities. State and local governments handle education, health and local services.',
  },
  {
    id: 'g16',
    category: 'government',
    question: "How is Australia's Governor-General appointed?",
    options: [
      'Elected by the Australian public',
      'Chosen by Parliament by majority vote',
      'Appointed by the King on the advice of the Prime Minister',
      'Appointed by the Chief Justice',
    ],
    correctIndex: 2,
    explanation:
      "The Governor-General is appointed by the King on the advice of the Prime Minister.",
  },
  {
    id: 'g17',
    category: 'government',
    question:
      "Which of the following is a responsibility of state and territory governments?",
    options: [
      'Defence',
      'Foreign affairs',
      'Immigration policy',
      'Schools, hospitals and public transport',
    ],
    correctIndex: 3,
    explanation:
      "State and territory governments are responsible for schools, hospitals, police, public transport, roads and other services.",
  },
  {
    id: 'g18',
    category: 'government',
    question:
      'What is a by-election in Australia?',
    options: [
      'An election to choose a new Prime Minister',
      'An election held to fill a vacancy in parliament between general elections',
      'An election for local council positions',
      'An annual vote on policy issues',
    ],
    correctIndex: 1,
    explanation:
      "A by-election is held to fill a vacancy in a seat in parliament that occurs between general elections, for example when a member dies or resigns.",
  },
  {
    id: 'g19',
    category: 'government',
    question:
      'What are the three arms of government in Australia?',
    options: [
      'The monarchy, the parliament, and the military',
      'The Prime Minister, the Cabinet, and the courts',
      'The legislature, the executive, and the judiciary',
      'The federal, state, and local governments',
    ],
    correctIndex: 2,
    explanation:
      "The three arms (or 'branches') of government are: the legislature (Parliament, which makes laws), the executive (Cabinet/government, which implements laws), and the judiciary (courts, which interpret laws).",
  },
  {
    id: 'g20',
    category: 'government',
    question:
      'Who has the power to change the Australian Constitution?',
    options: [
      'The Prime Minister alone',
      'The Federal Parliament alone',
      'The Australian people through a referendum',
      'The Governor-General',
    ],
    correctIndex: 2,
    explanation:
      "To change the Australian Constitution, a proposal must pass Parliament and then be approved by a national referendum — a vote of all eligible Australians. A majority of voters nationally AND a majority of states must approve it.",
  },

  // ─── AUSTRALIAN VALUES ────────────────────────────────────────────────────────
  {
    id: 'v01',
    category: 'values',
    question: 'What does "mateship" mean in Australian culture?',
    options: [
      'A formal business partnership agreement',
      'A spirit of friendship, loyalty and mutual support',
      'A military alliance between Australia and New Zealand',
      'A legal contract between neighbours',
    ],
    correctIndex: 1,
    explanation:
      "Mateship is a core Australian value that describes friendship, loyalty and a willingness to help each other. It is a key part of Australia's national identity.",
  },
  {
    id: 'v02',
    category: 'values',
    question: 'Which of the following best describes a core Australian value?',
    options: [
      'Looking after only yourself and your family',
      'Following only your own cultural traditions regardless of Australian laws',
      'Respect for the equal worth and dignity of every individual',
      'Putting the interests of your group above Australian law',
    ],
    correctIndex: 2,
    explanation:
      "Respect for the equal worth and dignity of every individual is a core Australian value. All people are valued equally regardless of their background.",
  },
  {
    id: 'v03',
    category: 'values',
    question: 'What does "a fair go" mean in Australian culture?',
    options: [
      'Playing fairly only in sport',
      'Giving everyone an equal opportunity to succeed',
      'Free government services for everyone',
      'Free education for all children',
    ],
    correctIndex: 1,
    explanation:
      '"A fair go" is a distinctly Australian expression meaning giving everyone an equal chance to succeed, regardless of their background.',
  },
  {
    id: 'v04',
    category: 'values',
    question:
      'Under Australian values, how should you treat people from different cultural backgrounds?',
    options: [
      'Only associate with people from your own cultural background',
      'Avoid contact with people who are different from you',
      'Report people with different customs to authorities',
      'With respect, tolerance and openness',
    ],
    correctIndex: 3,
    explanation:
      "Australia is a multicultural society. Australian values require treating all people with respect and tolerance, regardless of their background.",
  },
  {
    id: 'v05',
    category: 'values',
    question:
      'In Australia, is it acceptable to discriminate against someone because of their religion?',
    options: [
      'Yes, if the religion is a minority',
      'No, religious discrimination is unacceptable and unlawful',
      'Yes, if done in a private setting',
      'Only in some states and territories',
    ],
    correctIndex: 1,
    explanation:
      'Religious discrimination is unacceptable and unlawful in Australia. Everyone has the right to practise their religion freely and without discrimination.',
  },
  {
    id: 'v06',
    category: 'values',
    question: 'What is expected of all people living in Australia regarding Australian laws?',
    options: [
      'They may follow their home country\'s laws instead',
      'Laws only fully apply after 5 years of residency',
      'Permanent residents do not need to follow all laws',
      'Everyone must obey Australian laws',
    ],
    correctIndex: 3,
    explanation:
      "All people in Australia — residents, visitors and citizens — must obey Australian laws. There are no exceptions based on cultural background or beliefs.",
  },
  {
    id: 'v07',
    category: 'values',
    question:
      'Can employers in Australia discriminate against job applicants because of their race?',
    options: [
      'Yes, in private companies',
      'No, racial discrimination in employment is against the law',
      'Only if the job requires a specific cultural background',
      'Yes, as long as both parties agree',
    ],
    correctIndex: 1,
    explanation:
      'Racial discrimination in employment is against the law in Australia. Everyone has the right to equal opportunity in the workplace.',
  },
  {
    id: 'v08',
    category: 'values',
    question:
      'What does Australia\'s commitment to equality mean for women?',
    options: [
      'Women have fewer legal rights than men',
      'Women are restricted to certain occupations',
      'Women cannot hold political office',
      'Women have the same rights, freedoms and opportunities as men',
    ],
    correctIndex: 3,
    explanation:
      "Australia is committed to gender equality. Women have the same rights, freedoms and opportunities as men in all areas of life.",
  },
  {
    id: 'v09',
    category: 'values',
    question:
      'If you disagree with an Australian law, what is the right course of action?',
    options: [
      'Ignore or break the law if you strongly disagree',
      'Force others in your community to change the law',
      'Work peacefully through democratic means to change the law',
      'Leave Australia if you disagree with its laws',
    ],
    correctIndex: 2,
    explanation:
      'If you disagree with a law, the right approach is to work peacefully and democratically to change it — for example by contacting your MP, joining campaigns or voting.',
  },
  {
    id: 'v10',
    category: 'values',
    question: 'Can people in Australia practise their own culture and customs?',
    options: [
      'No, all residents must fully adopt Australian customs',
      'Only during designated cultural festivals',
      'Yes, as long as they obey Australian law',
      'Only if their customs are approved by the government',
    ],
    correctIndex: 2,
    explanation:
      "Australia celebrates cultural diversity. People are free to maintain and practise their own culture and customs, as long as they obey Australian law.",
  },
  {
    id: 'v11',
    category: 'values',
    question: 'What should you do if you witness a crime in Australia?',
    options: [
      'Ignore it to avoid getting involved',
      'Deal with it yourself',
      'Report it to your community leader only',
      'Report it to the police',
    ],
    correctIndex: 3,
    explanation:
      'If you witness a crime, you should report it to the police. Working with the police and justice system is an important civic responsibility.',
  },
  {
    id: 'v12',
    category: 'values',
    question: 'Australian values include respect for people with which of the following?',
    options: [
      'Only those who have lived in Australia for 10 years',
      'Only people who share the same political views',
      'Only Australian-born citizens',
      'All people regardless of background, gender, religion or lifestyle',
    ],
    correctIndex: 3,
    explanation:
      "Australian values require respect for all people, regardless of their background, gender, religion or lifestyle choices.",
  },
  {
    id: 'v13',
    category: 'values',
    question: 'What does it mean that Australia is a "secular" country?',
    options: [
      'Religion controls the government',
      'Christianity is the official religion',
      'The government does not follow any religion; church and state are separate',
      'Religion is banned from public life',
    ],
    correctIndex: 2,
    explanation:
      "Australia is a secular country — the government is not guided by religious teachings, and there is no official state religion. Everyone is free to practise religion privately.",
  },
  {
    id: 'v14',
    category: 'values',
    question:
      'How should disputes be resolved according to Australian values?',
    options: [
      'Through violence if other methods fail',
      'By the strongest or most powerful person deciding',
      'Through tribal or community law',
      'Through peaceful and lawful means',
    ],
    correctIndex: 3,
    explanation:
      "Australian values emphasise resolving disputes peacefully and lawfully — through negotiation, mediation or the courts.",
  },
  {
    id: 'v15',
    category: 'values',
    question:
      'What does "tolerance" mean as an Australian value?',
    options: [
      'Accepting that everyone can do whatever they want',
      'Ignoring illegal behaviour in the community',
      'Agreeing with everyone around you',
      'Accepting and respecting people with different views, backgrounds and ways of life',
    ],
    correctIndex: 3,
    explanation:
      "Tolerance means accepting and respecting people who are different from you — including those with different beliefs, backgrounds or lifestyles.",
  },
  {
    id: 'v16',
    category: 'values',
    question: 'Australia is described as a ______ society.',
    options: ['Homogeneous', 'Segregated', 'Multicultural', 'Monocultural'],
    correctIndex: 2,
    explanation:
      "Australia is a multicultural society, with people from many different backgrounds, cultures and religions living together.",
  },
  {
    id: 'v17',
    category: 'values',
    question:
      "Which of the following statements best reflects Australia's approach to equality of opportunity?",
    options: [
      'Success depends entirely on which family or background you come from',
      'The government guarantees everyone equal outcomes in life',
      'All people deserve a fair chance to succeed based on their effort and ability',
      'Equal opportunity only applies to Australian-born citizens',
    ],
    correctIndex: 2,
    explanation:
      "Australia believes everyone deserves a fair chance to succeed regardless of their background. This is captured in the idea of 'a fair go'.",
  },
  {
    id: 'v18',
    category: 'values',
    question:
      'Under Australian law, is a person who has been accused of a crime considered guilty before trial?',
    options: [
      'Yes, if the police charge them',
      'Yes, for serious crimes',
      'No, everyone is presumed innocent until proven guilty',
      'It depends on the state or territory',
    ],
    correctIndex: 2,
    explanation:
      "The presumption of innocence is a cornerstone of the Australian justice system. Everyone is innocent until proven guilty in a court of law.",
  },
  {
    id: 'v19',
    category: 'values',
    question:
      'In Australia, it is unacceptable to use violence or intimidation to:',
    options: [
      'Defend your home',
      'Resolve a dispute or force others to accept your views',
      'Participate in sport',
      'React to immediate physical danger',
    ],
    correctIndex: 1,
    explanation:
      "Australian values strictly reject the use of violence or intimidation to resolve disputes or force others to accept your views. All disputes should be resolved peacefully.",
  },
  {
    id: 'v20',
    category: 'values',
    question:
      'What is expected of Australian citizens and residents regarding English?',
    options: [
      'Only government officials must speak English',
      'English is banned in private cultural settings',
      'English is not required in any context',
      'Learning English is encouraged as it is the national language and helps people participate fully in Australian life',
    ],
    correctIndex: 3,
    explanation:
      "While there is no law requiring everyone to speak English, learning English is strongly encouraged as it helps people participate fully in Australian community and working life.",
  },
];

export function getQuestionsByCategory(category: Category): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}

export function getRandomQuestions(
  count: number,
  category?: Category,
): Question[] {
  const pool = category
    ? QUESTIONS.filter((q) => q.category === category)
    : QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Build a mock test matching the real Australian citizenship test format:
 * 20 questions, ~5 per category, ensuring values questions are included. */
export function buildMockTest(): Question[] {
  const { questionsPerCategory } = QUIZ_CONFIG;
  const selected: Question[] = [];
  for (const [cat, count] of Object.entries(questionsPerCategory) as [
    Category,
    number,
  ][]) {
    const pool = QUESTIONS.filter((q) => q.category === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, count));
  }
  // Final shuffle so categories aren't in blocks
  return selected.sort(() => Math.random() - 0.5);
}

export function scoreQuiz(
  questions: Question[],
  answers: Record<string, number>,
): {
  total: number;
  correct: number;
  percentage: number;
  passed: boolean;
  valuesCorrect: number;
  valuesTotal: number;
  byCategory: Record<Category, { correct: number; total: number }>;
} {
  const byCategory: Record<Category, { correct: number; total: number }> = {
    people: { correct: 0, total: 0 },
    democracy: { correct: 0, total: 0 },
    government: { correct: 0, total: 0 },
    values: { correct: 0, total: 0 },
  };

  let correct = 0;
  for (const q of questions) {
    byCategory[q.category].total++;
    if (answers[q.id] === q.correctIndex) {
      correct++;
      byCategory[q.category].correct++;
    }
  }

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const valuesTotal = byCategory.values.total;
  const valuesCorrect = byCategory.values.correct;
  const valuesPassed =
    valuesTotal === 0 || valuesCorrect / valuesTotal >= QUIZ_CONFIG.valuesRequiredCorrect;
  const passed = percentage >= QUIZ_CONFIG.passPercentage && valuesPassed;

  return { total, correct, percentage, passed, valuesCorrect, valuesTotal, byCategory };
}
