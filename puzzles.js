const puzzles = [
    // not using json for reasons unknown to mankind
    {
        name: 'Grid of Numbers',
        levels: [
            {
                name: 'A Grid of Numbers',
                description: `Welcome to <h style="color: red;">Red Pixel Simulator</h>!<br>&emsp;<h style="color: red;">Red Pixel Simulator</h> is a sandbox-puzzle game based solely on interactions between some numbers in a grid. (Almost) everything is completely deterministic based on simple interactions between pixels. For the purposes of the puzzles, your goal is to <h>defeat all the monsters</h> (the red things with faces) by destroying them using other pixels and to <h>move the goal pixels</h> <h>to the targets</h>. For now, we will stick with just monsters.<br><br>&emsp;On the <h>left of your screen is the grid</h>. <h>On the right is the sidebar</h>, which contains all of the game controls. At the top, there is the <h>Pixel Picker</h>. Here you can see what and how many pixels you can place; you can <h>select them by clicking on them</h>. Below that, there are controls for your <h>brush size (up and down arrows)</h> and <h>simulation control</h>: You can <h>pause</h>, <h>warp</h>, and <h>step</h> the simulation. You can also turn on <h>slowmode</h>, which is useful in puzzles where things move so fast you can't see them.<br><br>&emsp;At the bottom of the sidebar (scroll ALL THE WAY DOWN) you can find all the controls available.</h><br><br>&emsp;The levels after the following tutorial levels were <h>designed to be challenging</h>. They take the taught mechanics of the simulation and stretch them to their limits. <h>If you ever get stuck, don't worry. Just try a different level or section</h>, as there's no set difficulty progression.<br><br><h>Let's get started! Go down and press the <b>run</b> button (it looks like a play button) to begin.</h>`,
                saveCode: '20;0000;air-259:sand:air-19:grass:air-19:grass:water-12:mud:grass-6:dirt:water-8:mud-4:dirt-8:mud-2:water-3:mud-3:dirt-14:mud-3:dirt-35:;190:;190:;12a:1:65:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    air: 0
                },
                difficulty: 'Tutorial',
                id: '212c7cd9-1ea3-4d1e-a2a8-6a287b06b1a5'
            },
            {
                name: 'Gravity',
                description: `&emsp;Although everything is, at its core, a grid of numbers, gravity still applies. Pixels like <h>dirt</h>, <h>sand</h>, <h>water</h>, and many more will <h>fall downwards</h> when given the chance to. Some are more flowy than others. <h>Water is... watery</h>, and flows until it can't find a lower spot. <h>Pixels like dirt and sand will form hills</h> of different slopes, depending on the pixel.<br>&emsp;When a pixel destroys a monster, <h>it also gets destroyed</h>. Keep that in mind in later puzzles.<br><br><h>Place sand, dirt, and water in the non-shaded area to destroy the monsters!</h><br><i><h>You cannot place pixels in the shaded areas.</h></i><br><h>You have one of each pixel</h>, and <h>you cannot edit after starting the simulation</h>.<br>Use the <b>reset</b> button to revert to before the simulation began.`,
                saveCode: '20;0000;air-160:leaves-3:air-17:leaves-4:air-16:leaves:wood:leaves-2:air-8:leaves-3:air-5:wood:leaves-3:air-7:leaves-5:air-4:wood:air-10:leaves-2:wood:leaves-2:air-4:wood:air-12:wood:air-6:wood:air-12:wood:air-6:wood:air-2:grass-5:air-5:wood:air-2:grass-4:dirt:grass-2:dirt-5:grass-3:air-2:wood:air:grass:dirt-15:grass-2:dirt:grass:dirt-45:;190:;0:78:118:;11f:1:e:1:1f:1:41:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    dirt: 1,
                    sand: 1,
                    water: 1
                },
                difficulty: 'Tutorial',
                id: 'aa79ddcd-da13-4459-8a23-02050d22e2cf'
            },
            {
                name: 'Mudslide',
                description: `Oh no! Your only pixels are <h>wood</h>, which doesn't fall. Don't worry, though, because you can use that wood to <h>redirect the water</h>. It may seem like this challenge is impossible, but there is another way.<br><br><h>Water turns dirt into mud when it touches it</h> - you can use this to your advantage by <h>creating a mudslide</h>.`,
                saveCode: '25;0000;air-128:water:air-154:dirt:air-23:dirt-3:air-21:dirt-4:air-21:dirt-5:air-10:leaves-3:air-6:dirt-7:air-8:leaves-5:air-5:dirt-7:concrete:air-7:leaves-2:wood:leaves-2:air-4:dirt-8:concrete:air-9:wood:air-2:water-4:dirt-8:concrete:air-9:wood:air-2:mud-4:dirt-8:concrete:air-2:grass-2:air-3:grass-2:dirt:grass-2:dirt-12:concrete-5:grass:air:grass:dirt-22:grass:air:grass:dirt-23:grass:dirt-56:;271:;7:8:11:8:11:8:11:8:11:8:11:8:a:f:a:f:a:f:a:f:a:f:168:;21f:1:51:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    wood: 8
                },
                difficulty: 'Easy',
                id: '90bbdef9-1f44-4d9b-a085-082189b71dfe'
            },
            {
                name: 'Lava',
                description: `It appears that the monsters are learning. They've built a barrier of wood to protect themselves from falling pixels. However, they failed to neglect the fact that you have rather conveniently been given lava for this puzzle.<br><br><h>Lava can set stuff on fire, use it to burn through their barriers.</h>`,
                saveCode: '25;0000;air-367:wood-8:air-17:wood:air-6:wood:air-17:wood:air-6:wood:air-17:wood:air-6:wood:grass-15:air-2:wood:air-6:wood:dirt-15:grass-2:dirt:grass-6:dirt-126:;271:;0:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:18:1:9f:;1d5:1:2:2:97:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    lava: 1
                },
                difficulty: 'Tutorial',
                id: '3bf72052-af2f-4e43-ab64-bff7008be1bc'
            },
            {
                name: 'Breaking Game',
                description: `There's plenty of lava to destroy the monsters, but they've built a water trough to stop the lava and you only have some <h>kitchen sponges and that weird plant you found growing on your basement floor</h>. Wait, is that a <i>vault</i> that that monster's sealed itself in? You should be able to do this, though, you'll find a way.`,
                saveCode: '25;0000;air-310:water-4:concrete:air-17:concrete-8:air-21:concrete:air-24:concrete:air-24:concrete:air-24:concrete:air-13:lava-6:air-5:concrete:air-6:concrete-13:air:concrete:air-3:concrete:grass-6:concrete-7:dirt-5:concrete:air:concrete:grass-3:concrete:dirt-6:concrete-7:dirt-5:concrete:air:concrete:dirt-10:concrete-3:air:concrete-3:dirt-5:concrete:air:concrete:dirt-10:concrete-7:dirt-5:concrete:air:concrete:dirt-10:concrete-7:dirt-5:concrete-3:dirt-10:concrete-7:;271:;32:f:a:f:a:f:a:f:a:f:a:f:a:f:a:f:35:7:12:7:12:7:12:7:12:7:12:7:12:7:af:;1e4:2:3c:1:4e:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    plant: 1,
                    sponge: 3
                },
                difficulty: 'Easy',
                id: '470e4351-390f-4767-a415-006e8e7daf13'
            },
            {
                name: 'Floating Islands',
                description: `How strange, the Aether is real! Anyways, you only have a few pixels to use. <h>Choose wisely!</h>`,
                saveCode: '40;0000;air-61:leaves:air-38:leaves:wood:leaves:air-38:wood:air-35:grass-4:dirt:grass-2:air-33:stone-7:air-33:stone-6:air-35:stone-4:air-37:stone-3:air-19:grass-6:air-12:stone-2:air-20:stone-6:air-13:stone:air-21:stone-5:air-30:leaves-3:air-3:stone-3:air-31:leaves-3:air-4:stone-2:air-30:leaves-4:air-4:stone:air-31:leaves:wood:leaves:wood:air-37:leaves:wood-2:air-32:leaves-3:air-4:wood:air-3:leaves-3:air-26:leaves-3:air-4:wood:air-2:leaves-5:air-17:leaves-3:air-4:leaves-5:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-5:air-3:leaves-2:wood:leaves-2:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-2:wood:leaves-2:air-3:leaves-2:wood:leaves-2:air-3:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:grass:air-2:grass:dirt:grass-5:water-2:air-13:wood:air-7:wood:air-2:grass-3:dirt-2:grass-2:dirt-7:cloner_up:stone:water:air-11:grass:dirt:grass-7:dirt:grass-2:dirt-4:stone-2:dirt-6:stone-2:water:stone:air-12:stone-2:dirt-12:stone-13:air-14:stone-4:dirt-8:stone-2:air:stone-8:air-17:stone-13:air-2:stone-7:air-19:stone-11:air-3:stone-6:air-21:stone-10:air-3:stone-5:air-15:grass-4:air-4:stone-8:air-4:stone-5:air-15:stone-4:grass-2:air-2:stone-8:air-4:stone-4:air-17:stone-5:air-3:stone-6:air-5:stone-3:air-19:stone-3:air-5:stone-4:air-6:stone-3:air-19:stone:air-7:stone-3:air-7:stone-3:air-37:stone-2:air-38:stone:air-79:deleter-40:;640:;0:3d:1:26:3:25:3:22:7:21:7:21:7:21:7:21:7:11:6:a:7:11:6:a:7:11:6:a:7:d:463:;2c0:1:26:1:88:1:28:1:21:1:10d:1:176:',
                backgroundColor: '#cceeff',
                inventory: {
                    dirt: 3,
                    sand: 2,
                    wood: 10,
                    water: 1
                },
                difficulty: 'Easy',
                id: '36855769-ee54-47f6-9ad2-874bdec25a6f'
            },
            {
                name: 'Platformer',
                description: `Well, the monsters have built themselves a platform up to an unplaceable area. Unfortunately for them, they've <h>made it out of wood</h>. Find a way to get them down!`,
                saveCode: '40;0000;air-605:wood-7:air-36:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-21:leaves-5:air-13:wood:air-21:leaves-6:air-2:leaves-2:air-8:wood:air-20:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-8:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-9:leaves-2:wood:leaves-2:air-2:leaves-2:wood:air-8:wood:air-9:wood-3:wall:lava:wall:air-8:wood:air-6:wood:water-8:wood:water-8:grass:concrete-3:wall:lava_generator:wall:grass:air-7:wood:air-6:wood:water-8:wood:water-5:mud-3:dirt-4:wall-3:dirt:grass:water-4:grass-2:dirt:grass:air:grass:air:grass-2:dirt:mud-4:water-4:wood:water-2:mud-5:dirt-10:mud-4:dirt-4:grass:dirt:grass:dirt-6:mud-5:wood:mud-2:dirt-34:concrete-7:dirt-33:concrete-7:dirt-228:;640:;2a8:8:1:27:1:27:1:27:1:27:1:1f:2d0:;1e9:1:26:2:23:2:1:3:1a2:1:f4:1:1:1:16b:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    sand: 5,
                    wood: 3,
                    leaves: 8,
                    moss: 1,
                    water: 1
                },
                difficulty: 'Easy',
                id: 'b6e8d92d-5d93-44cd-9b59-9d302a1ec5f3'
            },
            {
                name: 'Rafting',
                description: `Quick, they're approaching by sea! Try and find a way to get them while they're still on the raft!`,
                saveCode: '40;0000;air-1243:wood-12:air-25:water-3:wood-12:water-305:;640:;13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:230:;4b6:1:3:1:1:1:183:',
                backgroundColor: '#cceeff',
                inventory: {
                    sand: 5,
                    wood: 5,
                    water: 8,
                    concrete_powder: 9
                },
                difficulty: '🙂',
                id: 'f6dd5428-9db5-4e69-8ffb-148d3733a88d'
            },
            {
                name: 'Oh Well',
                description: `Well, well, well... Look where global warming got us. One moment we're in the ocean, the next moment we're in a desert, with nothing except some leaves, which are pretty useless. Wait, did I say "<i>we</i>"? Sorry, I meant "<i>you</i>". Just ignore the sand on the well, that's there for legal reasons.`,
                saveCode: '50;0000;air-341:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood-5:air-96:wood:air:wood:air-5:sand-10:air-32:wood:air:wood:sand-18:air-5:sand-10:lava-7:sand-7:concrete:water:concrete:sand-34:lava-5:sand-8:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-5:stone-11:sand-7:stone-5:sand-19:concrete:water:concrete:sand-5:stone-29:sand-3:stone-7:sand-3:concrete:water:concrete:sand:stone-46:concrete:water:concrete:stone-45:water-6:stone-44:water-7:stone-40:water-13:stone-34:water-16:;9c4:;16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:1c:16:14:1:1:1:5:16:14:1:1:57e:;459:1:56a:;9c4:',
                backgroundColor: '#eefeff',
                inventory: {
                    leaves: 20
                },
                difficulty: 'Easy',
                id: '6cce9076-6c41-4b5b-926b-69044c4f1696'
            },
            {
                name: 'Resupply Needed',
                description: `You actually have nothing this time! Well, good luck!<br><i>Hint: The butterfly effect still exists.</i>`,
                saveCode: '50;0000;air-373:wall:lava-3:wall:air-43:sand-2:wall:lava-3:wall:air-42:sand-3:wall:lava-3:wall:air-16:wood-3:air-22:stone-4:wall-5:stone:air-14:wood-4:air-23:stone-8:air-15:dirt-4:grass:air-23:stone-7:air-15:stone-5:air-23:stone-7:air-8:stone:air-3:stone:air-3:stone-4:air-24:stone-5:air-9:stone:water-3:stone:air-4:stone:air-27:stone-4:air-10:stone-4:air-4:stone:air-12:grass-5:air-10:stone-3:air-11:stone-3:air-18:stone-5:air-10:stone-2:air-12:stone-2:air-20:stone-3:air-12:stone:air-34:stone-3:air-48:stone-2:air-276:leaves-5:air-7:dirt-2:air-35:leaves-7:air-6:dirt-3:air-13:sand-3:air-17:leaves-4:wood:leaves:wood:leaves:air-6:dirt-4:air-10:wood:sand-5:wood:air-15:leaves-4:wood-2:leaves-2:air-6:dirt-4:air-10:wood:sand-5:wood:air-16:leaves:wood:leaves:wood:leaves-2:air-3:leaves-3:air:dirt-5:air-9:wood:sand-5:wood:air-18:wood-2:air-4:leaves-5:dirt-5:air-9:wood:sand-5:wood:air-19:wood:air-4:leaves-5:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-4:leaves-2:wood:leaves-2:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:air-7:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:concrete-14:grass:water-2:wood-5:water-9:grass:air:dirt:grass-2:air-2:grass-2:dirt:grass-2:dirt-22:mud:water-13:mud-2:dirt-5:grass-2:dirt-28:mud-4:water-6:mud-3:dirt-41:mud-6:dirt-269:stone-16:dirt-32:stone-32:dirt-18:stone-200:;9c4:;0:175:5:2d:5:2d:5:29:a:29:8:f:5:17:7:f:5:17:7:8:1:3:1:3:4:18:5:9:1:3:1:4:1:1b:4:a:4:4:1:4:6a4:;538:1:16a:1:9:1:1:1:d:1:16:2:27:1:3:1:2c2:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    air: 0
                },
                difficulty: 'Medium',
                id: 'a2007b54-3709-4b64-a254-0f8b617ffc55'
            }
        ]
    },
    {
        name: 'Square Caves',
        levels: [
            {
                name: 'Down in the Mines',
                description: `<i>[music]</i> Oh wait, we're lost. Oh wow, these red things are everywhere. Better get rid of those before they destroy this place, too. That suspiciously conveniently C-4 and gunpowder will probably help.`,
                saveCode: '50-50;0000;stone-9:air-5:stone-6:dirt-30:stone-9:air-5:stone-16:dirt-11:stone-3:dirt-6:stone-9:air-5:stone-32:dirt-4:stone-9:air-5:stone-45:air-5:stone-4:air-22:stone-19:air-5:stone-4:air:gunpowder-4:air-17:stone-19:air-5:stone-4:gunpowder-5:air-17:stone-19:air-5:stone-9:air-2:wood:dirt-5:wood:air-2:wood-2:stone-7:water-3:stone-13:air-5:stone-9:air-2:wood:dirt-5:wood:air-3:stone-6:water-7:stone-11:air-5:stone-9:air-2:wood:dirt-5:wood:air-3:stone-5:sand:water-2:sand-5:stone-11:air-5:stone-9:air-2:stone-7:air-3:stone-6:sand-3:stone-15:air-5:stone-9:air-2:stone-7:air-3:stone-5:wood-4:stone-15:air-5:stone-6:air-30:stone-9:air-5:stone-6:air-18:crate:air-11:stone-9:air-5:stone-6:air-18:crate-2:air-10:stone-9:air-5:stone-6:air-18:crate-2:air-10:stone-9:air-5:stone-6:air-13:crate-2:air-2:crate-3:air-9:crate:stone-9:air-5:stone-26:air-4:stone-15:air-5:stone-26:air-4:stone-15:air-5:stone-26:air-4:stone-15:air-5:stone-26:air-4:stone-15:air-5:stone-26:air-4:stone-15:air-5:stone-26:air-4:stone-3:air-2:stone-10:air-5:stone-26:air-4:stone:air-4:stone-6:air-45:stone-5:air-14:dirt-2:air-29:stone-5:air-12:dirt-5:air-28:stone-5:air-11:dirt-7:air-27:stone-5:air-11:wood-7:air-27:stone-8:wood-2:air-4:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-5:stone-18:air-2:stone-25:air-20:wood:air-5:stone-24:air-16:wood:gunpowder-3:wood:air-3:wood:air-8:c4-3:concrete:air-3:stone-10:air-14:wood:air:wood:gunpowder-3:wood:gunpowder-3:wood:air-8:c4-3:concrete:stone:air-2:stone-10:air-3:wood-3:stone-19:air-2:stone-23:air-5:stone-21:air:stone-23:air-5:stone-21:air:stone-23:air-5:stone-21:air:stone-23:air-5:stone-21:air:stone-23:air-5:stone-21:air:stone-15:basalt:stone-7:air-5:stone-3:basalt:stone-7:basalt:stone-9:air:stone-13:basalt:stone-2:basalt-2:stone-3:basalt:stone:air-5:stone:basalt:stone-2:basalt:stone-4:basalt-2:stone-2:basalt:stone-2:basalt:stone:air-10:stone-2:basalt-2:stone:basalt:stone-3:basalt:stone:basalt-2:stone:basalt-3:air-5:stone-2:basalt-2:stone-3:basalt:stone:basalt:stone:basalt:stone:basalt-3:stone-2:air-9:basalt:stone:basalt-3:stone-2:basalt-10:stone:air-5:basalt-19:lava-7:basalt-10:;9c4:;8:1:4ba:2:d:6:2c:6:2c:6:2c:6:2c:6:1f0:6:2c:6:1fc:;338:1:248:1:21:1:2:1:1:1:1ab:1:24:1:31:1:a:1:15:1:1f7:;9c4:',
                backgroundColor: '#adadad',
                inventory: {
                    sand: 1,
                    wood: 5,
                    water: 3,
                    gunpowder: 5
                },
                difficulty: 'Medium',
                id: '7f2a3ce0-3227-48cd-9d83-ed2e741cc4f4'
            },
            {
                name: 'Maitian, is the Moon Big?',
                description: `Well, we'll never know down here. It's not like <span style="color: red;">Red Pixel Simulator</span> has a moon anyways...<br><br>What we do know is that this cave is big, and there's definitely more monsters down here. Try not to die! Toodledoo... or... something.`,
                saveCode: '50-50;0000;basalt-11:wood:air:wood:stone:basalt-10:stone-11:gravel-6:stone-8:basalt-11:wood:air:wood:basalt-15:stone-7:gravel-6:stone-12:basalt-7:wood:air:wood:basalt-20:stone-2:gravel-5:stone:basalt-7:stone-8:basalt-4:wood:air:wood:basalt-2:stone-6:basalt-28:stone-11:wood:air:wood:stone-12:basalt-24:air-4:stone-7:wood:air:wood:stone-13:basalt-23:air-6:stone-5:wood:air:wood:stone-3:wood:air-6:stone-6:basalt-12:stone-3:basalt-5:gravel-3:wood:air-7:wood:air:wood:air-3:wood:air-6:wood:stone-25:gravel-3:wood:air-13:wood:air-6:wood:air-2:stone-18:air-2:stone-3:gravel-3:wood:air-13:wood:air-6:wood:air-2:stone-18:air-2:stone-3:gravel-3:wood:air-20:wood:air-3:stone-17:air-2:stone-3:gravel-3:wood-2:air-19:wood:air-6:stone-14:air-2:stone-3:gravel-3:wood:air:wood:air-26:stone-13:air-2:stone-3:gravel-2:stone-5:air-26:wood:air-16:stone-9:air-24:wood:air-10:gunpowder-4:air-2:stone-11:wood-4:air-15:wood-6:stone-25:air-4:wood:air-21:stone-24:air-4:wood:air-23:stone-22:air-29:stone-21:air-29:stone-15:air-35:stone-12:air-40:stone-9:air-42:stone-7:air-46:stone-4:air-46:stone-4:air-46:wood:stone-3:air-46:wood:stone-3:air-46:wood:stone-3:air-46:wood:air:stone-2:air-46:wood:air-49:wood:air-4:gunpowder:air-42:wood-6:gunpowder-3:air-43:wood:air-3:stone-3:gunpowder:air-2:gunpowder:air-39:wood:air-3:stone-8:air-38:wood:air-3:stone-7:air-39:wood:air-3:stone-6:air-23:stone:air-16:wood:air-3:stone-6:air-22:wood:stone-2:air-15:wood:air-3:stone-6:air-19:wood:air:wood:stone-4:air-14:wood:air-3:stone-6:air-13:wood:air-2:wood-5:stone-6:air-13:wood:air-3:stone-6:air-11:wood-6:stone-6:basalt-4:air-10:stone-13:air-7:wood:air:wood-2:air:stone-10:basalt-5:lava-7:basalt-8:stone-2:air-11:wood-5:stone-10:basalt-24:air-7:stone-12:basalt-31:air-7:stone-12:basalt-31:stone-13:gravel-5:stone:basalt-31:stone-13:gravel-7:basalt-2:gravel-7:basalt-21:stone-11:gravel-19:basalt-20:stone-9:gravel-22:basalt-19:stone-9:gravel-22:basalt-19:;9c4:;c:1:31:1:31:1:89:3:2f:3:7a:2:12:2:1c:2:12:2:1c:2:12:2:1c:2:12:2:1c:2:12:2:3a0:6:2c:6:2c:6:2c:6:2c:6:64:f:24:e:25:d:25:a:39:7:2b:7:2b:7:125:;25f:1:31:1:37:1:12:1:1:1:329:1:6e:1:34c:;9c4:',
                backgroundColor: '#adadad',
                inventory: {
                    sand: 3,
                    wood: 7,
                    leaves: 7,
                    moss: 1,
                    water: 2,
                    lava: 1
                },
                difficulty: 'Medium',
                id: 'b4a9c1d2-9e7e-4294-a58e-d9a874f1195d'
            },
            {
                name: 'Lake Cavein??',
                description: `Whatever floats your fboat! 0.1 + 0.2 = 0.30000000000000004<br><br>Anyways, you better watch out for caveins, there's a lot of gravel and loose stones around here.`,
                saveCode: '100-100;0000;stone-596:air-4:stone-43:air-24:stone-23:air-10:stone-37:air-36:stone-13:air-14:stone-29:air-71:stone-29:air-68:stone-32:air-59:stone-41:air-58:stone-42:air-57:stone-43:air-60:stone-11:air-9:stone-20:air-60:stone-11:air-14:stone-6:air-69:stone-11:air-89:stone-11:air-89:stone-11:air-91:stone-9:air-3:stone-2:air-87:stone-18:air-14:stone-5:air-63:stone-37:air-64:stone-36:air-71:stone-29:air-71:stone-29:air-71:stone-29:gravel:air-70:stone-2:air-4:stone-23:gravel-4:air-73:stone-23:gravel-5:air-63:stone-3:air-6:stone-23:gravel-7:air-53:stone-11:air-7:stone-3:gravel-5:stone-16:gravel-6:air-52:stone-11:gravel-4:air-4:gravel-9:stone-18:gravel-3:air-50:stone-12:gravel-24:stone-13:gravel-3:air-26:crate-5:air-17:stone-12:gravel-25:stone-13:gravel-2:stone:water-40:gravel:stone-18:gravel-25:stone-16:water-39:stone-9:gravel-5:stone-6:gravel-25:stone-17:water-38:stone-8:gravel-12:stone:gravel-24:stone-17:water-37:gravel:stone-4:gravel-16:stone-3:gravel-22:stone-16:gravel:water-36:gravel-2:stone-4:gravel-16:stone-7:gravel-18:stone-17:gravel-2:water-31:gravel-4:stone-5:gravel-16:stone-9:gravel-15:stone-20:gravel-29:stone:gravel:stone-9:gravel-16:stone-8:gravel-14:stone-27:gravel-4:stone-4:gravel-12:stone-15:gravel-15:stone-9:gravel-14:stone-62:gravel-15:stone-5:gravel-17:stone-63:gravel-15:stone-4:gravel-15:stone-34:air-6:stone-29:gravel-12:stone-4:gravel-15:stone-34:air-6:stone-29:gravel-7:stone-9:wood-15:stone-34:air-6:stone-42:air-400:gravel-4:air-87:gravel:air-8:gravel-5:air-85:gravel-3:air-7:gravel-8:air-81:gravel-5:air-6:stone:gravel-8:stone-12:air-5:stone:gravel-5:stone-44:air-8:stone-16:gravel-9:stone-12:air-5:stone-50:air-8:stone-16:gravel-9:stone-12:air-5:stone-50:air-8:stone-16:gravel-11:stone-10:air-5:stone-50:air-8:stone-16:gravel-11:stone-10:air-5:stone-50:air-8:stone-16:gravel-5:stone-16:air-5:stone-50:air-8:stone-16:gravel-3:stone-18:air-5:stone-50:air-8:stone-37:air-5:stone-50:air-8:stone-37:air-5:stone-36:air-38:stone-21:air-6:stone-35:air-38:stone-21:air-6:stone-35:air-38:stone-21:air-6:stone-35:air-38:stone-9:air-21:stone-32:air-38:stone-9:air-21:stone-32:air-38:stone-9:air-21:stone-32:air-38:stone-9:air-21:stone-3:gravel-5:stone-24:air-5:gravel-2:stone-4:air-3:stone-20:air-4:stone-9:air-21:gravel-9:stone-22:gravel:air-3:gravel-2:stone-6:air-3:stone-20:air-4:stone-9:air-20:gravel-10:stone-23:gravel-4:stone-7:air-3:stone-20:air-4:stone-9:air-19:gravel-11:stone-34:air-3:stone-45:gravel-19:stone-33:air-3:stone-44:gravel-20:stone-33:air-3:stone-42:gravel-26:stone-29:air-3:stone-42:gravel-29:stone-26:air-3:stone-42:gravel-29:stone-26:air-3:stone-43:gravel-28:stone-26:air-3:stone-44:gravel-27:stone-26:air-3:stone-49:gravel-11:stone-3:gravel-8:stone-26:air-3:stone-63:gravel-5:stone-29:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-73:gravel-7:stone-2:gravel-4:stone-11:air-3:stone-72:gravel-14:stone-11:air-3:stone-71:gravel-15:stone-11:air-3:stone-68:gravel-16:stone-13:air-3:stone-67:gravel-15:stone-15:air-3:stone-67:gravel-12:stone-18:air-3:stone-68:gravel-7:stone-22:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-97:air-3:stone-94:air-12:stone-88:air-12:stone-88:air-12:stone-18:;2710:;254:4:5a:a:59:b:59:b:59:8:20f:5:5f:5:5f:5:5f:5:5f:2:1:2:329:33:31:33:31:1e:1:14:31:1e:2:12:34:1a:5:11:428:6:5e:6:5e:6:2a:15:1f:6:1a:25:1f:6:1a:25:1f:6:1a:25:1f:6:1a:10:4:11:1f:6:1a:7:1:8:5:10:1f:6:1a:6:3:7:8:d:1f:6:1a:5:5:6:4c:8:5c:8:5c:8:5c:8:5c:8:10dc:;786:1:411:1:63:2:e6f:1:83:1:12:1:6:1:49:1:1:1:10:1:1:1:1:1:2:2:b9f:;2710:',
                backgroundColor: '#adadad',
                inventory: {
                    wood: 8,
                    concrete: 8,
                    fire: 4,
                    detonator: 1,
                    gunpowder: 4,
                    c4: 4,
                },
                difficulty: 'Easy',
                id: '902b5892-ed7d-489b-a04a-70dbc6ab27c7'
            },
            {
                name: 'Hidden Diamonds?',
                description: `I've been foolin' you the whole time, because... I've been hiding my diamonds... OVER... HERE!!! Wait, there are no diamonds in this game.<br><br>Though, those monsters seem to be hidden pretty well. Where are they? Hold up, you can see everything here anyways. What?`,
                saveCode: '50-50;0000;stone-166:air-6:stone-43:air-8:stone-41:air-14:stone-5:air-5:stone-26:air-27:stone-9:basalt-10:stone-3:air-32:stone-5:basalt-12:stone:air-32:wood-2:air-3:basalt-13:air-37:basalt-16:air-34:basalt-17:air-30:stone-3:basalt-20:air-10:basalt-11:air-2:basalt-4:stone-3:basalt-41:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air-2:basalt-48:air:basalt-47:stone-2:air:stone-8:basalt-37:stone-13:basalt-35:stone-15:basalt-20:air-5:basalt-10:stone-15:air-2:basalt-12:air-12:basalt-8:stone-5:air-34:crate:air-2:basalt-7:stone-6:air-11:water-27:basalt-4:gravel-3:stone-5:air-11:water-2:gravel-4:water-16:gravel-12:stone-9:basalt:air-5:stone:gravel-34:stone-8:basalt-2:air:gunpowder-3:basalt:stone:gravel-34:stone-5:basalt-11:gravel-31:stone-6:basalt-2:air-3:basalt-8:stone-11:gravel-18:stone-2:air-19:stone-12:gravel-8:stone-8:c4-3:air-4:gunpowder-2:c4:air-6:c4-2:air-4:stone-15:gravel-3:stone-10:c4-3:air-3:c4-5:air-5:c4-3:air-2:c4:stone-28:c4-3:air-3:crate-5:air-4:c4-7:stone-29:basalt-2:water-9:basalt-3:c4-7:basalt-10:stone-19:basalt-35:stone-14:basalt-39:stone-5:basalt-128:;9c4:;a6:6:2b:8:29:e:5:5:1a:1b:16:20:12:20:2:3:d:25:10:22:11:1e:17:a:74e:;689:1:ac:1:c6:1:65:2:2a:1:134:;9c4:',
                backgroundColor: '#adadad',
                inventory: {
                    dirt: 2,
                    sand: 5,
                    wood: 10,
                    stone: 10,
                    water: 3,
                    lava: 1,
                    concrete_powder: 8,
                    detonator: 1,
                    gunpowder: 5,
                    c4: 5
                },
                difficulty: 'Easy',
                id: '59c66923-7f80-4f05-9206-6f4b475f917f'
            },
            {
                name: 'Creeper!?!?',
                description: `No, I'm not finishing the joke.<br><br>Why don't you just finish the level instead? I've given you some pushers to help you.`,
                saveCode: '&1;50-50;0000;stone-2e0:air-e:stone-1f:air-1b:stone-17:air-23:stone-c:air-43:stone-5:air-2c:stone-6:air-1e:stone-14:air-18:stone-1a:air-18:stone-1a:air-1a:stone-18:air-1c:stone-16:air-1c:stone-1d:air-16:stone-1c:air-18:stone-1c:air-16:slider_horizontal-13:stone-9:air-17:concrete:air-f:concrete:air:stone-a:air-16:concrete:air-f:concrete:air:stone-c:air-14:concrete:air-b:monster-2:air-2:concrete:air:stone-c:air-14:concrete:air-b:monster-2:air-2:concrete:air:stone-d:air-13:concrete:air-b:slime-2:air-2:concrete:air:stone-e:air-12:concrete:air-b:leaves-2:air-2:concrete:air:stone-e:air-12:concrete:air-b:leaves-2:air-2:concrete:air:stone-e:air-12:concrete:air-b:grass-2:air-2:concrete:air:stone-11:air-f:concrete:air-b:gunpowder-2:air-2:concrete:air:stone-107:basalt-5:stone-27:basalt-b:stone-25:basalt-12:stone-a:basalt-217:;9c4:;2e0:e:1f:13:1f:13:1c:16:16:17:1b:16:1c:8:5be:;9c4:',
                backgroundColor: '#adadad',
                inventory: {
                    sand: 1,
                    moss: 1,
                    stone: 4,
                    basalt: 3,
                    lava: 1,
                    piston_right: 1,
                    piston_down: 2,
                    slider_vertical: 1
                },
                difficulty: 'Medium',
                id: 'cff125a2-a61e-44bd-a0dd-698dd6b531a8'
            },
            {
                name: 'Secret Waterfall',
                description: `Well that's a pleasant surprise! An underground... waterfall. Close enough. The only problem here is that monster way up in that box. Well, you have a source of lava, at least.<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;50-50;0000;basalt-13:stone-8:basalt-29:stone-2:wood-6:stone:basalt-29:stone-2:wood:air-4:wood:stone:basalt-29:stone-2:wood:clay:air:monster:air:wood:stone-3:basalt-26:stone-3:wood-6:stone-3:basalt-26:stone-c:basalt-f:stone-4:basalt-13:stone-d:basalt-c:stone-8:basalt-10:stone-e:basalt-b:stone-3:gravel-3:stone-3:basalt-d:stone-11:basalt-a:stone-4:gravel-4:stone-2:basalt-c:stone-12:basalt-9:stone-5:gravel-4:stone-2:basalt-9:stone-16:basalt-4:stone-8:gravel-6:stone:basalt-4:stone-27:gravel-6:stone:basalt-3:stone-29:gravel-2:stone-4:basalt-3:stone-2f:basalt:stone-2b:air:gunpowder-2:air-3:stone-1c:air-11:gunpowder-2:air-3:stone-16:air-1c:stone-13:air-1f:stone-f:air-23:stone-7:air-87:basalt:crate-2:air-5:monster:air-29:basalt:water-7:wood-4:air-26:basalt:water-7:air:wood:air-28:cloner_left:water-7:wood:air-29:basalt-3:water-5:air-2b:basalt-3:water-4:air-2b:basalt-7:air-2c:basalt-6:air-2f:basalt-3:air-30:basalt-2:air-31:basalt:air-31:basalt:air-31:basalt:air-31:basalt:air-30:basalt-2:water-3:stone-2:air-27:wood-2:air-2:basalt-2:water-3:stone-7:air-21:wood-4:air:basalt-2:water-2:stone-a:air-17:wood:air:wood-2:air-4:wood:air:monster:wood:basalt-3:stone-e:air-14:wood:air:wood:air:wood-2:air-2:wood-2:monster-2:basalt-4:stone-10:air-12:stone-5:basalt:deleter-2:basalt-8:stone-13:air-e:basalt-2:stone-3:basalt-d:stone-13:basalt:lava-a:basalt-4:stone-2:basalt-f:stone-12:basalt-2:lava-9:basalt-16:stone-10:basalt-3:lava-7:basalt-1a:stone-e:basalt-6:lava-3:basalt-1c:stone-b:basalt-29:stone-7:basalt-135:;9c4:;31:1:2b6:1:2:3:2b:2:2:3:2b:7:2b:7:39:3:28:a:28:a:29:9:2c:6:2a:8:29:9:28:a:28:a:28:a:28:a:28:a:3de:;9c4:',
                backgroundColor: '#808080',
                inventory: {
                    wood: 6,
                    moss: 1,
                    stone: 40
                },
                difficulty: 'Easy',
                id: '0a66b866-4181-4a02-ba41-1df0b48c12ed'
            },
            {
                name: '(Nuclear) Lush Caves',
                description: `Wow, who would have guess that <i>this</i> was behind that waterfall? Hold on, something's wrong... Why are there nukes? And why is there concrete?<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;40-40;0000;stone-4:steel_crate:stone-e:moss:air-a:moss:stone-d:cloner_down:stone-f:moss:air-9:moss:stone-9:moss-3:stone-11:moss:monster:air-6:monster:air:moss:stone-9:air-3:moss-4:stone-e:moss:air:monster:air:monster-2:air:moss-2:stone-a:air-5:plant:air:moss-3:stone-c:moss-6:stone-c:air-5:plant:air-4:moss-2:stone-19:moss-3:air-5:plant:air-5:plant:moss-2:stone-15:moss-2:air:plant:air-6:nuke:air-5:plant:air-2:moss-3:stone-10:moss-2:air-3:plant:air-6:nuke_diffuser:air-5:plant:air-5:moss-3:stone-9:moss-4:air-5:plant:air-c:plant:air-5:plant:air-2:moss-9:air-2:plant:air-6:plant:air-c:plant:air-5:plant:air-6:plant:air-6:plant:air-6:plant:air-c:nuke:air-5:plant:air-6:plant:air-6:plant:air-6:nuke:air-c:nuke_diffuser:air-5:nuke:air-6:plant:air-6:nuke:air-6:nuke_diffuser:air-12:nuke_diffuser:air-6:plant:air-6:nuke_diffuser:air-20:plant:air-27:nuke:air-27:nuke_diffuser:air-65:moss-6:air-21:moss:stone-6:moss:air-20:moss:stone-7:moss:air-1f:concrete:stone-7:moss:air-1f:concrete-2:stone-7:moss:air-13:crate:water-5:air-4:concrete-3:stone-7:moss:air-f:crate:water-3:mud:silt-5:moss-4:concrete-4:stone-7:moss:air-a:crate:water-3:mud:silt-3:mud-3:silt-2:mud:stone-4:concrete-5:stone-7:moss-2:air-4:crate:water-3:mud:silt-4:mud-9:stone-3:concrete-7:stone-8:moss:silt:water-2:silt-4:mud:silt-3:mud-a:stone-2:concrete-9:stone-8:mud:silt-5:mud-f:stone:concrete-a:stone-8:mud-15:concrete-c:stone-7:mud-15:concrete-d:stone-7:mud-f:stone-5:concrete-e:stone-a:mud-8:stone-8:concrete-8:air-3:concrete-3:stone-1a:concrete-6:air-5:concrete-4:stone-19:concrete-5:moss:air-6:concrete-5:stone-17:concrete-6:moss:monster:air-4:moss:concrete-6:stone-15:concrete-7:moss:air:monster:air:moss:concrete-10:stone-c:concrete-8:moss-3:concrete-13:stone-a:concrete-40:;640:;117:1:27:1:27:1:27:1:27:1:27:1:27:1:26:2:26:2:26:2:26:2:26:2:26:2:26:2:26:2:26:2:26:2:2a8:;640:',
                backgroundColor: '#8cbe8c',
                inventory: {
                    lava: 1,
                    concrete: 4,
                    piston_left: 1,
                    piston_up: 4,
                    rotator_left: 1,
                    nuke: 4
                },
                difficulty: 'Hard',
                id: 'c9175af1-0b42-4f31-8118-aaf920fc8569'
            },
            {
                name: 'That\'s Deep',
                description: `What?<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;50-50;0000;basalt-14:stone-5:basalt-12:stone-7:basalt-15:stone-5:basalt-13:stone-5:basalt-15:stone:gravel-2:stone-2:basalt-15:stone-3:basalt-16:stone-3:basalt-17:stone-2:basalt-16:stone-2:monster:basalt-18:stone:basalt-15:air:crate:gunpowder:basalt-24:air-4:basalt-5:air-3:basalt-21:air-9:basalt-4:air-7:basalt-9:air-2:monster:basalt-3:air:basalt-9:air-f:basalt-3:air-9:basalt-4:air-5:basalt-4:air-2:basalt-8:air-f:basalt-2:air-a:basalt-3:air-6:basalt-4:air-4:basalt-6:air-10:basalt:air-a:basalt-3:air-7:basalt-3:air-1a:basalt:air-b:basalt-2:air-7:basalt-3:air-1a:basalt:air-b:basalt:air-8:basalt-2:air-27:basalt:air-8:basalt-2:air-31:basalt:air-31:basalt:air-31:basalt:air-105:basalt-4:air-2e:basalt-4:air-2e:basalt-5:air-2d:basalt-5:air-2d:basalt-5:air-2d:basalt-5:air-2d:basalt-5:air-2d:basalt-6:air-2c:basalt-7:air-29:basalt-a:air-f:basalt:stone:air-3:stone:basalt:air-e:basalt-f:lava-e:basalt-2:stone:air-2:basalt-2:lava-c:basalt-12:lava-e:basalt:stone:air:stone:basalt-2:lava-c:basalt-12:lava-d:basalt-2:stone-3:basalt:lava-c:basalt-14:lava-b:basalt-3:stone:air:stone:basalt:lava-b:basalt-17:lava-5:basalt-7:stone:air:stone:basalt:lava-6:basalt-28:stone:air:stone:basalt-2:lava:basalt-2c:stone:air:stone:basalt-2f:stone:air:stone-2:basalt-2d:stone:air-2:stone-2:basalt-14:stone:basalt-15:stone-4:air-3:stone-2:basalt-13:stone-4:basalt-11:stone-4:air-5:stone-2:basalt-11:stone-6:basalt-10:stone-2:air-8:stone:basalt-10:stone-8:basalt-f:stone:air-a:stone:basalt-f:stone-9:basalt-f:stone:air-2:monster:air-6:monster:basalt-f:stone-9:basalt-10:monster:air:monster-2:air-3:monster:air:basalt-f:stone-c:basalt-f:monster-4:air:monster-3:basalt-d:stone-f:basalt-e:monster-5:basalt-e:stone-13:basalt-1e:stone-9:;9c4:;190:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:31:1:31:1:541:;9c4:',
                backgroundColor: '#ffa082',
                inventory: {
                    wood: 1,
                    moss: 1,
                    stone: 10,
                    sponge: 1,
                    pump: 1,
                    piston_right: 3
                },
                difficulty: 'Medium',
                id: '31172f98-4365-4944-855e-9b6f28663f18'
            },
            {
                name: 'Oh (Underground) Well',
                description: `WELL WELL-<br>Okay, fine. But this again? Not sure why this is here, but it's in our - sorry, <i>your</i> - way, but at least you have actual useful stuff this time. I think.<br><br><i>Level credits: sp</i>`,
                saveCode: '&1;50-50;0000;air-18a:sand-6:air-2b:sand-7:air-20:concrete:water:concrete:air-7:sand-8:air-20:concrete:water:concrete:air-5:sand-14:air-6:sand-10:concrete:water:concrete:sand-1a:monster:sand-14:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-2f:concrete:water:concrete:sand-28:steel_crate-7:concrete:water:concrete:sand-1b:steel_crate-d:stone-7:concrete:water:concrete:sand-8:stone-7:steel_crate-c:stone-14:concrete:water:concrete:sand-2:stone-2d:concrete:water:concrete:stone-2f:concrete:water:concrete:stone-2f:concrete:water:concrete:stone-27:gravel-3:stone-5:concrete:water:concrete:stone-12:basalt-4:stone-8:basalt-3:stone-4:gravel-7:stone:basalt-2:concrete:water:concrete:basalt-4:stone-a:ash:stone:basalt-6:stone-3:basalt-a:stone:basalt:gravel-7:basalt-2:bricks-2:water:bricks-2:basalt-4:stone-6:ash-4:basalt-10:air-3:basalt-4:gravel-4:basalt-2:bricks-3:ice-3:bricks-3:basalt-5:ash-7:air-14:basalt-7:bricks-3:ice-7:bricks-3:basalt-4:ash-6:air-19:bricks-3:ice-b:bricks-3:basalt-3:ash-5:air-17:bricks-3:ice-f:bricks-3:basalt:ash-5:air-15:bricks-3:concrete:ice-11:concrete:bricks-3:ash-4:air-13:bricks-3:ice:concrete:ice-13:concrete:ice:bricks-3:ash-2:air-11:bricks-3:ice-2:concrete:ice-15:concrete:ice-2:bricks-3:air-11:bricks:ice-3:concrete:ice-17:concrete:ice-3:bricks:air-11:concrete:ice-2:concrete:ice-19:concrete:ice-2:concrete:air-11:concrete:ice:concrete:ice-1b:concrete:ice:concrete:air-11:concrete-2:ice-1d:concrete-2:air-11:concrete:ice-1f:concrete:basalt-4:air-d:concrete:ice-1f:concrete:basalt-7:air-a:concrete:ice-1f:concrete:basalt-8:air-9:concrete:ice-1f:concrete:basalt-a:air-7:concrete:ice-1f:concrete:basalt-c:air-5:concrete:ice-4:basalt-b:ice-10:concrete:basalt-25:ice-6:basalt-7:stone-3:basalt-2f:stone-5:basalt-2d:stone-5:basalt-45:;9c4:;5dc:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:2d:5:31:1:1bd:;9c4:',
                backgroundColor: '#808080',
                inventory: {
                    concrete: 10,
                    piston_up: 1,
                    copier_left: 1,
                    copier_up: 3,
                    copier_right: 1,
                    rotator_left: 1,
                    rotator_up: 1,
                    rotator_right: 1,
                    rotator_down: 1,
                    collapsible: 2,
                    detonator: 4,
                    gunpowder: 4,
                    c4: 4
                },
                difficulty: 'Medium',
                id: '61250451-ba8a-466a-b965-810fa404a959'
            },
            {
                name: 'Monstrous Cave Lair',
                description: `WOAH! We've gotten a <i>LOT</i> more than we bargained for here! Well, just you, I keep forgetting that I'm not actually involved in any of your stuff. Ah, well, just blow this place up and get it over with then.<br><br><i>Level credits: sp</i>`,
                saveCode: '&1;80-80;0000;stone-c:basalt-38:stone-8:air-2:stone-d:basalt-39:stone-8:air-2:stone-d:basalt-39:stone-8:air-2:stone-a:basalt-3d:stone-7:air-2:stone-8:basalt-41:stone-5:air-2:stone-7:basalt-43:stone-4:air-2:stone-6:basalt-2b:air:basalt-19:stone-3:air-2:stone-5:basalt-29:air-6:basalt-19:stone:air-2:stone-5:basalt-27:air-a:basalt-18:air-2:stone-4:basalt-26:air-f:basalt-15:air-2:stone-2:basalt-24:air:concrete:air-13:basalt-13:air-2:basalt:stone:basalt-22:air-3:concrete:air-14:basalt-12:air-2:basalt-1f:air-8:concrete:air-14:basalt-12:air-2:basalt-e:air-5:concrete:air-7:concrete:air-b:concrete:air-15:basalt-11:air-2:basalt-c:air-6:concrete:air-8:concrete:air-b:concrete:air-16:basalt-10:air-2:basalt-c:air-5:concrete:air-9:concrete:air-b:concrete:air-16:basalt-10:air-2:basalt-b:air-5:concrete:air-a:concrete:air-a:wood-3:air-15:basalt-10:air-2:basalt-b:air-4:concrete:air-b:concrete:air-7:wood-3:air-18:basalt-10:air-2:basalt-a:concrete:air-3:concrete:air-c:concrete:air-4:wood-3:air-1c:basalt-f:air-2:basalt-a:concrete:air-2:concrete:air-d:concrete:air:wood-3:air-1f:basalt-f:air-2:basalt-9:air:concrete:air:concrete:air-d:wood-3:air-23:basalt-e:air-2:basalt-9:air:concrete-2:air-25:stone_bricks-3:air-c:concrete:air-4:basalt-9:air-2:basalt-9:air:concrete:air-22:stone_bricks-5:laser_scatterer:stone_bricks-5:air-9:concrete:air-5:basalt-7:air-2:basalt-9:air:concrete:air-21:stone_bricks-2:air:wood-2:air:laser_scatterer:air:wood-2:air:stone_bricks-2:air-9:concrete:air-4:basalt-7:air-2:basalt-9:air:concrete:air-20:stone_bricks-2:air-5:goal:air-5:stone_bricks-2:air-9:concrete:air-5:basalt-5:air-2:basalt-8:air-2:concrete:air-1e:stone_bricks-3:air-d:stone_bricks-3:air-8:concrete:air-4:concrete:basalt-4:air-2:basalt-8:air-2:concrete:air-4:laser_scatterer:air-1a:wood:air-f:wood:air-a:concrete:air-3:concrete:air:basalt-3:air-2:basalt-8:concrete:air:concrete:air-4:laser_scatterer:air-1a:wood:air-8:monster:air:monster:air-4:wood:air-b:concrete:air-2:concrete:air-2:basalt-2:air-2:basalt-7:air-2:concrete-2:air-4:laser_scatterer:air-18:monster:air:wood:air-7:crate-4:air-3:monster:wood:air-3:monster:air-8:concrete:air:concrete:air-2:basalt-2:air-2:basalt-7:air-3:concrete:air-4:laser_scatterer:air-18:stone_bricks-2:basalt-2:water-d:basalt-6:air-9:concrete-2:air-2:basalt-2:air-2:basalt-7:air-3:concrete:air-4:laser_scatterer:air-17:stone_bricks-2:basalt-4:water-b:basalt-5:air-c:concrete:air-2:basalt-2:air-2:basalt-7:air-3:concrete:air-3:laser_scatterer:steel:laser_scatterer:air-15:stone_bricks-2:air-2:basalt-4:water-a:basalt-4:air-d:concrete:air-2:basalt-2:air-2:basalt-7:air-3:concrete:air-3:steel:laser_scatterer:steel:air-14:stone_bricks-2:air-4:basalt-4:water-9:basalt-4:air-d:concrete:air-2:basalt-2:air-2:basalt-7:concrete:air-2:concrete:air-3:laser_scatterer:steel:laser_scatterer:air-13:stone_bricks-2:air-6:basalt-7:water-4:basalt-5:air-d:concrete:air-2:basalt-2:air-2:basalt-7:air:concrete:air:concrete:air-2:laser_scatterer:air-3:laser_scatterer:air-11:stone_bricks-2:air-b:basalt-4:water-3:basalt-5:air-d:concrete:air:concrete:basalt-2:air-2:basalt-7:air-2:concrete-2:air-2:laser_scatterer:air-3:laser_scatterer:air-10:stone_bricks-2:air-d:basalt-4:water-2:basalt-4:air-e:concrete-2:air:basalt-2:air-2:basalt-8:air-2:concrete:air-2:laser_scatterer:air:clay:air:laser_scatterer:air-f:stone_bricks-2:air-f:basalt-8:air-f:concrete:air-2:basalt-2:air-2:basalt-8:air-2:concrete:air-2:laser_scatterer:air:laser_scatterer:monster:laser_scatterer:air-e:stone_bricks-2:air-11:basalt-5:air-11:concrete:air-2:basalt-2:air-2:basalt-8:air-2:concrete:air:laser_scatterer:steel-5:laser_scatterer:air-c:stone_bricks-2:air-28:concrete:air-2:basalt-2:air-2:basalt-8:air-2:concrete:air:laser_scatterer:air-5:laser_scatterer:air-b:stone_bricks-2:air-29:concrete:air-2:basalt-2:air-2:basalt-8:air-2:concrete:air:laser_scatterer:air-5:laser_scatterer:air-a:stone_bricks-2:air-2a:concrete:air-2:basalt-2:air-2:basalt-9:air:concrete:air:laser_scatterer:air-2:deleter:air-2:laser_scatterer:air-9:stone_bricks-2:air-3:monster:air-27:concrete:air-2:basalt-2:air-2:basalt-b:air:laser_scatterer:monster:air:laser_scatterer:air-2:laser_scatterer:air-8:stone_bricks-2:air:wood:plant:wood-2:air-27:concrete:air:concrete:basalt-2:air-2:basalt-b:air:laser_scatterer:monster-2:laser_scatterer:monster-2:laser_scatterer:air-4:monster:air-2:stone_bricks-2:air-3:wood:air-29:concrete-2:air:basalt-2:air-2:basalt-15:stone_bricks-c:air-28:concrete:air-2:basalt-2:air-2:basalt-17:air:stone_bricks:air-2:stone_bricks:air-2:stone_bricks:air:stone_bricks-2:air-20:stone_bricks-4:air-3:concrete:air:basalt-3:air-2:basalt-18:stone_bricks:air-2:stone_bricks:air-2:stone_bricks:air-2:stone_bricks-2:air-f:stone_bricks:air-e:stone_bricks-2:air-2:stone_bricks-2:air-2:concrete:air:basalt-3:air-2:basalt-1a:air:stone_bricks:air-2:stone_bricks:air-3:stone_bricks-2:air-c:stone_bricks-5:air-b:stone_bricks-2:air-4:stone_bricks-2:air:concrete:air:basalt-3:air-2:basalt-1b:stone_bricks:air-2:stone_bricks:air-4:stone_bricks-2:monster:air-6:stone_bricks-5:wood-3:stone_bricks-2:air-b:wood:air-4:wood:air-2:concrete-5:steel-2:concrete-2:basalt-1a:air-2:stone_bricks:air-5:stone_bricks-2:air-7:wood:air-2:wood:air-3:wood:air-c:wood:air-4:wood:air-2:reinforced_glass:air-3:reinforced_glass:air-2:reinforced_glass:air:basalt-1c:stone_bricks:air-6:stone_bricks-2:air-6:wood:air-2:wood:air-3:wood:air-6:crate:air-5:wood:air-4:wood:air-2:reinforced_glass:air-3:reinforced_glass:air-2:reinforced_glass:air:basalt-1d:air-7:stone_bricks-2:air-5:wood:air-2:wood:air:monster:air:wood:air-5:crate-2:air-5:wood:air:monster:air-2:wood:air:monster:reinforced_glass:monster:air-2:reinforced_glass:air-2:reinforced_glass:air:basalt-1d:air-8:stone_bricks-2:air-3:steel-9:air-3:monster:air:crate-2:air-2:monster:air:stone_bricks:basalt-6:stone_bricks-7:steel-2:stone_bricks-2:basalt-1d:air-9:stone_bricks-4:basalt-8:wet_ash-a:stone_bricks-2:basalt-d:stone_bricks-4:basalt-1e:air-9:basalt-b:wet_ash-b:basalt-31:air-9:basalt-10:wet_ash-5:basalt-32:air-9:basalt-46:air-a:basalt-45:air-b:basalt-44:concrete:air-b:basalt-43:concrete-3:air-a:basalt-42:concrete-4:air-b:basalt-3f:concrete-6:air-c:basalt-3c:concrete-8:air-e:basalt-3a:concrete-9:air-8:steel-8:wet_ash:basalt-35:concrete-a:air-9:wood:ice-4:wood:wet_ash-3:basalt-33:concrete-4:monster:concrete-6:air-9:wood:ice:c4-2:ice:wood:wet_ash-3:basalt-33:concrete-b:air-9:wood:ice:monster:steel:ice:wood:wet_ash-3:basalt-34:concrete-a:air-9:wood:ice-4:wood:wet_ash-4:basalt-36:concrete-8:air-6:stone_bricks:steel-8:wet_ash-3:basalt-3d:concrete-2:air-4:stone_bricks:basalt-3:wet_ash-a:basalt-3e:stone_bricks-4:basalt-6:wet_ash-8:basalt-4b:wet_ash-4:basalt-592:;1900:;344:2:4c:4:47:9:36:6:7:d:34:7:8:d:34:6:9:d:33:6:a:b:35:5:b:8:38:4:c:5:3b:3:d:2:3e:2:4e:1:34:5:4c:6:37:4:1:4:b:5:36:5:1:5:b:6:33:d:b:5:31:11:a:4:31:9:1:1:1:5:b:3:31:8:4:3:1:1:c:2:4f:1:4d6:1:4f:2:4e:3:4d:4:4c:5:4b:6:4a:7:49:8:48:9:47:9:47:9:7aa:;1900:',
                backgroundColor: '#808080',
                inventory: {
                    ash: 10,
                    piston_down: 2,
                    cloner_down: 3,
                    flamethrower_right: 6,
                    gunpowder: 10,
                    c4: 4
                },
                difficulty: 'Hard',
                id: '39b39752-f74a-40fc-b32b-12b02959a3f6'
            }
        ]
    },
    {
        name: 'Rafting Revisited',
        levels: [
            {
                name: 'Rafting 2: Electric Boogaloo (Déjà vu?)',
                description: `Huh, how did we even get to this river? Oh! Monsters! Quick, find a way to wash them off before they leave! <i>Why does it feel like we've done this before?</i>`,
                saveCode: '50-50;0000;air-1900:sand-2:air-48:sand-5:air-40:gravel-5:sand-7:air-13:wood-8:air-15:gravel-7:stone-4:sand-4:water-13:wood-6:water-15:gravel-5:stone-9:gravel-3:water-31:gravel-5:stone-13:gravel-5:water-25:gravel-4:stone-18:gravel-7:water-6:gravel-18:stone-21:gravel-16:stone-43:gravel-3:stone-176:;9c4:;0:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:24:e:4d3:1:;7b4:2:1:1:20c:;9c4:',
                backgroundColor: '#e0f0ff',
                inventory: {
                    sand: 10,
                    concrete_powder: 2,
                    crate: 8
                },
                difficulty: 'Medium',
                id: '6e7b58c7-9a0e-4dd5-a359-ab5450178965'
            },
            {
                name: 'White Water Rafting',
                description: `Watch out for rocks! Wait, that's a raft. How did they make a raft out of rocks?`,
                saveCode: '50-50;0000;air-1907:stone-5:air-33:crate:air-10:stone:air-3:gunpowder:air:stone:air-28:crate:air-2:wood-3:air-9:stone-7:air-12:crate-3:air-9:stone:air-3:wood-3:air-2:gravel-2:air-2:water-3:stone:water-32:stone-2:water:gravel:water-3:gravel-2:stone-4:water-4:stone:water-7:stone:gravel:water-2:stone:water-9:stone:water-10:stone-2:gravel:stone-2:gravel-3:stone-5:water:gravel:water:stone-2:gravel-2:water-5:stone-3:gravel:stone-2:gravel-3:water-4:stone-2:water:stone:water:gravel-2:water:gravel-4:stone-20:gravel:water:gravel-3:stone-6:gravel-4:water-2:stone-5:gravel-2:stone:gravel-3:stone:gravel:stone-21:gravel:stone:gravel:stone-9:gravel-3:stone-228:;9c4:;10b:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:3b6:;7a7:1:1:1:21a:;9c4:',
                backgroundColor: '#c7e5f4',
                inventory: {
                    sand: 2,
                    moss: 3,
                    concrete_powder: 6,
                    concrete: 3,
                    crate: 8
                },
                difficulty: 'Medium',
                id: '51c7bb61-4226-48de-9095-3d03506ee03c'
            },
            {
                name: 'Canoeing',
                description: `I wouldn't call that a canoe, but.... The monsters have built a huge canoe to protect themselves! Unfortunately, <i>it's made of wood</i>. Silly monsters.`,
                saveCode: '50-50;0000;air-1908:wood-6:air-43:wood:air-6:wood:air-40:wood-3:air-6:wood-3:air-33:water-5:wood-2:air-8:wood-2:water-39:wood-10:water-84:gravel-2:water-48:gravel-3:water-47:stone:gravel-4:water-45:stone:gravel-11:water-35:gravel-3:stone-4:gravel-12:water-26:gravel-8:stone-11:gravel-39:;9c4:;303:1d:15:1d:15:1d:303:1d:15:1d:15:1d:2bc:;7d9:1:3:1:2b:4:1:2:1b4:;9c4:',
                backgroundColor: '#afd9e9',
                inventory: {
                    lava: 12,
                    concrete_powder: 6,
                    concrete: 10
                },
                difficulty: 'Easy',
                id: '0da30021-7356-436f-aaec-3f364fdfd758'
            },
            {
                name: 'Canyon Rafting',
                description: `This is a big canyon! But the monsters are smarter than they let on, they've built a roof over their raft to protect themselves from falling stuff.`,
                saveCode: '50-50;0000;air-406:leaves-4:air-36:leaves-3:air-6:leaves-2:wood:leaves-3:air-29:leaves-3:air-2:leaves-2:wood:leaves-4:air-5:wood:leaves:air-30:leaves-2:wood:leaves-2:air-3:wood:air-2:wood:leaves-2:air-4:wood:air-33:wood:air-6:wood:air:wood:leaves-2:air-3:wood:air-33:wood:air-7:wood:air:wood:air-5:wood:air-33:wood:air-7:wood:air:grass-10:air-25:wood-4:grass-11:dirt-11:air-27:wood:dirt-11:stone-11:air-27:stone-23:air-26:stone-24:air-26:stone-24:air-26:stone-24:air-26:stone-24:air-26:stone-24:air-26:stone-24:air-26:stone-13:basalt-11:air-26:basalt-24:air-26:basalt-13:stone-11:air-26:stone-24:air-26:stone-13:basalt-12:air-25:basalt-13:stone-12:air-25:stone-25:air-25:stone-25:air-25:stone-13:basalt-12:air-25:basalt-25:air-25:basalt-25:air-25:basalt-25:air-25:basalt-26:air-24:basalt-26:air-24:basalt-26:air-24:basalt-26:air-11:gunpowder:air-12:basalt-26:air-10:crate-5:air-9:basalt-26:water-23:basalt-28:water-21:basalt-29:water-21:basalt-30:water-19:gravel:basalt-30:water-17:gravel-3:basalt-30:water-16:basalt-34:gravel-3:water-11:basalt-121:;9c4:;1e5:4:2e:4:2e:4:2e:4:2e:4:51e:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:;784:1:33:1:20b:;9c4:',
                backgroundColor: '#96cede',
                inventory: {
                    gravel: 8,
                    wood: 4,
                    lava: 1,
                    sponge: 1,
                    detonator: 1,
                    gunpowder: 5,
                    c4: 5
                },
                difficulty: 'Medium',
                id: '86f12e16-2bd8-4d2d-a787-b2c12e4e4b1a'
            },
            {
                name: 'Tropical Rafting',
                description: `If this isn't the Amazon and it's definitely not the Sahara, and we just passed through a massive canyon, where are we? Speaking of Sahara, you should - MONSTER! KILL IT! <h>AAAAAAAAAAAAAAAAAAAAAA!!!</h>`,
                saveCode: '50-50;0000;air-500:leaves-6:air-44:leaves-7:air-43:wood:leaves:wood:leaves-5:air-42:wood:leaves-2:wood:leaves-4:air-42:wood-3:leaves-4:air-43:wood:leaves-4:air-45:wood:leaves-2:air-47:wood:leaves-3:air-46:wood:air:leaves-2:air-46:wood-2:leaves:air-47:wood:leaves:air-48:wood:air-2:leaves-5:air-42:wood:air:leaves-2:wood-3:leaves-2:air-41:wood:leaves-2:wood:leaves-5:air-34:leaves-5:air-2:wood:leaves-3:wood:leaves-3:air-34:leaves-8:wood:air:leaves:wood:leaves:air-36:leaves-2:wood:leaves-6:wood:air:wood:leaves:air-37:leaves-2:wood:leaves-3:wood:leaves-2:wood-2:air-39:leaves-3:wood:leaves-2:wood:leaves-2:wood-2:air-39:leaves-4:wood:leaves:wood:leaves-2:wood:air-43:leaves:wood:leaves:wood:air-2:wood:air-44:leaves:wood:air-3:wood:air-45:wood:air-3:wood:air-45:wood:air-3:wood:air-46:wood:air-2:wood:air-46:wood:air-2:wood:air:leaves-6:air-39:wood:air-2:wood:leaves-2:wood:leaves-4:air-39:wood:air-2:wood:leaves-2:wood:leaves:wood:leaves-2:air-15:glass-4:air-14:leaves-3:air-3:wood:air-2:wood:leaves:wood:leaves-2:wood:air:moss:air-14:glass:air-4:glass:air-13:leaves:wood:leaves-2:air:wood:air:leaves-2:wood:air-2:wood:air:wood:moss:stone:moss:air-13:glass:air-4:glass:air-14:leaves:wood:leaves:air:wood:leaves-2:wood:dirt:grass-2:dirt:grass:dirt-4:grass:moss:air-11:crate-6:air-13:grass:dirt-3:grass:dirt-15:mud:water-27:mud:grass:dirt-21:mud-3:water-21:mud-3:dirt-26:mud-3:water-15:mud-3:dirt-32:mud-4:water-8:mud-3:dirt-39:mud-8:dirt-220:;9c4:;57a:9:28:a:28:a:28:a:28:a:1e:5:5:a:1e:5:5:a:1e:5:5:1:6:3:1e:5:c:3:1e:5:c:3:2f:3:30:2:21b:;7b5:4:20b:;9c4:',
                backgroundColor: '#7dc3d3',
                inventory: {
                    sand: 5,
                    lava: 4,
                    concrete_powder: 10,
                    concrete: 20,
                    crate: 10,
                    sponge: 1,
                    pump: 1
                },
                difficulty: 'Easy',
                id: '2951e639-97bb-41dd-bbc8-5a9ed635090e'
            },
            {
                name: 'Explosive Rafting',
                description: `Is it even correct to call <i>that</i> a raft? Is that explosives I see?<br><br><i>Level credit: Billiam</i>`,
                saveCode: '50-50;0000;air-1039:wood:air-49:wood:air-49:wood:air-49:wood:air-49:wood:air-6:wood:air-42:wood:air-6:wood:air-42:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-35:wood:air-6:wood:air-6:wood:air-12:wood:air-5:wood:air-16:wood:air-6:wood:air-4:wood-6:concrete-7:wood-10:air-7:wood-4:air-4:wood:air-6:wood:air-3:wood:air-5:glass:concrete-7:air-2:wood:air-5:wood:air-11:wood-23:concrete-7:air-2:wood:air-5:wood:air-14:wood:gunpowder-10:c4-8:wood:concrete-7:air-2:wood:air-5:wood:air-15:wood:gunpowder-8:c4-8:wood:air:concrete-7:water-2:wood:water-5:wood:water-16:wood-2:gunpowder-4:c4-8:wood-2:water-2:concrete-7:sand-2:wood:water-5:wood:water-18:wood-12:water-4:concrete-7:sand-2:wood:sand-2:water-3:wood:water-34:concrete-7:sand-2:wood:sand-3:water-2:wood:water-34:concrete-7:sand-2:wood:sand-5:wood:sand:water-33:concrete-7:sand-2:wood:sand-5:wood:sand-3:water-31:concrete-7:sand-2:wood:sand-5:wood:sand-5:water-29:;9c4:;44c:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:11:21:9:1:5:1:1:247:;27:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:31:1:ce:1:87:1:232:1:1c:1:37:1:3:1:2:1:3:1:5:2:1f5:;9c4:',
                backgroundColor: '#65b7c7',
                inventory: {
                    grass: 5,
                    wood: 20,
                    lava: 5,
                    concrete_powder: 6,
                    concrete: 10
                },
                difficulty: 'Easy',
                id: '80a0397c-eb7c-44cd-9cf3-bc8baf5da6b5'
            },
            {
                name: 'Frozen Lake Rafting',
                description: `What? How did we even get on this high-altitude frozen lake? Oh no, your water pixels froze and your lava's gone cold! What are we supposed to do now? Hope the monsters fall through thin ice? Wait, why did you bring flamethrowers?`,
                saveCode: '50-50;0000;air-2039:crate-5:air-6:ice-81:water-12:ice-7:water:ice-11:water-8:ice-4:water-326:;9c4:;0:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:1d9:;7c6:2:1fc:;9c4:',
                backgroundColor: '#4cacbc',
                inventory: {
                    concrete: 11,
                    flamethrower_down: 5
                },
                difficulty: 'Easy',
                id: '4a2c21a2-f473-443c-a970-8b3d94e0ee56'
            },
            {
                name: 'Mountain Rafting', // earthen fortress? i am bad at poem
                description: `<i>Who guards this fortress of earth and stone?<br>What treasure lies deep unfound within?</i><br><br>Maybe some Ialite; if you know, you know. I like to say I like poetry. I wasn't supposed to say that part! AUHGSLAGUHD MONSTER!`,
                saveCode: '50-50;0000;air-550:grass-3:air-47:stone-3:air-47:stone-3:air-47:stone-4:air-46:stone-4:air-46:stone-4:air-46:stone-4:air-46:stone-4:air-46:stone-5:air-45:stone-5:air-45:stone-5:air-45:stone-5:air-45:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:air-44:stone-6:grass:air-43:stone-7:air-43:stone-7:grass:air-42:stone-2:color_violet:stone-5:air-42:color_violet:stone-7:grass:air-41:stone-3:color_violet:stone-5:grass:air-40:stone-9:dirt:grass-6:air-34:stone-10:dirt-6:grass:air-33:stone-17:air-16:gunpowder:air-16:stone-17:air-13:crate-3:wood-2:air-15:stone-17:water-33:stone-17:water-33:stone-17:water-33:basalt-4:stone-14:water-32:basalt-8:stone-12:water-27:stone-3:basalt-16:stone-34:basalt-150:;9c4:;12c:3:2f:3:2f:3:2f:3:2f:3:387:b:27:b:27:b:28:a:28:a:29:9:29:9:2a:8:2b:7:31:1:279:;78b:2:30:2:205:;9c4:',
                backgroundColor: '#33a1b1',
                inventory: {
                    sand: 1,
                    gravel: 2,
                    moss: 1,
                    water: 2,
                    ice: 2,
                    lava: 1,
                    concrete_powder: 1,
                    concrete: 40,
                    sponge: 1
                },
                difficulty: 'Easy',
                id: '485e8eb6-ec91-44a3-9df9-b0718191c248'
            },
            {
                name: 'Flower Meadow Rafting',
                description: `That's strange; I don't see any flowers. But I <i>do</i> see monsters. Why are they trying to raft here?`,
                saveCode: '50-50;0000;air-1600:leaves-3:air-47:leaves-4:air-46:leaves:wood:leaves-2:air-46:leaves:wood:leaves-2:air-47:wood:air-49:wood:air-49:wood:air-49:wood:air-49:wood:air-23:crate-5:air-20:grass:dirt:grass-23:dirt-5:grass-20:dirt-400:;9c4:;190:17:9:29:9:29:9:12:79e:;7b8:3:209:;9c4:',
                backgroundColor: '#1b95a6',
                inventory: {
                    water: 6,
                    concrete: 50,
                    freezer: 6, // refrigerator: 1
                    piston_right: 1,
                    rotator_counterclockwise: 2,
                    flamethrower_up: 1
                },
                difficulty: 'Medium',
                id: '5eef19d7-265d-43fa-85dc-f5832ca0ca3c'
            },
            {
                name: 'Sunset Rose Rafting',
                description: `That's a cool sunset. It's not the best looking scenery to be in, but at least this river isn't radiator fluid.`,
                saveCode: '50-50;0000;air-305:grass-6:air-44:stone-6:air-44:stone-5:air-46:stone-3:air-23:leaves-2:air-23:stone-2:air-21:leaves-4:air-46:leaves-2:wood:leaves-2:air-46:wood:leaves-3:air-46:wood:air:leaves:air-47:wood:air-46:grass-3:dirt:grass:air-44:grass:dirt-5:grass-2:air-42:stone-8:air-42:stone-8:air-42:stone-7:air-44:stone-6:air-44:stone-4:air-47:stone-3:air-47:stone-2:air-625:wood:air-24:leaves:wood:leaves-2:air-21:wood:air-24:leaves:wood:leaves-2:air-21:wood:air-24:leaves:wood:leaves-2:air-21:wood:air-24:leaves:wood:leaves-2:air-18:crate:air-2:wood:air-25:wood:air-19:wood:crate:bricks-2:wood:basalt:lava:basalt:air:sponge:wood:air-19:wood:air-19:wood-2:bricks-2:wood:basalt-3:wood-3:air-15:crate-7:air-15:water-4:wood-7:water-138:mud-5:water-42:mud-3:dirt-5:mud-4:water-35:mud-3:dirt-4:stone:dirt-3:clay:dirt-2:clay:mud-5:water-24:mud-6:dirt-2:clay-3:stone-5:dirt-5:clay:dirt:clay-3:silt-24:clay-4:dirt-2:clay-3:dirt:stone-3:;9c4:;0:1f:13:1f:13:1f:13:1f:13:1f:13:1f:13:5:6:14:13:5:6:14:13:5:5:15:13:6:3:16:13:7:2:15:14:1e:14:1f:13:1f:13:1f:13:1c:16:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:17:1b:4f9:;81f:1:1:1:1a2:;9c4:',
                backgroundColor: new Function('let fn = ' + function () {
                    let a = ctx.createLinearGradient(0, 0, 0, canvasResolution);
                    a.addColorStop(0, '#028a9b');
                    a.addColorStop(0.3, '#bfa194');
                    a.addColorStop(0.6, '#f8cf9b');
                    a.addColorStop(0.75, '#f8a147');
                    a.addColorStop(0.8, '#de5a5a');
                    a.addColorStop(0.85, '#bf3f76');
                    a.addColorStop(1, '#bf3f76');
                    return a;
                }.toString() + '; return fn()')(),
                inventory: {
                    sand: 4,
                    water: 3,
                    dirt: 5,
                    bricks: 25,
                    crate: 2,

                },
                difficulty: 'Medium',
                id: '420b583a-98e4-4c0b-9fc1-a22bd5ebaead'
            },
        ]
    },
    {
        name: 'Pixel Machines',
        levels: [
            {
                name: 'Pushy Pushers',
                description: `These pixels can <h>move on their own</h>, I wonder if you can make a computer with them. Oh, by the way, watch out for the gunpowder.`,
                saveCode: '32;0000;wall-33:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:concrete:lava-2:air-3:concrete:air-23:wall-2:concrete-7:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:gunpowder-5:wood:air-21:wall:air:wall-2:wood:gunpowder-5:wood:air-21:wall:air:wall-2:wood-7:air-21:wall:air:wall-10:air-19:wall-2:water:wall-2:air-3:wall:air-24:wall:air:wall-2:air-2:wall:air-25:wall:air:wall-2:air:wall:air-26:wall:air:wall-3:air-15:sand-3:air-9:wall:air:wall-2:air-15:sand-5:air-8:wall:air:wall-2:air-13:wall-19:air-17:wall:air-12:wall-2:air-17:wall:air-12:wall-7:air-12:wall:air-12:wall-3:air-16:wall:air-9:wall-6:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-33:;400:;21:7:19:7:19:7:19:7:19:7:19:7:19:7:1c:3:127:f:1:1:f:f:1:1:f:f:1:1:f:3:3:9:1:1:f:2:5:8:1:1:34:3:1d:3:1d:3:1d:3:1d:3:1d:3:1d:3:1d:3:2a:;1e8:1:13:1:140:1:6e:1:1f:2:c:1:25:',
                backgroundColor: '#ffffff',
                inventory: {
                    piston_left: 1,
                    piston_up: 1,
                    piston_right: 2,
                    piston_down: 1
                },
                difficulty: 'Tutorial',
                id: '61263f9d-0719-44e9-8f1f-f514468f9556'
            },
            {
                name: 'Spinny Rotators',
                description: `Oh cool, we can rotate stuff now. Well, I already knew that. Anyways, you only have <h>rightwards pushers</h>, <h>clockwise rotators</h>, and <h>rightwards rotators</h>. And a <h>wall</h>, which is immovable. <i>Use the existing rotators to your advantage.</i><br><br><h>The rotators with spinning textures will rotate pixels in their direction, and the static ones will rotate pixels to face the same way as them.</h>`,
                saveCode: '40;0000;wall-17:air-3:wall-21:air-15:wall:air-3:wall:air-12:rotator_left:air-5:wall-2:air-15:wall:air-3:wall:air-3:rotator_counterclockwise:air-14:wall-2:air-15:wall:air-3:wall:air-18:wall-2:air-15:wall:air-3:wall:rotator_down:air-11:piston_left:air-5:wall-2:air-15:wall:air-3:wall:air-5:wall-6:air-7:wall-2:air-15:wall:air-3:wall:air-10:wall:air-7:wall-2:air-15:wall:lava-3:wall:air-10:wall:air-7:wall-2:air-19:wall:air-10:wall:air-7:wall-2:air-18:piston_left:wall:air-10:wall:air-7:wall-2:air-9:wall-4:air-6:wall:air-10:wall:air-7:wall-2:air-12:wall-13:air-5:wall:air-7:wall-2:rotator_counterclockwise:air-29:wall:air-7:wall-2:air-30:wall:air-7:wall-2:air-12:wall-11:air-3:rotator_left:air-3:wall:air-7:wall-2:air-30:wall:air-7:wall-2:air-30:rotator_left:air-7:wall-2:air-9:wall-22:air-7:wall-2:air-16:wall:air-21:wall-2:air-16:wall:air-21:wall-2:air-5:wall:air-10:wall:air-4:piston_right:air-11:rotator_up:air-4:wall-2:air-5:wall:air-10:wall:air-21:wall-2:air-5:wall:air-10:wall:air-21:wall-2:air-5:wall:air-10:wall-24:air-2:gunpowder-3:wall:air-32:wall-2:gunpowder-5:wall:air-32:wall-2:gunpowder-5:wall:air-31:rotator_down:wall-8:wood-2:air-29:rotator_down:wall-2:air-30:wall:air-7:wall-2:air-30:wall-4:air-4:wall-2:air-14:wall-3:air-7:rotator_left:wall-6:air:wall-2:air-4:wall-2:air-14:wall:rotator_counterclockwise:air-8:rotator_left:wall:air-4:wall:air-7:wall-2:air-10:rotator_up:concrete:piston_left:air:wall:air-9:rotator_left:wall:air-4:wall:air-4:wall:air-2:wall-17:air-9:rotator_left:wall:air-4:wall:rotator_up:air-2:rotator_clockwise:wall:air-2:wall-2:air-24:wall-2:air-4:wall-6:air-2:wall-2:air-24:wall-2:air-9:wall:air-2:wall-2:air-16:rotator_left:air-7:concrete:rotator_down:air:wall:air-10:wall-6:air-20:wall-2:air-12:wall-6:air-20:wall-2:air-10:rotator_left-2:wall-41:;640:;105:a:1e:a:16:7:1:a:1e:a:1e:a:122:10:18:10:18:5:1:a:18:5:1:a:18:5:1:a:1e:a:18:2:4:1d:b:1d:d:1b:d:1b:5:6:8:10:1:4:5:6:8:10:a:6:b:7:10:6:a:8:10:6:a:8:20:8:20:8:20:8:21:7:1f:9:1f:9:37:;174:1:11d:1:109:1:7a:2:b7:1:d0:1:69:1:34:;640:',
                backgroundColor: '#ffffff',
                inventory: {
                    wall: 1,
                    piston_right: 8,
                    rotator_right: 3,
                    rotator_clockwise: 3
                },
                difficulty: 'Easy',
                id: 'f1f004fe-fac1-482d-866c-bead1f9c6057'
            },
            {
                name: 'Moving Machines',
                description: `There's those <h>goal</h> (gold) and <h>target</h> (cyan) pixels I alluded to earlier. You must <h>push the goal pixels into the targets to win</h>. Those yellow-orange pixels with horizontal and vertical lines are <h>sliders</h>- They <h>can only be pushed along one axis</h> and <h>can be rotated</h>, perhaps that will be useful here.<br><br><i>Remember, when in doubt, do random stuff and see what happens!</i>`,
                saveCode: '&1;50-50;0000;wall-33:air-8:piston_down:air-27:wall-2:air-30:wall-2:air-6:piston_right:air-1c:leaves-3:air-a:wall-2:air-23:leaves-3:air-a:wall-2:air-7:piston_up:air-1a:leaves-2:wood:leaves-2:air-9:wall-2:air-22:leaves-2:wood:leaves-2:air-4:monster:air-2:monster:air:wall-2:grass-8:air-1c:wood:air-4:monster:air:monster:air-2:crate:air:wall-2:dirt-8:grass-e:air-e:wood:air-2:grass-9:wall-2:dirt-16:grass-e:dirt:grass-2:dirt-9:wall-2:dirt-30:wall-2:dirt-30:wall-34:air-30:wall-2:air-30:wall-2:air-3:slider_horizontal:air-2c:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-22:cloner_down:air-d:wall-2:air-8:wall-1a:air:rotator_clockwise:air-3:rotator_clockwise:air-8:wall-2:air-8:wall:air-15:piston_down:air-2:wall:air-e:wall-2:air-8:wall:air-14:rotator_down:slider_vertical:air-2:wall:air-e:wall-2:air-8:wall:air-14:slider_vertical:air-3:wall:air:piston_up:air-c:wall-2:air-8:wall-4:piston_up:wall:piston_up-2:wall-5:piston_up:wall-7:air-4:wall:air:rotator_clockwise:air-3:rotator_clockwise:air-8:wall-2:air-8:wall:air-13:wall:air-4:wall:air-e:wall-2:air-8:wall:air-13:wall:air-4:wall:air-e:wall-2:air-4:slider_vertical:air-3:wall:monster:air-12:wall:air-4:wall:air-e:wall-2:air-4:slider_vertical:air-3:wall-2:air-13:slider_horizontal-2:air-2:wall:air-e:wall-2:air-3:cloner_left:air-4:wall:air-13:wall:monster-2:air-2:wall:air-e:wall-2:air-8:wall:air-6:monster:air-c:wall:monster-2:air-2:wall:air-e:wall-2:air-8:wall-1a:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-2:air-21:wall:air-e:wall-14:air-8:wall-8:air-e:wall-2:air-1a:wall:air-15:wall-2:air-1a:wall:air-15:wall-2:air-1a:wall:air-15:wall-2:air-18:wall:air:wall:air-15:wall-2:air-f:goal:air-a:wall:air-15:wall-2:air-1a:wall:air-15:wall-2:air-1a:wall:air-e:wall:air-6:wall-2:air-1a:wall:air-15:wall-2:air-1a:wall:air-15:wall-51:;9c4:;33:8:1:18:11:21:11:6:1:1a:11:21:11:7:1:19:11:21:19:19:27:b:d9:8:1a:e:2:8:1a:e:2:3:1:4:1a:e:2:8:1a:e:2:8:1a:e:2:8:1a:e:2:8:1b:d:3d:13:1f:13:1f:13:51:13:1f:13:20:12:20:12:1f:13:1f:6:1:c:48:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:43:11:11:e:2:11:11:e:2:11:11:e:2:11:11:e:2:f:1:1:11:e:2:11:11:e:2:11:11:7:1:6:2:11:11:e:2:11:11:e:33:;8b8:1:10b:',
                backgroundColor: '#ffffff',
                inventory: {
                    piston_left: 3,
                    piston_up: 1,
                    piston_right: 4,
                    rotator_left: 2,
                    rotator_right: 4,
                    rotator_down: 5,
                    rotator_clockwise: 4,
                    rotator_counterclockwise: 2,
                    slider_horizontal: 5,
                    slider_vertical: 2
                },
                difficulty: 'Medium',
                id: 'eec8026b-0182-47e2-a9aa-5803deaa757e'
            },
            {
                name: 'Breaking Thermodynamics',
                description: `Instead of breaking the game, in this puzzle you'll be <h>breaking the laws of thermodynamics!</h> The pixels with blue and yellow arrows are <h>copiers</h>, and they... copy. These pixels here are special copiers called <h>cloners</h>; they are like copiers, but they can <h>push pixels</h> to make space for the mass it creates in violation of the laws of thermodynamics.<br><br><h><i>Some pixels are not cloneable, for example, goal pixels.</i></h>`,
                saveCode: '&1;32-32;0000;wall-21:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:air-1e:wall-2:monster-4:air-c:monster-5:air-9:wall-2:monster-4:air-c:monster-5:air-9:wall-22:air-14:wall:air-9:wall-2:air-14:wall:air-9:wall-2:air-14:wall:air-9:wall-2:air-14:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-a:wall:air-9:wall:air-9:wall-2:air-2:monster-2:air-6:wall:air-13:wall-2:air-2:monster-4:air-4:wall:air-13:wall-2:air-2:monster-4:air-4:wall:air-13:wall-2:air:monster-5:air-4:wall:air-13:wall-2:air:monster-6:air-3:wall:air-13:wall-33:;400:;88:2:1e:2:10c:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:21:;400:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 3,
                    push_cloner_left: 6,
                    push_cloner_up: 2,
                    push_cloner_right: 1,
                    push_cloner_down: 3,
                    slider_horizontal: 3
                },
                difficulty: 'Medium',
                id: '388f65f4-65d6-4427-9342-861b0eefb47b'
            },
            {
                name: 'Target Practice',
                description: `Hmmm, you have <h>multiple goals</h> to deliver now, but they all have to be moved at the same time? <i>This one's a tricky one, I'll give you that.</i>`,
                saveCode: '40;0000;wall-41:air-38:wall-2:air-38:wall-2:air-38:wall-2:air-38:wall-2:air-38:wall-14:air-26:wall-2:sand-4:air-7:wall:air-26:wall-2:sand-6:air-5:wall:air-26:wall-2:piston_right:sand-6:air-4:wall:air-26:wall-10:air-3:wall:air-26:wall-2:air-4:wood:air-2:wood:air-3:wall:air-26:wall-2:air-4:wood:lava-2:wood:air-3:wall:air-26:wall-2:air-5:wood-2:air-4:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:air-11:wall:air-26:wall-2:wood:air-4:wood:air-5:wall:air-26:wall-2:wood:gunpowder-4:wood:air-5:wall:air-26:wall-2:wood:gunpowder-4:wood:air-5:wall:air-26:wall-2:wood:gunpowder-4:wood:air-5:wall:air-26:wall-2:wood-6:air-5:wall:air-26:wall-22:air-18:wall-2:air-38:wall-2:air-38:wall-2:air-8:goal:air-23:wall:air-5:wall-2:air-8:goal:air-23:wall:water-5:wall-2:air-8:goal:air-23:wall:water-5:wall-2:air-32:wall:water-5:wall-2:air-32:wall:water-5:wall-2:air-32:wall:water-5:wall-2:air-32:wall:water-5:wall-41:;640:;3e:11:17:11:17:11:17:11:17:11:17:11:17:11:372:12:16:12:16:8:1:9:16:8:1:9:16:8:1:9:16:12:16:12:16:12:16:12:3d:;399:1:cf:2:1d5:;2d:1:293:1:254:1:129:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 8,
                    push_cloner_left: 1,
                    piston_up: 3,
                    piston_right: 4,
                    slider_horizontal: 4
                },
                difficulty: 'Easy',
                id: '47fa079a-cc83-4435-bba4-bc0288c3b60c'
            },
            {
                name: 'Green Lasers',
                description: `Green lasers are bad for your health, and they're especially bad for pixels. Luckily, you have <h>laser scatterers, which scatters the laser beam into harmless green light</h>. Give it a try.`,
                saveCode: '25;0000;wall-26:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-3:laser_down-3:air-11:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-9:wood-8:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-20:air-5:wall-2:air-23:wall-2:air-23:wall-2:air-23:wall-2:air-3:goal:air-19:wall-2:air-23:wall-2:air-23:wall-2:air-23:wall-8:laser_up-4:wall-14:;271:;1a:11:8:11:8:11:8:3:3:b:8:11:8:11:8:11:8:11:8:11:8:11:8:a:1:4:1:1:8:9:10:a:6:1:8:a:6:1:8:a:6:1:21:6:13:6:13:6:13:3:1:2:13:6:13:6:13:6:2b:;16b:2:17:3:ea:;110:1:160:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 1,
                    piston_up: 1,
                    piston_right: 8,
                    slider_horizontal: 2,
                    laser_scatterer: 3
                },
                difficulty: 'Easy',
                id: '592a78ca-5f9e-4845-a6db-37a16e37a2b9'
            },
            {
                name: 'Placement Test',
                description: `You have very limited options in terms of placement locations here. <h>Choose carefully!</h>`,
                saveCode: '40-40;0000;wall-41:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-11:wall-15:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-6:wall:air-24:wall-2:air-6:wall:air-24:wall:air-6:wall-2:air-6:wall:air-24:wall:air-6:wall-2:air-6:wall:air-24:wall:air-6:wall-2:air-6:wall-8:air:goal:air-15:wall:air:goal:air-4:wall-2:air-31:wall:air-6:wall-2:air-28:wall-4:air-6:wall-2:air-18:wall:air-3:wall:air-15:wall-2:air-22:wall:air-15:wall-2:air-21:laser_right:wall:air-15:wall-2:air-22:wall:air-15:wall-2:air-22:wall:air-15:wall-2:air:wall:air-10:goal:air-9:wall:air-15:wall-2:air:wall:air-20:wall:air-15:wall-15:air-9:wall:air-15:wall-2:air-2:concrete:air:concrete:air-7:wood:air-9:wall:air-15:wall-2:air-12:wood:air-9:wall:air-15:wall-2:air-12:wood:air-9:wall:air-15:wall-2:air-12:wood:air-9:wall:air-15:wall-2:air-7:wall-7:gunpowder:air-7:wall:air:goal:air-13:wall-2:air-13:wall:air-8:wall:air-15:wall-2:air-13:wall:air-8:wall-9:air-7:wall-2:air-8:goal:air-4:wall:air-24:wall-2:air-13:wall:air-24:wall-2:air-10:wall:air-2:wall:air-24:wall-2:air-10:wall:air-2:wall:air-24:wall-2:air-10:wall:air-2:wall:air-24:wall-2:air-10:wall:air-2:wall:air-24:wall-2:air-10:wall:air-2:wall:air-24:wall-41:;640:;29:2:13:1:12:2:13:1:c2:1:4:1:d:2:3c:3:22:1:21:1:6:2:4:1:1a:1:27:1:7:1:2e:1:1f:1:31:1:a:2:26:2:7b:2:1e:1:6:1:21:1:5:1:11:1:f:1:17:1:27:1:17:2:e:2:26:1:2a:1:21:1:7:1:8:1:15:1:28:1:18:1:1:1:c:1:3:1:16:1:1b:1:c:1:19:1:1:1:13:1:28:1:62:1:2f:;c3:1:ec:1:2b9:1:19c:1:38:;149:1:34:1:1df:1:14:1:1ac:1:11f:',
                backgroundColor: '#ffffff',
                inventory: {
                    wall: 1,
                    dirt: 2,
                    concrete: 3,
                    push_cloner_left: 2,
                    push_cloner_up: 3,
                    push_cloner_right: 1,
                    push_cloner_down: 1,
                    piston_left: 7,
                    piston_up: 6,
                    piston_right: 6,
                    piston_down: 6,
                    rotator_left: 2,
                    rotator_up: 3,
                    rotator_down: 1,
                    rotator_clockwise: 1,
                    rotator_counterclockwise: 1,
                    slider_horizontal: 7,
                    slider_vertical: 8
                },
                difficulty: 'Hard',
                id: 'b5c42f2a-fae1-4795-a77f-a4c4a15bc538'
            },
            {
                name: 'Reflection',
                description: `Ah, a simple puzzle. Makes for a nice break from the brain-breaking machines. Anyways, those diagonal thingies are <h>mirrors</h>. <h>Mirrors reflect lasers</h>, so you can use this to redirect them to your targets. More interesting is that you have even numbers of everything (except mirrors).<br><br>Alright, I'm off to work on the PixSim API and think about the faults of society. And maybe make some music too.`,
                saveCode: '40;0000;wall-41:concrete:wall:air-36:wall-2:laser_right:glass:air-28:mirror_2:air-7:wall-2:concrete:wall:air-36:wall-2:rotator_counterclockwise:wall:air-3:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-8:wall-2:rotator_counterclockwise:wall:air-3:wood:gunpowder-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:gunpowder-2:wood:air-8:wall-2:concrete:wall:air-3:wood:gunpowder-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air-2:wood:air:wall:wood:gunpowder-2:wood:air-8:wall-42:air-3:wall:air-28:slider_vertical:air-5:wall-2:air-3:wall:air-28:slider_vertical:air-5:wall-2:air-3:wall:air-28:slider_vertical:air-5:wall-2:air-3:glass:air-28:slider_vertical:air-5:wall-2:air-3:glass:air-28:slider_vertical:air-5:wall-6:air-26:wall-5:air-3:wall-2:mirror_1:air-2:glass:air-26:glass:laser_left:laser_right:glass:mirror_2:air-3:wall-2:air-3:wall:air-26:wall-4:glass:air-3:wall-2:air-3:wall:air-34:wall-2:air-3:wall:air-34:wall-2:air-3:wall:air-34:wall-2:air-3:wall:air-34:wall-2:air-3:wall:air-34:wall-2:mirror_2:air-2:glass:air-4:mirror_2:air-16:mirror_2:air-12:wall-2:air-3:wall:air-7:collapsible:air-26:wall-2:air-3:wall:air-7:wall:air-26:wall-2:air-3:wall:air-2:mirror_1:air:mirror_1:air-2:wall:air-26:wall-2:air-3:wall:air-7:wall:air-26:wall-8:glass:wall-18:air-13:wall-2:air-3:glass:air-5:wall:air-14:wall:air-13:wall-2:wood:sand:wood:glass:air-5:wall:air-14:wall:air-13:wall-2:air:wood:air:glass:air-2:mirror_1:air-2:wall:air-14:wall:air-13:wall-2:air-3:glass:air-5:wall:air-14:wall:air-7:laser_scatterer:glass-3:air-2:wall-2:air-3:glass:air-5:wall:air-14:wall:air-13:wall-2:air-3:wall:air-5:wall:air-14:wall:air-13:wall-2:air-3:wall:air-5:wall:air-2:dirt-6:air-6:wall:air-13:wall-2:air-3:wall:air-5:wall:dirt-11:air-3:wall:air-13:wall-2:air-3:wall:air-5:wall:dirt-11:air-3:glass:air-13:wall-3:push_cloner_down:wall-2:air-5:wall:dirt-12:air-2:glass:air-7:mirror_1:air-5:wall-2:air:piston_right:wall-2:air-5:wall:dirt-13:air:wall:air-3:wood:gunpowder-7:wood:air:wall-2:air-9:wall:dirt-14:wall:air-3:wood:gunpowder-7:wood:air:wall-41:;640:;48:7:21:7:21:7:21:7:21:7:21:7:2e:1c:1:5:6:1c:1:5:6:1c:1:5:6:1c:1:5:6:1c:1:5:6:1a:5:3:6:1a:5:3:6:1a:5:3:6:22:6:22:6:22:6:22:6:22:6:4:1:10:1:c:6:7:1:1a:6:7:1:1a:6:2:1:1:1:2:1:1a:6:7:1:1a:1b:d:1b:d:1b:d:1b:d:1b:7:4:2:1b:d:1b:d:1b:d:f1:;ae:1:26:2:7:2:1b:1:1:2:1:2:2:1:1:2:1:2:d7:1:32b:1:1:1:1:1:28:1:ba:1:49:;640:',
                backgroundColor: '#ffffff',
                inventory: {
                    piston_left: 2,
                    piston_right: 2,
                    piston_down: 2,
                    rotator_clockwise: 2,
                    rotator_counterclockwise: 4,
                    slider_horizontal: 2,
                    slider_vertical: 2,
                    glass: 8,
                    mirror_1: 1,
                    mirror_2: 1
                },
                difficulty: 'Easy',
                id: '549382d2-999f-41dd-a945-1afb4f3047d6'
            },
            {
                name: 'Chaos',
                description: `Oh wow, that's a lot of stuff. You've got <h>copiers</h> now, too. Well... good luck, this one took me a while to figure out. It's a messy one.`,
                saveCode: '20;0000;wall-2:air:wall-17:piston_right-2:slider_vertical:air-16:wall-2:air-2:wall-17:air-13:piston_down:air-5:wall-2:air:piston_up:air-16:wall-2:air-18:wall:air-11:wall:air-7:wall:air-19:wall:air-19:wall:air:rotator_up:air:cloner_left:air-10:sand-5:wall-2:concrete-7:air-4:sand-7:wall-2:air-2:wall-2:air-6:sand-8:wall-4:air-7:concrete-9:wall-2:air-12:wall-2:air-4:wall-2:air-10:rotator_up:air-3:wall-2:air-2:wall-2:air-2:goal:air:wall:air-11:wall-4:air-2:push_cloner_up:air:wall:air-8:goal:air-4:wall-2:air-4:wall:air-13:wall-2:air-4:wall:air-13:wall-21:;190:;17:10:2:2:11:d:1:5:2:1:1:10:2:12:1:b:1:7:1:8:c:8:5d:c:8:a:1:3:6:2:1:1:1:b:4:2:1:1:1:8:1:4:2:4:1:d:2:4:1:d:15:;b8:1:d7:;26:1:c2:1:a6:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 4,
                    cloner_left: 2,
                    piston_left: 1,
                    piston_up: 2,
                    piston_right: 2,
                    rotator_left: 1,
                    rotator_up: 1,
                    rotator_right: 1,
                    rotator_down: 2,
                    rotator_clockwise: 3,
                    rotator_counterclockwise: 1,
                    slider_horizontal: 8
                },
                difficulty: 'Hard',
                id: '091325da-7cb3-4b75-95e5-897d3540cbc7'
            },
            {
                name: 'Danger Zone',
                description: `Careful! Those purple glowy thingies are <h>deleters</h>- They delete stuff! One wrong move and everything is gone. Well, you can always <h>reset if that happens</h>.<br>The orange-ish boxes with a diagonal are <h>collapsible boxes, they can be crushed when pushed into something</h>.`,
                saveCode: '&1;40-40;0000;wall:deleter-a:wall-b:deleter-11:wall:slider_horizontal:air-14:deleter:air-11:deleter:wall:air-14:deleter:air-11:deleter:wall:air-14:wood:air-11:deleter:wall:air-14:wood:air-5:concrete:air-6:slider_horizontal:air-4:deleter:wall:air-14:wood:air-11:deleter:wall:air-14:wood:air-11:deleter:wall:air-14:wood:air-4:slider_vertical:air-6:slider_horizontal:air-5:deleter:wall:air-14:deleter:air-11:deleter:wall:air-14:deleter:air-11:deleter:wall:air-a:wall-3:air-5:wall-3:deleter-b:air:deleter-5:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-8:concrete:goal:wall:air-9:wall:air-11:wall-2:air-9:concrete:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-5:slider_horizontal-3:air-2:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-9:sand:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-9:wall:air-11:wall-2:air-a:wall:air-4:monster:air-4:wall:air-11:wall-2:air-a:wall:concrete:air-2:monster-3:air-2:concrete:wall:air-11:wall-2:piston_right:air-9:wall:concrete-2:air:monster-4:concrete-2:wall:air-11:wall-2:air-a:wall:concrete-3:monster-3:concrete-3:wall:air-11:wall-2:air-a:wall-29:;640:;3e:11:17:11:17:11:17:5:1:6:1:4:17:11:17:11:17:4:1:6:1:5:17:11:17:11:52:a:1e:a:1e:a:1e:a:1e:a:1e:a:1e:a:1e:a:1e:a:1e:8:20:9:1f:a:1e:a:1e:a:1e:5:3:2:1e:a:1e:a:1e:a:1e:9:1f:a:1e:a:1e:a:1e:a:1e:a:1e:a:1f:9:1e:a:1e:a:1d:;521:1:11e:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 37,
                    cloner_right: 7,
                    push_cloner_up: 1,
                    piston_up: 17,
                    piston_right: 1,
                    rotator_left: 6,
                    rotator_down: 4,
                    rotator_clockwise: 1,
                    rotator_counterclockwise: 5,
                    slider_horizontal: 3,
                    slider_vertical: 7,
                    collapsible: 6
                },
                difficulty: 'Literally impossible (its borked lol)',
                id: '4dc2f242-0cf3-465c-b265-25c7ed2b06c2'
            },
            {
                name: 'Pushy Pistons',
                description: `Wasn't this the original name for the first level?<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;25-25;0000;wall-1a:air-c:wood:air-2:wall:air:push_piston_down:push_piston_left:air-4:wall-2:air-c:wood:air:monster:deleter:concrete:slider_horizontal:air-5:wall-2:air-d:wood-2:wall:concrete:reinforced_glass-6:wall-2:air-17:wall-2:air-2:crate:air-14:wall-2:air-2:crate-2:air-13:wall-2:air-2:crate-4:air-3:glass-3:wall:air-a:wall-2:air:crate-5:air-6:wall:air-a:wall-2:grass:dirt-3:grass-2:air-6:wall:air-a:wall-2:dirt-5:grass-2:air-5:wall:air-a:wall-b:air-3:wall:air-a:wall-2:air:wood:air-3:wood:air-2:wall:air-3:wall:air-a:wall-2:air:wood:monster:air:monster:wood:air-2:wall:air-3:wall:air-a:wall-2:air-2:wood-3:air-3:wall:air-3:wall:air-a:wall-2:air-8:wall:air-3:wall:air-a:wall-2:air-8:wall:air-3:wall:air-a:wall-2:air-8:wall:air-3:wall:air-a:wall-2:air-8:wall:monster:air-2:wall:lava-3:wall:air-6:wall-2:air-8:wall:crate-2:air:wall:lava-3:wall:air-2:wood:air-3:wall-2:air-8:wall:water-3:wall:lava-3:wall:air:wood-5:wall-2:air-8:wall:water-3:wall:steel-3:wall:air-2:wood:water-3:wall-2:air-8:wall:water-3:wall:air-3:wall:air-2:wood:water-3:wall-2:air-3:piston_up:air-2:piston_up:air:wall:water-3:wall:air-3:wall:air-2:wood:water-3:wall-26:;271:;2d:4:14:5:1b:9:10:2:1:6:10:2:2:5:10:2:4:3:10:1:5:3:16:3:17:2:8d:8:11:8:11:8:11:8:11:8:11:8:1e:3:16:3:21:;271:',
                backgroundColor: '#ffffff',
                inventory: {
                    push_piston_left: 3,
                    push_piston_up: 2,
                    push_piston_right: 3
                },
                difficulty: 'Easy',
                id: 'c94ee67e-18a6-4680-87cb-570878654a3f'
            },
            {
                name: 'Sticky Slime',
                description: `Well, I guess we have <h>slime</h> now...<br>Buh. This looks impossible. Oh well, good luck lol<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;50-50;0000;wall-33:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-20:steel_crate:air-f:wall-2:air-a:wall-17:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:concrete-5:air-a:wall-2:air-20:wall:air-2:concrete:air-9:monster:air-2:wall-2:air-20:wall:air:concrete:air-7:concrete-6:wall-2:air-20:wall:concrete:air-a:concrete:air-3:wall-2:air-20:wall:air-c:concrete:air-2:wall-2:air-20:wall:air-d:concrete:air:wall-2:air-20:wall:air-e:concrete:wall-2:air-20:wall:air-f:wall-2:air-5:wood:air-5:wood:air-14:wall:air-8:crate:air-6:wall-2:air-4:wood-9:air-2:stone_bricks:air:stone_bricks:air:stone_bricks:air-c:wall:air-6:crate-3:air-6:wall-2:air-5:wood:air-5:wood:air-3:stone_bricks-5:air-c:wall:air-5:slider_horizontal-5:air-5:wall-2:grass-2:air-3:wood:air-2:monster:air-2:wood:air-4:stone_bricks-3:air-d:wall:air-5:fan_down:air-3:fan_down:air-5:wall-2:dirt-2:grass-3:wood:air:monster-2:air-2:wood:grass-4:stone_bricks-3:air-d:wall:air-f:wall-2:dirt-5:wood:monster-4:air:wood:dirt-4:stone_bricks-3:air-d:wall:air-f:wall-15:air-d:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-8:air-1a:wall:air-f:wall-2:goal:air-1f:wall:air-f:wall-8:air-1a:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-2:air-20:wall:air-f:wall-51:;9c4:;33:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:25:d:40d:13:1f:13:1f:13:1f:13:1f:13:25:d:25:d:25:d:1f:13:1f:13:1f:13:1f:13:1f:13:50:;85d:1:166:',
                backgroundColor: '#ffffff',
                inventory: {
                    water: 5,
                    lava: 1,
                    concrete: 50,
                    piston_left: 4,
                    piston_up: 4,
                    piston_right: 4,
                    piston_down: 4,
                    sticky_piston_left: 3,
                    sticky_piston_up: 2,
                    sticky_piston_right: 3,
                    sticky_piston_down: 2,
                    push_cloner_right: 1,
                    rotator_left: 5,
                    rotator_up: 5,
                    rotator_right: 5,
                    rotator_down: 5,
                    rotator_clockwise: 3,
                    rotator_counterclockwise: 3,
                    slider_horizontal: 4,
                    slider_vertical: 8,
                    collapsible: 7,
                    slime: 50,
                    detonator: 1,
                    c4: 10
                },
                difficulty: 'Hard',
                id: 'bd3db856-6431-4f0b-9af5-f34c86d22e38'
            },
            {
                name: 'Puzzle Deactivated',
                description: '410: Gone<br>The requested level has been permanently removed. Do not reattempt the request.<br><br>Wait why are there fish tanks??<br><br><i>Level credit: sp</i>',
                saveCode: '&1;40-40;0000;wall-2:deleter-24:rotator_left:wall-2:monster:air-25:deleter:wall-16:fan_up:wall-c:fan_up:wall-2:air:deleter:wall:water-c:wall-8:air-2:wall:piston_right:slider_horizontal:rotator_clockwise:steel:air-6:slider_horizontal:deactivator:air:wall:air:deleter:wall:water-2:push_piston_left:cloner_right:water-8:wall-5:slime-2:unslime:deactivator:air:wall-b:air:wall-3:air:deleter:wall:water-6:rotator_left:push_piston_right:water-4:wall-5:slime:air:wall:push_piston_up:wall-2:air-7:wall:air-5:wall:air:deleter:wall:reinforced_glass-c:wall-2:rotator_down:wall-2:slime:air:wall-4:air-7:wall:air-5:wall:air:deleter:air-e:slider_horizontal:deactivator:air-2:slime:air:wall-4:air-7:wall:air-5:wall:air:deleter:wall:air-d:wall-a:air-7:wall:air-5:wall:air:deleter:wall:air-16:wall:air-d:wall:air:deleter:wall:air-16:wall:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-7:wall-3:air:wall-3:air:deleter:wall:air-16:reinforced_glass:air-7:wall:air:cloner_up:air:wall-3:air:deleter:wall:air-16:reinforced_glass:air-7:wall:cloner_left:rotator_clockwise:wall:deactivator:air:fan_right:air:deleter:wall:air-11:goal:air-4:wall:air-7:wall:air:push_cloner_up:goal:slime:air:wall:air:deleter:wall:air-16:wall-a:rotator_left:wall-4:air:deleter:wall:air-16:wall:air-7:wall:air-5:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-d:wall:air:deleter:wall:air-16:reinforced_glass:air-7:wall:air-5:wall:air:deleter:wall:air-16:reinforced_glass:air-7:wall:ice-5:wall:air:deleter:wall:air-16:wall:air-7:wall:ice-5:wall:air:deleter:wall:air-16:wall-f:air:deleter:wall:air-21:steel:slime:air:wall:air:deleter:wall:air-21:steel:slime:air:wall:air:deleter:wall:air-21:steel:slime:air:wall:air:deleter:wall:air-4:slime:air-2:slime:air-9:slime:air-3:slime-3:air-9:steel:slime:air:wall:air:deleter:wall-5:slime:wall-2:slime:air:wall-2:reinforced_glass-5:wall:slime:wall-3:air:slime:wall-4:reinforced_glass-6:wall:slime:air:wall:air:deleter:wall-4:deactivator:slime:wall:slime-3:air:wall:water-5:wall:slime:deactivator:wall:air:slime-3:wall:life-2:cloner_right:push_cloner_right:water-4:wall:deactivator:air:fan_right:air:deleter:wall-4:air-2:wall-2:deactivator:air:wall-2:water-2:sticky_piston_left:slime:water:wall:air-2:push_piston_right:air:deactivator:wall-3:life-2:water-6:wall-4:air:deleter:wall-4:fan_down:wall-3:fan_down-2:wall-b:fan_down:wall-10:air:deleter:wall:piston_right:air-25:rotator_up:wall-2:deleter-25:wall:;640:;e0:7:21:7:9:e:a:7:a:d:a:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:11:1:4:1:7:a:16:12:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:1:7:a:16:16:2:189:;127:1:1cb:1:34c:',
                backgroundColor: '#fffffe',
                inventory: {
                    concrete: 50,
                    glass: 2,
                    reinforced_glass: 4,
                    piston_left: 2,
                    piston_up: 2,
                    piston_right: 2,
                    piston_down: 2,
                    sticky_piston_left: 2,
                    sticky_piston_up: 4,
                    sticky_piston_right: 4,
                    sticky_piston_down: 2,
                    push_piston_left: 1,
                    push_piston_up: 2,
                    push_piston_right: 1,
                    push_piston_down: 1,
                    cloner_left: 2,
                    cloner_right: 2,
                    push_cloner_left: 2,
                    push_cloner_up: 2,
                    push_cloner_right: 2,
                    push_cloner_down: 2,
                    rotator_left: 6,
                    rotator_up: 4,
                    rotator_right: 6,
                    rotator_down: 4,
                    rotator_clockwise: 4,
                    slider_horizontal: 4,
                    slider_vertical: 8,
                    deactivator: 1,
                    collapsible: 10,
                    slime: 18
                },
                difficulty: 'Hard',
                id: 'ed84626a-5924-4134-b1ff-940f8ae70bee'
            },
            {
                name: 'Chaos 2: Electric Boogaloo (Déjà vu?)',
                description: `Oh no, not this one again! It's like that other one but even worse! And there's clay blocking the final tunnel! Well, those <h>sticky pushers</i> will probably come in handy.<br><br><i>Level credit: sp</i>`,
                saveCode: '&1;20-20;0000;rotator_right-2:air:deleter-4:wall-d:sticky_piston_right:piston_right:slider_vertical:air-7:clay:air-8:wall:deleter:air-6:wall-e:air:slider_horizontal:air-10:wall-2:air-5:collapsible:air-c:wall-2:air:piston_up:air-2:goal:slider_vertical:air-c:wall-2:air-3:bricks-3:air-9:steel_crate:air-2:wall-2:water-3:bricks:monster:bricks:air-9:steel_crate-2:goal:wall-2:water-3:bricks-3:air-7:push_cloner_left:steel_crate-4:wall-2:concrete-5:air-4:rotator_left:air-3:concrete-5:wall-2:air-2:concrete:air-c:concrete:air-2:wall-2:air:concrete:air-e:concrete:air:wall-2:concrete:air-10:concrete:wall-2:air-4:mirror_2:air-d:wall-2:air-4:mirror_2-2:air-c:wall-2:air:monster:air-e:goal:air:wall-2:monster:glass:monster:air-3:goal:air:collapsible:rotator_left:air-8:wall-2:bricks-3:air-f:wall-2:bricks:air:bricks:air:reinforced_glass-2:air-c:wall-6:laser_up-2:wall-13:;190:;17:5:d:6:e:1:1:d:5:5:1:9:5:1:1:2:2:9:5:3:3:9:b:9:b:6:e:3:1:2:e:6:e:6:e:6:e:6:e:6:e:6:f:1:2:2:e:6:e:6:1b:;26:1:4d:1:68:1:64:1:4d:;190:',
                backgroundColor: '#ffffff',
                inventory: {
                    concrete: 4,
                    glass: 4,
                    reinforced_glass: 4,
                    piston_left: 4,
                    piston_right: 4,
                    sticky_piston_left: 4,
                    sticky_piston_up: 4,
                    sticky_piston_right: 4,
                    sticky_piston_down: 4,
                    push_piston_right: 4,
                    cloner_down: 4,
                    rotator_left: 4,
                    rotator_up: 4,
                    rotator_right: 4,
                    rotator_down: 4,
                    slider_horizontal: 4,
                    slider_vertical: 4,
                    collapsible: 4,
                    slime: 4
                },
                difficulty: 'Very Hard',
                id: 'c86adee3-5653-4ed9-ad28-ced12e02751b'
            },
            // something
        ]
    }
];

