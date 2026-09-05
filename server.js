const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let players = [];
let tournamentStarted = false;

const heroes = [
    {
        name: "Anti-Mage",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png",
        skill: "Mana Break",
        ultimate: "Mana Void"
    },
    {
        name: "Axe",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png",
        skill: "Berserker's Call",
        ultimate: "Culling Blade"
    },
    {
        name: "Pudge",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png",
        skill: "Meat Hook",
        ultimate: "Dismember"
    },
    {
        name: "Drow Ranger",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/drowranger.png",
        skill: "Frost Arrows",
        ultimate: "Marksmanship"
    },
    {
        name: "Sniper",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/sniper.png",
        skill: "Shrapnel",
        ultimate: "Assassinate"
    },
    {
        name: "Lina",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lina.png",
        skill: "Dragon Slave",
        ultimate: "Laguna Blade"
    },
    {
        name: "Viper",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/viper.png",
        skill: "Poison Attack",
        ultimate: "Viper Strike"
    },
    {
        name: "Slark",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/slark.png",
        skill: "Dark Pact",
        ultimate: "Shadow Dance"
    },
    {
        name: "Tinker",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/tinker.png",
        skill: "Laser",
        ultimate: "Rearm"
    },
    {
        name: "Storm Spirit",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/storm_spirit.png",
        skill: "Static Remnant",
        ultimate: "Ball Lightning"
    },
    {
        name: "Huskar",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/huskar.png",
        skill: "Burning Spear",
        ultimate: "Life Break"
    },
    {
        name: "Clinkz",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/clinkz.png",
        skill: "Burning Barrage",
        ultimate: "Death Pact"
    },
    {
        name: "Weaver",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/weaver.png",
        skill: "Shukuchi",
        ultimate: "Time Lapse"
    },
    {
        name: "Phantom Assassin",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png",
        skill: "Phantom Strike",
        ultimate: "Coup de Grace"
    },
    {
        name: "Shadow Fiend",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/shadow_fiend.png",
        skill: "Shadowraze",
        ultimate: "Requiem of Souls"
    },
    {
        name: "Legion Commander",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/legion_commander.png",
        skill: "Press The Attack",
        ultimate: "Duel"
    },
    {
        name: "Bristleback",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bristleback.png",
        skill: "Quill Spray",
        ultimate: "Warpath"
    },
    {
        name: "Phantom Lancer",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_lancer.png",
        skill: "Spirit Lance",
        ultimate: "Juxtapose"
    },
    {
        name: "Broodmother",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/broodmother.png",
        skill: "Insatiable Hunger",
        ultimate: "Spin Web"
    },
    {
        name: "Nature's Prophet",
        icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/furion.png",
        skill: "Sprout",
        ultimate: "Wrath of Nature"
    }
];

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

app.get("/api/state", (req, res) => {
    res.json({
        players,
        tournamentStarted,
        heroes
    });
});

app.post("/api/register", (req, res) => {
    const username = String(req.body.username || "").trim();

    if (!username) {
        return res.status(400).json({
            error: "Введите имя"
        });
    }

    if (tournamentStarted) {
        return res.status(400).json({
            error: "Турнир уже начался"
        });
    }

    if (players.some(p => p.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({
            error: "Этот игрок уже зарегистрирован"
        });
    }

    if (players.length >= 20) {
        return res.status(400).json({
            error: "Достигнут лимит 20 игроков"
        });
    }

    players.push({
        id: Date.now() + Math.random(),
        username,
        hero: null,
        alive: true
    });

    res.json({
        success: true,
        players
    });
});

app.post("/api/start", (req, res) => {
    if (players.length < 2) {
        return res.status(400).json({
            error: "Нужно минимум 2 игрока"
        });
    }

    const shuffledHeroes = shuffle(heroes);

    players = players.map((player, index) => ({
        ...player,
        hero: shuffledHeroes[index],
        alive: true
    }));

    tournamentStarted = true;

    res.json({
        success: true,
        players
    });
});

app.post("/api/reset", (req, res) => {
    players = [];
    tournamentStarted = false;

    res.json({
        success: true
    });
});

app.listen(PORT, () => {
    console.log(`Dota tournament запущен: http://localhost:${PORT}`);
});