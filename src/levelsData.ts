import { Level } from './types';

export const levels: Level[] = [
  {
    id: 1,
    title: "Space Odyssey Odyssey",
    emoji: "🚀",
    theme: "space",
    difficulty: "Easy",
    bgColor: "bg-indigo-900",
    accentColor: "text-indigo-400",
    gradientClass: "from-indigo-900 via-purple-900 to-slate-900",
    differences: [
      {
        id: "space-planet-ring",
        name: "Saturn's Ring",
        hint: "Look at the big orange planet on the left side of the sky!",
        x: 20,
        y: 30,
        radius: 10
      },
      {
        id: "space-alien-eyes",
        name: "Alien's Eyes",
        hint: "Check the green alien inside the glass spaceship on the right side!",
        x: 80,
        y: 25,
        radius: 8
      },
      {
        id: "space-rocket-flame",
        name: "Rocket Booster Flame",
        hint: "Look closely at the fiery exhaust under the flying red rocket ship!",
        x: 50,
        y: 70,
        radius: 8
      },
      {
        id: "space-astronaut-visor",
        name: "Astronaut Visor Color",
        hint: "Inspect the glass face visor of the floating space-suit banana on the bottom-left!",
        x: 18,
        y: 75,
        radius: 9
      },
      {
        id: "space-shooting-star",
        name: "Shooting Star Trail",
        hint: "Look near the bottom-right corner for a fast flying star!",
        x: 75,
        y: 75,
        radius: 8
      }
    ]
  },
  {
    id: 2,
    title: "Coral Kingdom Cove",
    emoji: "🐠",
    theme: "underwater",
    difficulty: "Easy",
    bgColor: "bg-teal-900",
    accentColor: "text-teal-400",
    gradientClass: "from-sky-900 via-teal-950 to-blue-950",
    differences: [
      {
        id: "sea-octopus-hat",
        name: "Octopus Captain Hat",
        hint: "Look at the pink octopus. Is his pirate hat the same color on both sides?",
        x: 25,
        y: 40,
        radius: 10
      },
      {
        id: "sea-chest-loot",
        name: "Treasure Gold vs Gems",
        hint: "Compare the shiny treasure inside the pirate chest on the sea floor!",
        x: 75,
        y: 80,
        radius: 9
      },
      {
        id: "sea-fish-direction",
        name: "Swimmer Fish Direction",
        hint: "Look at the orange clownfish swimming near the middle top. Which way is he pointing?",
        x: 50,
        y: 20,
        radius: 8
      },
      {
        id: "sea-seahorse-hide",
        name: "Cute Baby Seahorse",
        hint: "Inspect the green sea grass on the bottom-right closely for a tiny hidden friend!",
        x: 85,
        y: 55,
        radius: 8
      },
      {
        id: "sea-sub-portholes",
        name: "Submarine Windows",
        hint: "Count the round yellow windows on the orange submarine in the middle!",
        x: 45,
        y: 60,
        radius: 8
      }
    ]
  },
  {
    id: 3,
    title: "Dino Valley Playground",
    emoji: "🦕",
    theme: "dino",
    difficulty: "Medium",
    bgColor: "bg-emerald-950",
    accentColor: "text-emerald-400",
    gradientClass: "from-emerald-950 via-green-900 to-amber-950",
    differences: [
      {
        id: "dino-bowtie",
        name: "Dino's Pretty Bowtie",
        hint: "The tall blue Brachiosaurus dinosaur is dressed up! Check his collar bowtie!",
        x: 25,
        y: 55,
        radius: 9
      },
      {
        id: "dino-volcano",
        name: "Volcano Eruption shape",
        hint: "Look way back in the background at the top of the fiery volcano!",
        x: 75,
        y: 25,
        radius: 10
      },
      {
        id: "dino-eggs",
        name: "Spotted Dino Eggs",
        hint: "Look at the nest with two dinosaur eggs on the bottom-right. Check their patterns!",
        x: 80,
        y: 80,
        radius: 9
      },
      {
        id: "dino-pterodactyl-cap",
        name: "Pterodactyl Pilot Cap",
        hint: "Look at the flying dinosaur in the high clouds. What is he wearing on his head?",
        x: 45,
        y: 15,
        radius: 8
      },
      {
        id: "dino-fossil-crystal",
        name: "Glow Crystal on Rock",
        hint: "Look at the rocky fossil platform near the bottom-left corner. Something is glowing!",
        x: 15,
        y: 82,
        radius: 8
      }
    ]
  },
  {
    id: 4,
    title: "Sweet Candyland Dream",
    emoji: "🍭",
    theme: "candy",
    difficulty: "Medium",
    bgColor: "bg-fuchsia-950",
    accentColor: "text-fuchsia-400",
    gradientClass: "from-pink-950 via-fuchsia-950 to-rose-950",
    differences: [
      {
        id: "candy-chimney",
        name: "Gingerbread Chimney",
        hint: "Inspect the gingerbread house on the left. Look closely at its sweet chimney!",
        x: 30,
        y: 55,
        radius: 9
      },
      {
        id: "candy-lollipop",
        name: "Giant Swirl Lollipop",
        hint: "Look at the huge swirl lollipop on the right. Are the stripes rotating the same way?",
        x: 78,
        y: 65,
        radius: 10
      },
      {
        id: "candy-gummybear",
        name: "Happy Gummy Bear",
        hint: "Find the little jelly gummy bear sitting in the chocolate path in the middle!",
        x: 52,
        y: 80,
        radius: 8
      },
      {
        id: "candy-cloud-face",
        name: "Marshmallow Cloud Face",
        hint: "Look high up in the sky at the puffy marshmallow cloud. Is it awake or asleep?",
        x: 50,
        y: 15,
        radius: 10
      },
      {
        id: "candy-lake-fruit",
        name: "Floating Lake Fruit",
        hint: "Look closely at the chocolate shake river on the bottom-left. What delicious fruit is floating?",
        x: 15,
        y: 78,
        radius: 8
      }
    ]
  },
  {
    id: 5,
    title: "Toyland Carnival",
    emoji: "🧸",
    theme: "toys",
    difficulty: "Hard",
    bgColor: "bg-blue-950",
    accentColor: "text-cyan-400",
    gradientClass: "from-cyan-950 via-blue-950 to-indigo-950",
    differences: [
      {
        id: "toy-teddy-badge",
        name: "Teddy's Chest Badge",
        hint: "Look at the cute brown teddy bear on the bottom-left. Look at his tummy badge!",
        x: 22,
        y: 65,
        radius: 9
      },
      {
        id: "toy-robot-item",
        name: "Toy Robot's Gift",
        hint: "Look at the wind-up retro robot on the right. What is he holding in his hand?",
        x: 78,
        y: 65,
        radius: 9
      },
      {
        id: "toy-train-number",
        name: "Choo-Choo Train Number",
        hint: "Check the red steam train engine on the floor tracks. Look at the number painted on it!",
        x: 50,
        y: 78,
        radius: 8
      },
      {
        id: "toy-top-sparkles",
        name: "Spinning Top Sparkles",
        hint: "Find the colorful spinning top toy near the middle. Look at the magic dust sparkles!",
        x: 50,
        y: 40,
        radius: 8
      },
      {
        id: "toy-mobile-danglers",
        name: "Hanging Mobile Shapes",
        hint: "Look high up at the baby mobile hanging in the top left. Count and check the stars!",
        x: 30,
        y: 18,
        radius: 8
      }
    ]
  },
  {
    id: 6,
    title: "Wizard's Magic Attic",
    emoji: "🏰",
    theme: "magic",
    difficulty: "Hard",
    bgColor: "bg-violet-950",
    accentColor: "text-violet-400",
    gradientClass: "from-violet-950 via-indigo-950 to-slate-950",
    differences: [
      {
        id: "magic-hat-stars",
        name: "Witch's Hat Stars",
        hint: "Look at the tall pointed sorcerer's hat in the middle-left. Check its starry pattern!",
        x: 32,
        y: 48,
        radius: 9
      },
      {
        id: "magic-crystal-vision",
        name: "Crystal Ball Vision",
        hint: "Peer inside the glowing crystal ball on the gold stand to the bottom-right!",
        x: 76,
        y: 75,
        radius: 9
      },
      {
        id: "magic-spellbook",
        name: "Open Spellbook Crest",
        hint: "Check the magical symbols drawn on the open brown book on the reading table!",
        x: 50,
        y: 70,
        radius: 8
      },
      {
        id: "magic-owl-eyes",
        name: "Guard Owl's Eyes",
        hint: "Look at the cute wise owl perched on the high wooden shelf in the top-left!",
        x: 18,
        y: 22,
        radius: 8
      },
      {
        id: "magic-potion",
        name: "Bubbling Potion Bottle",
        hint: "Look at the colorful corked potion flask resting on the right bookshelf shelf!",
        x: 82,
        y: 25,
        radius: 8
      }
    ]
  },
  {
    id: 7,
    title: "Retro Arcade Arcade",
    emoji: "🕹️",
    theme: "arcade",
    difficulty: "Hard",
    bgColor: "bg-slate-900",
    accentColor: "text-pink-500",
    gradientClass: "from-purple-950 via-slate-950 to-pink-950",
    differences: [
      {
        id: "arcade-joystick",
        name: "Joystick Knob Shape",
        hint: "Check the main red joystick on the cabinet. Is the top ball or square shaped?",
        x: 50,
        y: 72,
        radius: 10
      },
      {
        id: "arcade-ghost",
        name: "Ghost Eye Direction",
        hint: "Look at the purple pixel ghost floating on the game screen. Where is it looking?",
        x: 25,
        y: 35,
        radius: 9
      },
      {
        id: "arcade-highscore",
        name: "High Score digits",
        hint: "Check the glowing green scoreboard numbers at the very top of the arcade cabinet screen!",
        x: 50,
        y: 18,
        radius: 8
      },
      {
        id: "arcade-invader",
        name: "Space Invader Arms",
        hint: "Look at the cyan retro invader sprite on the left panel. Are its hands pointing up or down?",
        x: 15,
        y: 65,
        radius: 8
      },
      {
        id: "arcade-coin-glow",
        name: "Insert Coin Light",
        hint: "Check the double coin slots under the console controls. Is the left slot glowing red or dark?",
        x: 80,
        y: 82,
        radius: 9
      }
    ]
  },
  {
    id: 8,
    title: "Desert Oasis Palace",
    emoji: "🕌",
    theme: "desert",
    difficulty: "Medium",
    bgColor: "bg-amber-900",
    accentColor: "text-amber-500",
    gradientClass: "from-amber-950 via-orange-900 to-yellow-950",
    differences: [
      {
        id: "desert-camel",
        name: "Camel Humps count",
        hint: "Look at the friendly camel standing near the left sand dune. Count its humps!",
        x: 20,
        y: 75,
        radius: 10
      },
      {
        id: "desert-coconuts",
        name: "Palm Tree Coconuts",
        hint: "Compare the round coconuts hanging high in the palm tree on the right!",
        x: 82,
        y: 42,
        radius: 9
      },
      {
        id: "desert-sun-style",
        name: "Sunny Face style",
        hint: "Look at the blazing desert sun in the high sky. Is it wearing cool sunglasses or just smiling?",
        x: 50,
        y: 18,
        radius: 9
      },
      {
        id: "desert-lamp-smoke",
        name: "Magic Genie Lamp Sparkle",
        hint: "Look at the tiny golden genie lamp sitting on the prayer rug. What kind of puff is coming out?",
        x: 50,
        y: 85,
        radius: 8
      },
      {
        id: "desert-flag-dir",
        name: "Palace Tower Flag",
        hint: "Look at the red flag flying from the golden dome of the background palace tower. Which way is the wind blowing it?",
        x: 80,
        y: 15,
        radius: 8
      }
    ]
  },
  {
    id: 9,
    title: "Whispering Forest Path",
    emoji: "🌲",
    theme: "forest",
    difficulty: "Easy",
    bgColor: "bg-emerald-900",
    accentColor: "text-emerald-400",
    gradientClass: "from-teal-950 via-emerald-950 to-green-950",
    differences: [
      {
        id: "forest-squirrel-acorn",
        name: "Squirrel's Acorn",
        hint: "Look at the cute brown squirrel sitting on the tree stump on the left! What is he holding?",
        x: 22,
        y: 72,
        radius: 9
      },
      {
        id: "forest-owl",
        name: "Tree Hollow Owl",
        hint: "Inspect the tree trunk hollow on the right side. Is the nesting owl awake or fast asleep?",
        x: 82,
        y: 45,
        radius: 8
      },
      {
        id: "forest-mushroom",
        name: "Spotted Mushroom",
        hint: "Check the big red mushroom on the grassy forest floor in the middle. Look at its spots!",
        x: 50,
        y: 82,
        radius: 8
      },
      {
        id: "forest-butterfly",
        name: "Butterfly Wings",
        hint: "Find the lovely purple butterfly fluttering near the center! Are its wings plain or dotted?",
        x: 48,
        y: 32,
        radius: 8
      },
      {
        id: "forest-signpost",
        name: "Wooden Signpost",
        hint: "Look at the wooden directional sign on the bottom-right. Which way is the arrow pointing?",
        x: 78,
        y: 78,
        radius: 9
      }
    ]
  },
  {
    id: 10,
    title: "Safari Adventure Plains",
    emoji: "🦁",
    theme: "safari",
    difficulty: "Medium",
    bgColor: "bg-orange-950",
    accentColor: "text-amber-400",
    gradientClass: "from-amber-950 via-orange-950 to-yellow-950",
    differences: [
      {
        id: "safari-giraffe-spots",
        name: "Giraffe's Neck Spots",
        hint: "Compare the long neck of the friendly giraffe standing on the left side!",
        x: 24,
        y: 45,
        radius: 10
      },
      {
        id: "safari-lion-crown",
        name: "Lion's Crown",
        hint: "Look at the sleepy lion resting under the tree in the center. Is he wearing a mini gold crown?",
        x: 52,
        y: 75,
        radius: 9
      },
      {
        id: "safari-zebra-stripes",
        name: "Zebra's Stripes",
        hint: "Check the zebra playing on the bottom-right. Look closely at the pattern of stripes on its back!",
        x: 78,
        y: 72,
        radius: 9
      },
      {
        id: "safari-bird-beak",
        name: "Bird's Beak",
        hint: "Look at the yellow bird perched on the acacia branch. What is it carrying in its beak?",
        x: 45,
        y: 24,
        radius: 8
      },
      {
        id: "safari-tree-foliage",
        name: "Acacia Tree Leaf count",
        hint: "Compare the high green foliage of the giant acacia tree on the right!",
        x: 80,
        y: 28,
        radius: 10
      }
    ]
  },
  {
    id: 11,
    title: "Happy Barnyard Farm",
    emoji: "🚜",
    theme: "farm",
    difficulty: "Medium",
    bgColor: "bg-red-950",
    accentColor: "text-amber-500",
    gradientClass: "from-red-950 via-orange-950 to-amber-950",
    differences: [
      {
        id: "farm-weather-rooster",
        name: "Weather Vane Rooster",
        hint: "Check the gold rooster weather vane at the very peak of the red barn roof! Which way does he point?",
        x: 35,
        y: 30,
        radius: 9
      },
      {
        id: "farm-pig-puddle",
        name: "Piggy's Mud Puddle",
        hint: "Look at the happy pink pig playing in the puddle on the bottom-left. Is it muddy or grassy?",
        x: 20,
        y: 78,
        radius: 9
      },
      {
        id: "farm-scarecrow-hat",
        name: "Scarecrow Hat",
        hint: "Inspect the scarecrow standing guard on the right side. What is he wearing on his head?",
        x: 78,
        y: 62,
        radius: 8
      },
      {
        id: "farm-tractor-wheel",
        name: "Tractor Wheel",
        hint: "Check the green farm tractor parked near the middle. Look at the color of its big rear wheel rim!",
        x: 52,
        y: 78,
        radius: 9
      },
      {
        id: "farm-sheep-wool",
        name: "Sheep's Wool Coat",
        hint: "Look at the fluffy woolly sheep grazing on the bottom-right. Is it a white or black sheep?",
        x: 82,
        y: 80,
        radius: 8
      }
    ]
  },
  {
    id: 12,
    title: "Winter Wonderland Lodge",
    emoji: "⛄",
    theme: "winter",
    difficulty: "Hard",
    bgColor: "bg-sky-950",
    accentColor: "text-sky-300",
    gradientClass: "from-blue-950 via-slate-900 to-sky-950",
    differences: [
      {
        id: "winter-snowman-nose",
        name: "Snowman Carrot Nose",
        hint: "Look closely at the snowman on the bottom-left. What is his nose made of?",
        x: 25,
        y: 72,
        radius: 8
      },
      {
        id: "winter-cabin-smoke",
        name: "Fire Cabin Smoke",
        hint: "Inspect the stone chimney of the log cabin. What shape are the cozy smoke puffs?",
        x: 68,
        y: 35,
        radius: 9
      },
      {
        id: "winter-tree-star",
        name: "Pine Tree Star",
        hint: "Look at the top of the tall snow-covered pine tree on the right side. Is there a star or a red bow?",
        x: 82,
        y: 32,
        radius: 8
      },
      {
        id: "winter-icicles",
        name: "Hanging Icicles",
        hint: "Check the roof edge of the wooden log cabin. Are there cold shiny icicles hanging down?",
        x: 55,
        y: 52,
        radius: 8
      },
      {
        id: "winter-sled-runner",
        name: "Sled's Red Runner",
        hint: "Look at the wooden sled resting in the foreground snow. Is the runner metal red or blue?",
        x: 48,
        y: 82,
        radius: 8
      }
    ]
  },
  {
    id: 13,
    title: "Breezy Balloon Sky",
    emoji: "🎈",
    theme: "sky",
    difficulty: "Hard",
    bgColor: "bg-cyan-900",
    accentColor: "text-cyan-300",
    gradientClass: "from-sky-900 via-cyan-950 to-teal-950",
    differences: [
      {
        id: "sky-balloon-stripes",
        name: "Hot Air Balloon Stripes",
        hint: "Look at the massive hot air balloon floating on the left. Are its stripes colorful rainbow or checkers?",
        x: 25,
        y: 30,
        radius: 10
      },
      {
        id: "sky-kite-tail",
        name: "Kite's Long Tail",
        hint: "Check the diamond-shaped kite flying in the wind on the right. Is its tail plain or filled with colorful bows?",
        x: 75,
        y: 42,
        radius: 9
      },
      {
        id: "sky-airplane-banner",
        name: "Airplane Banner",
        hint: "A red biplane is flying at the top! Look closely at the message trailing behind it!",
        x: 50,
        y: 18,
        radius: 10
      },
      {
        id: "sky-sun-glasses",
        name: "Sun's Sunglasses",
        hint: "Look at the bright glowing sun in the top-right corner. Is it wearing cool sunglasses or just winking?",
        x: 85,
        y: 15,
        radius: 9
      },
      {
        id: "sky-basket-cap",
        name: "Floating Basket Cap",
        hint: "Look at the boy riding in the hot air balloon basket on the left. What kind of hat is he wearing?",
        x: 25,
        y: 49,
        radius: 8
      }
    ]
  }
];
