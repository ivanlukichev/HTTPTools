const EMOJI_REFERENCE_DATA = [
  {
    id: "smileys-and-emotion",
    title: "Smileys & Emotion",
    source: `
😀|Grinning Face
😃|Smiling Face With Big Eyes
😄|Smiling Face With Smiling Eyes
😁|Beaming Face With Smiling Eyes
😆|Grinning Squinting Face
😅|Grinning Face With Sweat
😂|Face With Tears Of Joy
🤣|Rolling On The Floor Laughing
🙂|Slightly Smiling Face
🙃|Upside-Down Face
😉|Winking Face
😊|Smiling Face With Smiling Eyes
😇|Smiling Face With Halo
🥰|Smiling Face With Hearts
😍|Smiling Face With Heart-Eyes
🤩|Star-Struck
😘|Face Blowing A Kiss
😗|Kissing Face
☺|Smiling Face
😚|Kissing Face With Closed Eyes
😋|Face Savoring Food
😛|Face With Tongue
😜|Winking Face With Tongue
🤪|Zany Face
🤨|Face With Raised Eyebrow
🧐|Face With Monocle
🤓|Nerd Face
😎|Smiling Face With Sunglasses
🥳|Partying Face
😤|Face With Steam From Nose
😡|Pouting Face
😱|Face Screaming In Fear
😨|Fearful Face
😰|Anxious Face With Sweat
😢|Crying Face
😭|Loudly Crying Face
😴|Sleeping Face
🤗|Hugging Face
🤔|Thinking Face
🥺|Pleading Face
`.trim()
  },
  {
    id: "people-and-body",
    title: "People & Body",
    source: `
👋|Waving Hand
🤚|Raised Back Of Hand
🖐|Hand With Fingers Splayed
✋|Raised Hand
🖖|Vulcan Salute
👌|OK Hand
🤏|Pinching Hand
✌|Victory Hand
🤞|Crossed Fingers
🤟|Love-You Gesture
🤘|Sign Of The Horns
🤙|Call Me Hand
👈|Pointing Left
👉|Pointing Right
👆|Pointing Up
🖕|Middle Finger
👇|Pointing Down
☝|Index Pointing Up
👍|Thumbs Up
👎|Thumbs Down
✊|Raised Fist
👊|Oncoming Fist
🤛|Left-Facing Fist
🤜|Right-Facing Fist
👏|Clapping Hands
🙌|Raising Hands
👐|Open Hands
🤲|Palms Up Together
🙏|Folded Hands
💪|Flexed Biceps
🦵|Leg
🦶|Foot
👂|Ear
👃|Nose
🧠|Brain
👀|Eyes
👁|Eye
👅|Tongue
👄|Mouth
🦷|Tooth
`.trim()
  },
  {
    id: "animals-and-nature",
    title: "Animals & Nature",
    source: `
🐶|Dog Face
🐱|Cat Face
🐭|Mouse Face
🐹|Hamster Face
🐰|Rabbit Face
🦊|Fox Face
🐻|Bear Face
🐼|Panda Face
🐨|Koala
🐯|Tiger Face
🦁|Lion Face
🐮|Cow Face
🐷|Pig Face
🐸|Frog Face
🐵|Monkey Face
🙈|See-No-Evil Monkey
🙉|Hear-No-Evil Monkey
🙊|Speak-No-Evil Monkey
🐔|Chicken
🐧|Penguin
🐦|Bird
🐤|Baby Chick
🦆|Duck
🦅|Eagle
🦉|Owl
🦇|Bat
🐺|Wolf Face
🐗|Boar
🐴|Horse Face
🦄|Unicorn
🐝|Honeybee
🐛|Bug
🦋|Butterfly
🐌|Snail
🐞|Lady Beetle
🐢|Turtle
🐍|Snake
🦎|Lizard
🐙|Octopus
🐬|Dolphin
`.trim()
  },
  {
    id: "food-and-drink",
    title: "Food & Drink",
    source: `
🍎|Red Apple
🍐|Pear
🍊|Tangerine
🍋|Lemon
🍌|Banana
🍉|Watermelon
🍇|Grapes
🍈|Melon
🍓|Strawberry
🍒|Cherries
🍑|Peach
🥭|Mango
🍍|Pineapple
🥥|Coconut
🥝|Kiwi Fruit
🍅|Tomato
🥑|Avocado
🍆|Eggplant
🥔|Potato
🥕|Carrot
🌽|Ear Of Corn
🌶|Hot Pepper
🥒|Cucumber
🥬|Leafy Green
🥦|Broccoli
🍄|Mushroom
🥜|Peanuts
🌰|Chestnut
🍞|Bread
🥐|Croissant
🥖|Baguette Bread
🧀|Cheese Wedge
🍖|Meat On Bone
🍗|Poultry Leg
🥩|Cut Of Meat
🍔|Hamburger
🍕|Pizza
🌭|Hot Dog
🍟|French Fries
🌮|Taco
`.trim()
  },
  {
    id: "travel-and-places",
    title: "Travel & Places",
    source: `
🚗|Automobile
🚕|Taxi
🚙|Sport Utility Vehicle
🚌|Bus
🚎|Trolleybus
🏎|Racing Car
🚓|Police Car
🚑|Ambulance
🚒|Fire Engine
🚚|Delivery Truck
🚛|Articulated Lorry
🚜|Tractor
🏍|Motorcycle
🛵|Motor Scooter
🚲|Bicycle
🛴|Kick Scooter
🚂|Locomotive
🚆|Train
🚇|Metro
🚊|Tram
✈|Airplane
🛫|Airplane Departure
🛬|Airplane Arrival
🚀|Rocket
🛸|Flying Saucer
🚁|Helicopter
⛵|Sailboat
🚤|Speedboat
🛳|Passenger Ship
🚢|Ship
🏖|Beach With Umbrella
🏝|Desert Island
🏔|Snow-Capped Mountain
⛰|Mountain
🌋|Volcano
🏕|Camping
🏟|Stadium
🏛|Classical Building
🗽|Statue Of Liberty
🗼|Tokyo Tower
`.trim()
  },
  {
    id: "objects",
    title: "Objects",
    source: `
⌚|Watch
📱|Mobile Phone
💻|Laptop
⌨|Keyboard
🖥|Desktop Computer
🖨|Printer
🖱|Computer Mouse
💽|Computer Disk
💾|Floppy Disk
💿|Optical Disc
📷|Camera
📹|Video Camera
🎥|Movie Camera
📞|Telephone Receiver
☎|Telephone
📺|Television
📻|Radio
🎙|Studio Microphone
🎧|Headphones
🔋|Battery
🔌|Electric Plug
💡|Light Bulb
🔦|Flashlight
🕯|Candle
🧯|Fire Extinguisher
🧲|Magnet
🧰|Toolbox
🔧|Wrench
🔨|Hammer
⚙|Gear
🔩|Nut And Bolt
⛓|Chains
🧱|Brick
🔒|Locked
🔓|Unlocked
🔑|Key
🗝|Old Key
💰|Money Bag
📎|Paperclip
✂|Scissors
`.trim()
  },
  {
    id: "symbols",
    title: "Symbols",
    source: `
❤️|Red Heart
🧡|Orange Heart
💛|Yellow Heart
💚|Green Heart
💙|Blue Heart
💜|Purple Heart
🖤|Black Heart
🤍|White Heart
🤎|Brown Heart
💔|Broken Heart
❣|Heart Exclamation
💕|Two Hearts
💞|Revolving Hearts
💯|Hundred Points
✅|Check Mark Button
☑|Checkbox With Check
✔|Check Mark
❌|Cross Mark
❗|Exclamation Mark
❓|Question Mark
‼|Double Exclamation Mark
⁉|Exclamation Question Mark
⚠|Warning
🚫|Prohibited
⛔|No Entry
🔞|Adults Only
♻|Recycling Symbol
🔁|Repeat Button
🔂|Repeat Single Button
▶|Play Button
⏸|Pause Button
⏹|Stop Button
⏺|Record Button
🔔|Bell
🔕|Bell With Slash
📢|Loudspeaker
🔍|Magnifying Glass Left
🔎|Magnifying Glass Right
➕|Plus Sign
➖|Minus Sign
`.trim()
  },
  {
    id: "flags",
    title: "Flags",
    source: `
🏁|Chequered Flag
🚩|Triangular Flag
🎌|Crossed Flags
🏳|White Flag
🏴|Black Flag
🇺🇸|Flag: United States
🇬🇧|Flag: United Kingdom
🇨🇦|Flag: Canada
🇦🇺|Flag: Australia
🇩🇪|Flag: Germany
🇫🇷|Flag: France
🇪🇸|Flag: Spain
🇮🇹|Flag: Italy
🇧🇷|Flag: Brazil
🇲🇽|Flag: Mexico
🇯🇵|Flag: Japan
🇰🇷|Flag: South Korea
🇨🇳|Flag: China
🇮🇳|Flag: India
🇺🇦|Flag: Ukraine
🇵🇱|Flag: Poland
🇸🇪|Flag: Sweden
🇳🇱|Flag: Netherlands
🇹🇷|Flag: Turkey
`.trim()
  }
];