let currentPuzzleSection = 0;
let currentPuzzleLevel = 0;
let currentPuzzleId = 0;
let currentPuzzleCompleted = false;
const winScreen = document.getElementById('winScreen');
const winBox = document.getElementById('winBox');
const winTicksText = document.getElementById('winTicks');
const winReset = document.getElementById('winReset');
const winNext = document.getElementById('winNext');
const winMenu = document.getElementById('winMenu');
winScreen.addEventListener('contextmenu', e => e.preventDefault());
let inWinScreen = false;
function triggerWin() {
    if (inWinScreen) return;
    inWinScreen = true;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    stopAllMusicPixels();
    currentPuzzleCompleted = true;
    window.localStorage.setItem(`challenge-${currentPuzzleId}`, LZString.compressToBase64(JSON.stringify({
        code: saveCode,
        pixels: getPixelAmounts(),
        completed: true
    })));
    sounds.win();
    document.getElementById(`puzzleButton-${currentPuzzleId}`).classList.add('levelButtonCompleted');
    winTicksText.innerText = ticks + ' Ticks';
    winScreen.style.opacity = '1';
    winScreen.style.pointerEvents = 'all';
    winBox.style.transform = 'translateY(-50%)';
    function keyHandle(e) {
        if (e.key == 'Enter' && winNext.onclick) winNext.onclick();
        else if (e.key == 'Escape') winReset.onclick();
    };
    const hide = () => {
        winScreen.style.opacity = '';
        winScreen.style.pointerEvents = '';
        winBox.style.transform = '';
        winReset.onclick = null;
        winNext.onclick = null;
        winMenu.onclick = null;
        document.removeEventListener('keydown', keyHandle);
        inWinScreen = false;
    };
    if (puzzles[currentPuzzleSection].levels[currentPuzzleLevel + 1]) {
        winNext.onclick = () => {
            hide();
            transitionWithinGame(() => {
                loadPuzzle(currentPuzzleSection, currentPuzzleLevel + 1);
            });
        };
        winNext.style.display = '';
    } else {
        winNext.style.display = 'none';
    }
    winReset.onclick = (e) => {
        hide();
        loadSaveCode(saveCodeText.value.replace('\n', ''));
        camera.shakeIntensity = 0;
        inResetState = true;
    };
    winMenu.onclick = (e) => {
        hide();
        transitionToMenu(puzzleButton.onclick);
    };
    document.addEventListener('keydown', keyHandle);
};

