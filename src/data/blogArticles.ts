export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  image: string
  content: string[]
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'protein-timing-for-recovery',
    title: 'Does Protein Timing Actually Matter for Recovery?',
    category: 'Nutrition Science',
    readMinutes: 6,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    excerpt: 'The "anabolic window" gets a lot of hype. Here is what actually matters for muscle recovery.',
    content: [
      'For years, the "30-minute anabolic window" was treated as gospel — miss it, and your workout was supposedly wasted. More recent research paints a calmer picture: total daily protein intake matters far more than the exact minute you eat it.',
      'That said, timing is not irrelevant. Spreading protein across 3-4 meals a day, each with 25-40g, tends to support muscle protein synthesis better than cramming it all into one sitting.',
      'Practically: if you train fasted or your next meal is hours away, a protein-forward bowl within a couple of hours of training is a reasonable default. Beyond that window, consistency across the day is what moves the needle.',
    ],
  },
  {
    slug: 'reading-a-nutrition-label',
    title: 'How to Actually Read a Nutrition Label in 20 Seconds',
    category: 'Guides',
    readMinutes: 4,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    excerpt: 'Skip the marketing claims on the front of the pack — here is what to check on the back.',
    content: [
      'Front-of-pack claims like "high protein" or "low fat" are marketing, not nutrition facts. The real information is always on the back label.',
      'Start with serving size — many packs quietly list two or three servings, which changes every number underneath it. Then check protein and fiber, the two macros most people under-eat, before worrying about calories.',
      'On NutriFuel, every kitchen publishes verified nutrition per item, so you can skip the guesswork entirely and filter directly by protein, calories, or dietary preference.',
    ],
  },
  {
    slug: 'vegan-protein-sources-that-work',
    title: 'Plant-Based Protein Sources That Actually Hit Your Target',
    category: 'Vegan & Vegetarian',
    readMinutes: 5,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    excerpt: 'Tofu, tempeh, lentils and edamame — how to stack plant proteins to close the gap.',
    content: [
      'A common worry with plant-based eating is protein adequacy. The fix is not one "miracle" ingredient — it is stacking a few reliable sources across the day.',
      'Tofu and tempeh both land around 15-20g of protein per 100g and take on whatever flavor they are cooked in. Lentils and chickpeas add protein alongside a large dose of fiber, which most diets are short on anyway.',
      'Edamame is an easy snack-sized boost — about 11g of protein per half-cup — and pairs well with a bowl or salad that is otherwise light on protein.',
    ],
  },
  {
    slug: 'meal-prep-without-burning-out',
    title: 'Meal Prep Without Burning Out on the Same Five Meals',
    category: 'Guides',
    readMinutes: 7,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
    excerpt: 'The real reason meal prep fails is not effort — it is monotony. Here is how to fix it.',
    content: [
      'Most meal-prep plans fail within three weeks, and it is rarely about discipline — it is boredom. Eating the same grilled chicken and rice five days straight gets old fast.',
      'A better approach: prep 2-3 base proteins and 2-3 base carbs separately, then rotate sauces, spice blends, and vegetables across the week so the combinations feel different even when the macros are similar.',
      'This is also why a marketplace model works well for consistency — you can hit the same macro target from an entirely different cuisine each day without recalculating anything yourself.',
    ],
  },
  {
    slug: 'is-fasted-cardio-worth-it',
    title: 'Is Fasted Cardio Actually Worth It?',
    category: 'Training',
    readMinutes: 5,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888',
    excerpt: 'The fat-loss claims around fasted cardio are mostly overstated. Here is the nuance.',
    content: [
      'Fasted cardio does shift the body toward burning a higher percentage of fat for fuel during the session itself. The catch: total daily fat loss depends on your overall calorie balance across the full day, not what substrate you burn during one hour of cardio.',
      'Where fasted training can help is adherence — some people simply prefer training before eating. If that is not you, there is no metabolic penalty to eating beforehand.',
      'The bigger lever, by far, is hitting your protein target consistently so you preserve muscle while in a deficit.',
    ],
  },
  {
    slug: 'building-a-goal-based-plate',
    title: 'How to Build a Goal-Based Plate in Under a Minute',
    category: 'Guides',
    readMinutes: 4,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    excerpt: 'A simple mental framework for building a plate that matches your target — no app required.',
    content: [
      'If you do not want to track every gram, a simple visual framework gets you most of the way there: fill a quarter of the plate with a palm-sized protein source, a quarter with a fist-sized carb source, and the rest with vegetables.',
      'For a higher-protein goal, swap the ratio — half the plate becomes protein, with carbs and vegetables splitting the rest.',
      'This is roughly what NutriFuel\'s goal studio automates for you: instead of eyeballing it, tell us your target and we rank every eligible meal (and two-item combo) against it directly.',
    ],
  },
]