function parseEmojiCategory(category) {
  return {
    ...category,
    items: category.source.split("\n").map((line) => {
      const [emoji, name] = line.split("|");
      return { emoji, name };
    })
  };
}

function getEmojiCodePoints(emoji) {
  return Array.from(emoji)
    .map((character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");
}

async function copyEmojiValue(value, trigger) {
  if (typeof copyText === "function") {
    return copyText(value, trigger, "Copied ✓", 1800);
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (error) {
    return false;
  }
}

function updateEmojiStatus(element, text, type = "") {
  if (typeof setStatus === "function") {
    setStatus(element, text, type);
    return;
  }

  if (!element) {
    return;
  }

  element.textContent = text;
}

function initEmojiPage() {
  const root = document.querySelector("[data-emoji-page]");
  if (!root) {
    return;
  }

  const jumpLinks = document.querySelector("[data-emoji-jumps]");
  const sectionsRoot = root.querySelector("[data-emoji-sections]");
  const status = root.querySelector("#emoji-status");
  const categories = EMOJI_REFERENCE_DATA.map(parseEmojiCategory);

  categories.forEach((category) => {
    const jumpLink = document.createElement("a");
    jumpLink.href = `#${category.id}`;
    jumpLink.textContent = category.title;
    jumpLinks?.appendChild(jumpLink);

    const section = document.createElement("section");
    section.className = "content-card";
    section.id = category.id;

    const heading = document.createElement("h2");
    heading.textContent = category.title;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "emoji-grid";

    category.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "emoji-card";

      const symbolButton = document.createElement("button");
      symbolButton.type = "button";
      symbolButton.className = "emoji-card__symbol";
      symbolButton.textContent = item.emoji;
      symbolButton.setAttribute("aria-label", `Copy ${item.name}`);

      const meta = document.createElement("div");
      meta.className = "emoji-card__meta";

      const name = document.createElement("h3");
      name.className = "emoji-card__name";
      name.textContent = item.name;

      const code = document.createElement("p");
      code.className = "emoji-card__code";
      code.textContent = getEmojiCodePoints(item.emoji);

      meta.append(name, code);

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "button-secondary button-small emoji-card__copy";
      copyButton.textContent = "Copy";

      const handleCopy = async (buttonToAnimate = null) => {
        const copied = await copyEmojiValue(item.emoji, buttonToAnimate);
        if (copied) {
          updateEmojiStatus(status, `Copied ${item.emoji} ${item.name}.`, "success");
        } else {
          updateEmojiStatus(status, "Copy failed. Your browser may block clipboard access.", "error");
        }
      };

      symbolButton.addEventListener("click", () => {
        handleCopy();
      });

      copyButton.addEventListener("click", () => {
        handleCopy(copyButton);
      });

      card.append(symbolButton, meta, copyButton);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    sectionsRoot?.appendChild(section);
  });
}

document.addEventListener("DOMContentLoaded", initEmojiPage);