const levelDetails = document.getElementById('levelDetails');
const levelName = document.getElementById('levelName');
const levelDescription = document.getElementById('levelDescription');
function loadPuzzle(section, level) {
    try {
        currentPuzzleSection = parseInt(section);
        currentPuzzleLevel = parseInt(level);
        const puzzle = puzzles[section].levels[level];
        currentPuzzleId = puzzle.id;
        glitchTextTransition('', `${parseInt(section) + 1}-${parseInt(level) + 1} ${puzzle.name}`, (text) => {
            levelName.innerText = text;
        }, 100);
        levelDescription.innerHTML = `${puzzle.description}<br><br><i>Difficulty: ${puzzle.difficulty}</i>`;
        saveCode = puzzle.saveCode;
        let savedData = window.localStorage.getItem(`challenge-${currentPuzzleId}`);
        if (savedData !== null) try { savedData = JSON.parse(savedData); } catch { savedData = JSON.parse(LZString.decompressFromBase64(savedData)); }
        if (savedData !== null) saveCode = savedData.code;
        saveCodeText.value = saveCode;
        loadSaveCode();
        backgroundColor = puzzle.backgroundColor;
        simulationPaused = true;
        fastSimulation = false;
        updateTimeControlButtons();
        inResetState = true;
        resetPixelAmounts(false);
        if (savedData !== null) {
            let isFirst = true;
            for (let pixelType in savedData.pixels) {
                if (isFirst) {
                    pixelSelectors[pixelType].box.onclick();
                    isFirst = false;
                }
                if (puzzle.inventory[pixelType] !== undefined || (savedData.pixels[pixelType] != 0 && pixelType != 'air')) {
                    pixelAmounts[pixelType] = savedData.pixels[pixelType];
                    updatePixelAmount(pixelType, pixelAmounts, false, true);
                }
            }
            currentPuzzleCompleted = savedData.completed ?? false;
        } else {
            let isFirst = true;
            for (let pixelType in puzzle.inventory) {
                if (isFirst) {
                    pixelSelectors[pixelType].box.onclick();
                    isFirst = false;
                }
                pixelAmounts[pixelType] = puzzle.inventory[pixelType];
                updatePixelAmount(pixelType, pixelAmounts, false, true);
            }
            currentPuzzleCompleted = false;
        }
        pixelAmounts['air'] = Infinity;
        updatePixelAmount('air', pixelAmounts, false, false);
        camera.shakeIntensity = 0;
        camera.scale = 1;
        camera.x = 0;
        camera.y = 0;
        drawScale = gridScale * camera.scale;
        screenScale = (gridWidth < gridHeight ? gridWidth : gridHeight) / canvasSize / camera.scale / canvasScale;
    } catch (err) {
        modal('Could not load puzzle:', `<span style="color: red;">${err.message}</span><br>Restart the puzzle if issues persist.`, false).then(transitionToMenu);
    }
};

window.addEventListener('DOMContentLoaded', (e) => {
    let puzzleIndex = 0;
    for (let section in puzzles) {
        const block = document.createElement('div');
        block.classList.add('levelGroup');
        const title = document.createElement('h1');
        title.innerText = `${++puzzleIndex} - ${puzzles[section].name}`;
        block.appendChild(title);
        let col = 0;
        for (let level in puzzles[section].levels) {
            const puzzle = puzzles[section].levels[level];
            let savedData = window.localStorage.getItem(`challenge-${puzzle.id}`);
            if (savedData) try { savedData = JSON.parse(savedData); } catch { savedData = JSON.parse(LZString.decompressFromBase64(savedData)); };
            const button = document.createElement('button');
            button.id = `puzzleButton-${puzzle.id}`;
            button.classList.add('levelButton');
            if (savedData && savedData.completed) button.classList.add('levelButtonCompleted');
            button.innerText = parseInt(level) + 1;
            button.title = puzzle.name;
            button.onclick = (e) => {
                sandboxMode = false;
                loadPuzzle(section, level);
                selectPuzzle();
            };
            block.appendChild(button);
            col++;
            if (col == 5) {
                block.appendChild(document.createElement('br'));
                col = 0;
            }
        }
        levelSelectBody.appendChild(block);
    }
    let i = 0;
    let key = window.localStorage.key(i);
    while (key != null) {
        if (key.startsWith('challenge-')) {
            let exists = false;
            let searchId = key.replace('challenge-', '');
            search: for (let section of puzzles) {
                for (let level of section.levels) {
                    if (level.id == searchId) {
                        exists = true;
                        break search;
                    }
                }
            }
            if (!exists) {
                window.localStorage.removeItem(key);
            }
        }
        i++;
        key = window.localStorage.key(i);
    }
});