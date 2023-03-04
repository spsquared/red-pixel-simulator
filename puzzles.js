const puzzles = [
    // not using json for reasons unknown to mankind
    {
        name: 'World of Squares',
        levels: [
            {
                name: 'A Grid of Numbers',
                description: `Welcome to <h style="color: red;">Red Pixel Simulator</h>!<br>&emsp;<h style="color: red;">Red Pixel Simulator</h> is a sandbox-puzzle game based solely on interactions between some numbers in a grid. (Almost) everything is completely deterministic based on simple interactions between pixels. For the purposes of the puzzles, your goal is to <h>defeat all the monsters</h> (the green things with faces) by destroying them using other pixels and to <h>move the goal pixels</h> <h>to the targets</h>.<br>&emsp;On the left of your screen is the <h>grid</h>. On the right is the <h>sidebar</h>, which contains all of the game controls. At the top, there is the <h>Pixel Picker</h>. Here you can see what and how many pixels you can place and select them by clicking on them. Below that, there are controls for your brush size (up and down) and simulation control; you can <h>pause</h>, <h>warp</h>, and <h>step</h> the simulation. You can also turn on <h>slowmode</h>, which is useful in puzzles where things move so fast you can't see them.<br>&emsp;In sandbox mode, the text box allows you to transfer and edit save codes. Below that the small buttons are a few settings, they're pretty self-explainatory.<br><h>At the bottom you can find all the controls available.</h><br><h>Let's get started! Go down and press the <b>run</b> button (it looks like a play button) to begin.</h>`,
                saveCode: '20;0000;air-259:sand:air-19:grass:air-19:grass:water-12:mud:grass-6:dirt:water-8:mud-4:dirt-8:mud-2:water-3:mud-3:dirt-14:mud-3:dirt-35:;190:;190:;12a:1:65:',
                inventory: {
                    air: 0
                },
                id: '212c7cd9-1ea3-4d1e-a2a8-6a287b06b1a5'
            },
            {
                name: 'Gravity',
                description: `Although everything is, at its core, a grid of numbers, gravity still applies. Pixels like <h>dirt</h>, <h>sand</h>, <h>water</h>, and many more will fall downwards when given the chance to. Some are more flowy than others. <h>Water</h> is... watery, and flows until it can't find a lower spot. Pixels like <h>dirt</h> and <h>sand</h> will form hills of different slopes, depending on the pixel.<br><h>Place sand, dirt, and water in the highlighted (lighter) area to destroy the monsters!</h><br>You have <h>one</h> of <h>each</h> pixel, and you cannot edit after starting the simulation. Use the <b>reset</b> button to revert to before the simulation began.`,
                saveCode: '20;0000;air-160:leaves-3:air-17:leaves-4:air-16:leaves:wood:leaves-2:air-8:leaves-3:air-5:wood:leaves-3:air-7:leaves-5:air-4:wood:air-10:leaves-2:wood:leaves-2:air-4:wood:air-12:wood:air-6:wood:air-12:wood:air-6:wood:air-2:grass-5:air-5:wood:air-2:grass-4:dirt:grass-2:dirt-5:grass-3:air-2:wood:air:grass:dirt-15:grass-2:dirt:grass:dirt-45:;190:;0:78:118:;11f:1:e:1:1f:1:41:',
                inventory: {
                    dirt: 1,
                    sand: 1,
                    water: 1
                },
                id: 'aa79ddcd-da13-4459-8a23-02050d22e2cf'
            },
            {
                name: 'Mudslide',
                description: `Oh no! Your only pixels are <h>wood</h>, which doesn't fall. Don't worry, though, because you can use that wood to <h>redirect the water</h>. It may seem like this challenge is impossible, but there is another way.<br><h>Water</h> turns <h>dirt</h> into <h>mud</h> when it touches it - <h>you can use this to your advantage by creating a mudslide.</h>`,
                saveCode: '25;000d;air-128:water:air-154:dirt:air-23:dirt-3:air-21:dirt-4:air-21:dirt-5:air-10:leaves-3:air-6:dirt-7:air-8:leaves-5:air-5:dirt-7:concrete:air-7:leaves-2:wood:leaves-2:air-4:dirt-8:concrete:air-9:wood:air-2:water-4:dirt-8:concrete:air-9:wood:air-2:mud-4:dirt-8:concrete:air-2:grass-2:air-3:grass-2:dirt:grass-2:dirt-12:concrete-5:grass:air:grass:dirt-22:grass:air:grass:dirt-23:grass:dirt-56:;271:;7:8:11:8:11:8:11:8:11:8:11:8:a:f:a:f:a:f:a:f:a:f:168:;21f:1:51:',
                inventory: {
                    wood: 8
                },
                id: '90bbdef9-1f44-4d9b-a085-082189b71dfe'
            },
            {
                name: 'Lava',
                description: `It appears that the monsters are learning. They've built a barrier of wood to protect themselves from falling pixels. However, they failed to neglect the fact that you have been given lava for the purposes of these levels.<br><h>Lava can set stuff on fire, use it to burn through their barriers.</h>`,
                saveCode: '25;0000;air-367:wood-8:air-17:wood:air-6:wood:air-17:wood:air-6:wood:air-17:wood:air-6:wood:grass-15:air-2:wood:air-6:wood:dirt-15:grass-2:dirt:grass-6:dirt-126:;271:;0:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:18:1:9f:;1d5:1:2:2:97:',
                inventory: {
                    lava: 1
                },
                id: '3bf72052-af2f-4e43-ab64-bff7008be1bc'
            },
            {
                name: 'Breaking Game',
                description: `There's plenty of lava to destroy the monsters, but they've built a water trough to stop the lava and you only have some kitchen sponges and that weird plant you found growing on your basement floor. Wait, is that a <i>vault</i> that that monster's sealed itself in? You should be able to do this, though, you'll find a way.`,
                saveCode: '25;0000;air-310:water-4:concrete:air-17:concrete-8:air-21:concrete:air-24:concrete:air-24:concrete:air-24:concrete:air-13:lava-6:air-5:concrete:air-6:concrete-13:air:concrete:air-3:concrete:grass-6:concrete-7:dirt-5:concrete:air:concrete:grass-3:concrete:dirt-6:concrete-7:dirt-5:concrete:air:concrete:dirt-10:concrete-3:air:concrete-3:dirt-5:concrete:air:concrete:dirt-10:concrete-7:dirt-5:concrete:air:concrete:dirt-10:concrete-7:dirt-5:concrete-3:dirt-10:concrete-7:;271:;32:f:a:f:a:f:a:f:a:f:a:f:a:f:a:f:35:7:12:7:12:7:12:7:12:7:12:7:12:7:af:;1e4:2:3c:1:4e:',
                inventory: {
                    plant: 1,
                    sponge: 3
                },
                id: '470e4351-390f-4767-a415-006e8e7daf13'
            },
            {
                name: 'Floating Islands',
                description: `How strange, the Aether is real! Anyways, you only have a few pixels to use. <h>Choose wisely!</h>`,
                saveCode: '40;0000;air-61:leaves:air-38:leaves:wood:leaves:air-38:wood:air-35:grass-4:dirt:grass-2:air-33:stone-7:air-33:stone-6:air-35:stone-4:air-37:stone-3:air-19:grass-6:air-12:stone-2:air-20:stone-6:air-13:stone:air-21:stone-5:air-30:leaves-3:air-3:stone-3:air-31:leaves-3:air-4:stone-2:air-30:leaves-4:air-4:stone:air-31:leaves:wood:leaves:wood:air-37:leaves:wood-2:air-32:leaves-3:air-4:wood:air-3:leaves-3:air-26:leaves-3:air-4:wood:air-2:leaves-5:air-17:leaves-3:air-4:leaves-5:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-5:air-3:leaves-2:wood:leaves-2:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-2:wood:leaves-2:air-3:leaves-2:wood:leaves-2:air-3:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:grass:air-2:grass:dirt:grass-5:water-2:air-13:wood:air-7:wood:air-2:grass-3:dirt-2:grass-2:dirt-7:cloner_up:stone:water:air-11:grass:dirt:grass-7:dirt:grass-2:dirt-4:stone-2:dirt-6:stone-2:water:stone:air-12:stone-2:dirt-12:stone-13:air-14:stone-4:dirt-8:stone-2:air:stone-8:air-17:stone-13:air-2:stone-7:air-19:stone-11:air-3:stone-6:air-21:stone-10:air-3:stone-5:air-15:grass-4:air-4:stone-8:air-4:stone-5:air-15:stone-4:grass-2:air-2:stone-8:air-4:stone-4:air-17:stone-5:air-3:stone-6:air-5:stone-3:air-19:stone-3:air-5:stone-4:air-6:stone-3:air-19:stone:air-7:stone-3:air-7:stone-3:air-37:stone-2:air-38:stone:air-79:deleter-40:;640:;0:3d:1:26:3:25:3:22:7:21:7:21:7:21:7:21:7:11:6:a:7:11:6:a:7:11:6:a:7:d:463:;2c0:1:26:1:88:1:28:1:21:1:10d:1:176:',
                inventory: {
                    dirt: 3,
                    sand: 2,
                    wood: 10,
                    water: 1
                },
                id: '36855769-ee54-47f6-9ad2-874bdec25a6f'
            },
            {
                name: 'Platformer',
                description: `Well, the monsters have built themselves a platform up to an unplaceable area. Unfortunately for them, they've made it out of <h>wood</h>. Find a way to get them down!`,
                saveCode: '40;0000;air-605:wood-7:air-36:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-21:leaves-5:air-13:wood:air-21:leaves-6:air-2:leaves-2:air-8:wood:air-20:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-8:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-9:leaves-2:wood:leaves-2:air-2:leaves-2:wood:air-8:wood:air-9:wood-3:wall:lava:wall:air-8:wood:air-6:wood:water-8:wood:water-8:grass:concrete-3:wall:lava_generator:wall:grass:air-7:wood:air-6:wood:water-8:wood:water-5:mud-3:dirt-4:wall-3:dirt:grass:water-4:grass-2:dirt:grass:air:grass:air:grass-2:dirt:mud-4:water-4:wood:water-2:mud-5:dirt-10:mud-4:dirt-4:grass:dirt:grass:dirt-6:mud-5:wood:mud-2:dirt-34:concrete-7:dirt-33:concrete-7:dirt-228:;640:;2a8:8:1:27:1:27:1:27:1:27:1:1f:2d0:;1e9:1:26:2:23:2:1:3:1a2:1:f4:1:1:1:16b:',
                inventory: {
                    sand: 5,
                    wood: 3,
                    leaves: 8,
                    water: 1,
                    plant: 1
                },
                id: '56550ea3-28fa-48ff-84ac-2a5b41e4902a'
            },
            {
                name: 'Rafting',
                description: `Quick, they're approaching by sea! Try and find a way to get them while they're still on the raft!`,
                saveCode: '40;0000;air-1243:wood-12:air-25:water-3:wood-12:water-305:;640:;13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:230:;4b6:1:3:1:1:1:183:',
                inventory: {
                    sand: 20,
                    wood: 5,
                    water: 8,
                    concrete_powder: 9
                },
                id: '55f2433d-8012-4b75-a3bf-c00a182a6a43'
            },
            {
                name: 'Oh Well',
                description: `This is a strange predicament... We're in a desert now, and we nothing except some leaves, which are pretty useless. Wait, did I say "<h>we</h>"? Sorry, I meant <h>you</h>. Just ignore the sand on the well, those are there for liability reasons.`,
                saveCode: '50;0000;air-641:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood:sand-3:wood:air-45:wood-5:air-96:wood:air:wood:air-5:sand-10:air-32:wood:air:wood:sand-18:air-5:sand-10:lava-7:sand-7:concrete:water:concrete:sand-34:lava-5:sand-8:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-5:stone-11:sand-7:stone-5:sand-19:concrete:water:concrete:sand-5:stone-29:sand-3:stone-7:sand-3:concrete:water:concrete:sand:stone-46:concrete:water:concrete:stone-47:concrete:water:concrete:stone-47:concrete:water:concrete:stone-42:water-13:stone-34:water-16:;9c4:;16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:13:5:4:16:1c:16:14:1:1:1:5:16:14:1:1:57e:;459:1:56a:;9c4:',
                inventory: {
                    leaves: 20
                },
                id: '0f2e0f70-3803-4a9a-9987-8686d2dd7069'
            },
            {
                name: 'Resupply Needed',
                description: `You actually have nothing this time! Well, good luck!<br>Hint: The butterfly effect still exists.`,
                saveCode: '50;0000;air-373:wall:lava-3:wall:air-43:sand-2:wall:lava-3:wall:air-42:sand-3:wall:lava-3:wall:air-16:wood-3:air-22:stone-4:wall-5:stone:air-14:wood-4:air-23:stone-8:air-15:dirt-4:grass:air-23:stone-7:air-15:stone-5:air-23:stone-7:air-8:stone:air-3:stone:air-3:stone-4:air-24:stone-5:air-9:stone:water-3:stone:air-4:stone:air-27:stone-4:air-10:stone-4:air-4:stone:air-12:grass-5:air-10:stone-3:air-11:stone-3:air-18:stone-5:air-10:stone-2:air-12:stone-2:air-20:stone-3:air-12:stone:air-34:stone-3:air-48:stone-2:air-276:leaves-5:air-7:dirt-2:air-35:leaves-7:air-6:dirt-3:air-13:sand-3:air-17:leaves-4:wood:leaves:wood:leaves:air-6:dirt-4:air-10:wood:sand-5:wood:air-15:leaves-4:wood-2:leaves-2:air-6:dirt-4:air-10:wood:sand-5:wood:air-16:leaves:wood:leaves:wood:leaves-2:air-3:leaves-3:air:dirt-5:air-9:wood:sand-5:wood:air-18:wood-2:air-4:leaves-5:dirt-5:air-9:wood:sand-5:wood:air-19:wood:air-4:leaves-5:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-4:leaves-2:wood:leaves-2:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:air-7:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:concrete-14:grass:water-2:wood-5:water-9:grass:air:dirt:grass-2:air-2:grass-2:dirt:grass-2:dirt-22:mud:water-13:mud-2:dirt-5:grass-2:dirt-28:mud-4:water-6:mud-3:dirt-41:mud-6:dirt-269:stone-16:dirt-32:stone-32:dirt-18:stone-200:;9c4:;0:175:5:2d:5:2d:5:29:a:29:8:f:5:17:7:f:5:17:7:8:1:3:1:3:4:18:5:9:1:3:1:4:1:1b:4:a:4:4:1:4:6a4:;538:1:16a:1:9:1:1:1:d:1:16:2:27:1:3:1:2c2:',
                inventory: {
                    air: 0
                },
                id: 'a2007b54-3709-4b64-a254-0f8b617ffc55'
            }
        ]
    },
    {
        name: 'Pixel Machines',
        levels: [
            {
                name: 'Pushy Pistons',
                description: `These pixels can move on their own, I wonder if you can make a computer with them. Oh, by the way, watch out for the gunpowder.`,
                saveCode: '32;0000;wall-33:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:concrete:lava-2:air-3:concrete:air-23:wall-2:concrete-7:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:air-5:wood:air-23:wall-2:wood:gunpowder-5:wood:air-21:wall:air:wall-2:wood:gunpowder-5:wood:air-21:wall:air:wall-2:wood-7:air-21:wall:air:wall-10:air-19:wall-2:water:wall-2:air-3:wall:air-24:wall:air:wall-2:air-2:wall:air-25:wall:air:wall-2:air:wall:air-26:wall:air:wall-3:air-15:sand-3:air-9:wall:air:wall-2:air-15:sand-5:air-8:wall:air:wall-2:air-13:wall-19:air-17:wall:air-12:wall-2:air-17:wall:air-12:wall-7:air-12:wall:air-12:wall-3:air-16:wall:air-9:wall-6:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-3:air-16:wall:air-12:wall-33:;400:;21:7:19:7:19:7:19:7:19:7:19:7:19:7:1c:3:127:f:1:1:f:f:1:1:f:f:1:1:f:3:3:9:1:1:f:2:5:8:1:1:34:3:1d:3:1d:3:1d:3:1d:3:1d:3:1d:3:1d:3:2a:;1e8:1:13:1:140:1:6e:1:1f:2:c:1:25:',
                inventory: {
                    piston_left: 1,
                    piston_up: 1,
                    piston_right: 2,
                    piston_down: 1
                },
                id: '61263f9d-0719-44e9-8f1f-f514468f9556'
            },
            {
                name: 'Spinny Rotator',
                description: `Oh cool, we can rotate stuff now. Well, I already knew that. Anyways, you only have <h>rightwards pistons</h>, <h>clockwise rotators</h>, and <h>rightwards rotators</h>. And a <h>wall</h>, which is immovable. Use the existing rotators to your advantage.<br><h>The rotators with spinning textures will rotate pixels in their direction, and the static ones will rotate pixels to face the same way as them.</h>`,
                saveCode: '40;0000;wall-17:air-3:wall-21:air-15:wall:air-3:wall:air-12:rotator_left:air-5:wall-2:air-15:wall:air-3:wall:air-3:rotator_counterclockwise:air-14:wall-2:air-15:wall:air-3:wall:air-18:wall-2:air-15:wall:air-3:wall:rotator_down:air-11:piston_left:air-5:wall-2:air-15:wall:air-3:wall:air-5:wall-6:air-7:wall-2:air-15:wall:air-3:wall:air-10:wall:air-7:wall-2:air-15:wall:lava-3:wall:air-10:wall:air-7:wall-2:air-19:wall:air-10:wall:air-7:wall-2:air-18:piston_left:wall:air-10:wall:air-7:wall-2:air-9:wall-4:air-6:wall:air-10:wall:air-7:wall-2:air-12:wall-13:air-5:wall:air-7:wall-2:rotator_counterclockwise:air-29:wall:air-7:wall-2:air-30:wall:air-7:wall-2:air-12:wall-11:air-3:rotator_left:air-3:wall:air-7:wall-2:air-30:wall:air-7:wall-2:air-30:rotator_left:air-7:wall-2:air-9:wall-22:air-7:wall-2:air-16:wall:air-21:wall-2:air-16:wall:air-21:wall-2:air-5:wall:air-10:wall:air-4:piston_right:air-11:rotator_up:air-4:wall-2:air-5:wall:air-10:wall:air-21:wall-2:air-5:wall:air-10:wall:air-21:wall-2:air-5:wall:air-10:wall-24:air-2:gunpowder-3:wall:air-32:wall-2:gunpowder-5:wall:air-32:wall-2:gunpowder-5:wall:air-31:rotator_down:wall-8:wood-2:air-29:rotator_down:wall-2:air-30:wall:air-7:wall-2:air-30:wall-4:air-4:wall-2:air-14:wall-3:air-7:rotator_left:wall-6:air:wall-2:air-4:wall-2:air-14:wall:rotator_counterclockwise:air-8:rotator_left:wall:air-4:wall:air-7:wall-2:air-10:rotator_up:concrete:piston_left:air:wall:air-9:rotator_left:wall:air-4:wall:air-4:wall:air-2:wall-17:air-9:rotator_left:wall:air-4:wall:rotator_up:air-2:rotator_clockwise:wall:air-2:wall-2:air-24:wall-2:air-4:wall-6:air-2:wall-2:air-24:wall-2:air-9:wall:air-2:wall-2:air-16:rotator_left:air-7:concrete:rotator_down:air:wall:air-10:wall-6:air-20:wall-2:air-12:wall-6:air-20:wall-2:air-10:rotator_left-2:wall-41:;640:;105:a:1e:a:16:7:1:a:1e:a:1e:a:122:10:18:10:18:5:1:a:18:5:1:a:18:5:1:a:1e:a:18:2:4:1d:b:1d:d:1b:d:1b:5:6:8:10:1:4:5:6:8:10:a:6:b:7:10:6:a:8:10:6:a:8:20:8:20:8:20:8:21:7:1f:9:1f:9:37:;174:1:11d:1:109:1:7a:2:b7:1:d0:1:69:1:34:;640:',
                inventory: {
                    wall: 1,
                    piston_right: 8,
                    rotator_right: 3,
                    rotator_clockwise: 3
                },
                id: 'f1f004fe-fac1-482d-866c-bead1f9c6057'
            },
            {
                name: 'Moving Machines',
                description: `There's those <h>goal</h> (gold) and <h>target</h> (cyan) pixels I alluded to earlier. You must <h>push the goal pixels into the targets to win</h>. Those yellow-orange pixels with horizontal and vertical lines are <h>sliders</h>- They <h>can only be pushed along one axis</h> and <h>can be rotated</h>, perhaps that will be useful here.<br><h>Remember, when in doubt, do random stuff and see what happens!</h>`,
                saveCode: '50;0000;wall-51:air-8:piston_down:air-39:wall-2:air-48:wall-2:air-6:piston_right:air-28:leaves-3:air-10:wall-2:air-35:leaves-3:air-10:wall-2:air-7:piston_up:air-26:leaves-2:wood:leaves-2:air-9:wall-2:air-34:leaves-2:wood:leaves-2:air-9:wall-2:grass-8:air-28:wood:air-11:wall-2:dirt-8:grass-14:air-14:wood:air-2:grass-9:wall-2:dirt-22:grass-14:dirt:grass-2:dirt-9:wall-2:dirt-48:wall-2:dirt-48:wall-52:air-48:wall-2:air-48:wall-2:air-3:slider_horizontal:air-44:wall-2:air-48:wall-2:air-48:wall-2:air-48:wall-2:air-34:cloner_down:air-13:wall-2:air-8:wall-26:air:rotator_clockwise:air-3:rotator_clockwise:air-8:wall-2:air-8:wall:air-21:piston_down:air-2:wall:air-14:wall-2:air-8:wall:air-20:rotator_down:slider_vertical:air-2:wall:air-14:wall-2:air-8:wall:air-20:slider_vertical:air-3:wall:air:piston_up:air-12:wall-2:air-8:wall-4:piston_up:wall:piston_up-2:wall-5:piston_up:wall-7:air-4:wall:air:rotator_clockwise:air-3:rotator_clockwise:air-8:wall-2:air-8:wall:air-19:wall:air-4:wall:air-14:wall-2:air-8:wall:air-19:wall:air-4:wall:air-14:wall-2:air-4:slider_vertical:air-3:wall:air-19:wall:air-4:wall:air-14:wall-2:air-4:slider_vertical:air-3:wall-2:air-19:slider_horizontal-2:air-2:wall:air-14:wall-2:air-3:cloner_left:air-4:wall:air-19:wall:air-4:wall:air-14:wall-2:air-8:wall:air-19:wall:air-4:wall:air-14:wall-2:air-8:wall-26:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-2:air-33:wall:air-14:wall-20:air-8:wall-8:air-14:wall-2:air-26:wall:air-21:wall-2:air-26:wall:air-21:wall-2:air-26:wall:air-21:wall-2:air-24:wall:air:wall:air-21:wall-2:air-15:goal:air-10:wall:air-21:wall-2:air-26:wall:air-21:wall-2:air-26:wall:air-14:wall:air-6:wall-2:air-26:wall:air-21:wall-2:air-26:wall:air-21:wall-51:;9c4:;33:8:1:18:11:21:11:6:1:1a:11:21:11:7:1:19:11:21:19:19:27:b:d9:8:1a:e:2:8:1a:e:2:3:1:4:1a:e:2:8:1a:e:2:8:1a:e:2:8:1a:e:2:8:1b:d:3d:13:1f:13:1f:13:51:13:1f:13:20:12:20:12:1f:13:1f:6:1:c:48:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:11:8:10:9:43:11:11:e:2:11:11:e:2:11:11:e:2:11:11:e:2:f:1:1:11:e:2:11:11:e:2:11:11:7:1:6:2:11:11:e:2:11:11:e:33:;126:1:31:1:2f:1:1:1:3c5:1:77:2:22:1:d:2:3c8:;8b8:1:10b:',
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
                id: 'a47ec9c3-d9fa-4d01-8ac7-4ef6405a246e'
            },
            {
                name: 'Green Lasers',
                description: `Green lasers are bad for your health, and they're especially bad for pixels. Luckily, you have laser scatterers, which scatters the laser beam into harmless green light. Give it a try.`,
                saveCode: '25;0000;wall-26:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-3:laser_down-3:air-11:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-17:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-9:wood-8:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-2:air-10:wood:air-4:wood:air:wall:air-5:wall-20:air-5:wall-2:air-23:wall-2:air-23:wall-2:air-23:wall-2:air-3:goal:air-19:wall-2:air-23:wall-2:air-23:wall-2:air-23:wall-8:laser_up-4:wall-14:;271:;1a:11:1:5:2:11:1:5:2:11:1:5:2:3:3:b:1:5:2:11:1:5:2:11:1:5:2:11:1:5:2:11:1:5:2:11:1:5:2:11:1:3:1:1:2:a:1:4:1:1:1:5:2:9:9:5:2:a:6:1:1:5:2:a:6:1:1:5:2:a:6:1:1:5:14:5:2:6:c:5:2:6:c:5:2:6:c:5:2:3:1:2:c:5:2:6:c:5:2:6:c:5:2:6:c:5:1a:;16b:2:17:3:ea:;110:1:160:',
                inventory: {
                    concrete: 1,
                    piston_up: 1,
                    piston_right: 8,
                    slider_horizontal: 2,
                    laser_scatterer: 3
                },
                id: '81224eff-f6dd-4268-a5aa-1d672e4ebf3a'
            },
            {
                name: 'Breaking Thermodynamics',
                description: `Instead of breaking the game, in this puzzle you'll be breaking the laws of thermodynamics! The pixels with blue and yellow arrows are <h>copiers</h>, and they... copy. These pixels here are special copiers called <h>cloners</h>; they are like copiers, but they can <h>push pixels</h> to make space for the mass it creates in violation of the laws of thermodynamics.<br>Some pixels are not cloneable, for example, goal pixels.`,
                saveCode: '32;0000;wall-33:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-2:air-30:wall-34:air-20:wall:air-9:wall-2:air-20:wall:air-9:wall-2:air-20:wall:air-9:wall-2:air-20:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-9:wall:air-9:wall-2:air-10:wall:air-19:wall-2:air-10:wall:air-19:wall-2:air-10:wall:air-19:wall-2:air-10:wall:air-19:wall-2:air-10:wall:air-19:wall-33:;400:;aa:2:1e:2:ea:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:17:9:21:;141:5:b:5:b:5:b:5:1cd:2:1e:4:1c:4:1b:5:1b:6:38:;400:',
                inventory: {
                    concrete: 3,
                    push_cloner_left: 6,
                    push_cloner_up: 2,
                    push_cloner_right: 1,
                    push_cloner_down: 3,
                    slider_horizontal: 3
                },
                id: '3901eb61-fc2d-4ed7-b785-9a22bd33c0c3'
            }
        ]
    }
];

let currentPuzzleSection = 0;
let currentPuzzleLevel = 0;
let currentPuzzleId = 0;
const winScreen = document.getElementById('winScreen');
const winBox = document.getElementById('winBox');
const winReset = document.getElementById('winReset');
const winNext = document.getElementById('winNext');
const winMenu = document.getElementById('winMenu');
let inWinScreen = false;
function triggerWin() {
    if (inWinScreen) return;
    inWinScreen = true;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (window.playWinSound) window.playWinSound();
    winScreen.style.opacity = '1';
    winScreen.style.pointerEvents = 'all';
    winBox.style.transform = 'translateY(-50%)';
    const hide = () => {
        winScreen.style.opacity = '';
        winScreen.style.pointerEvents = '';
        winBox.style.transform = '';
        winReset.onclick = null;
        winNext.onclick = null;
        winMenu.onclick = null;
        inWinScreen = false;
    };
    if (puzzles[currentPuzzleSection].levels[currentPuzzleLevel + 1]) {
        winNext.onclick = () => {
            hide();
            transitionWithinGame(() => {
                loadPuzzle(currentPuzzleSection, currentPuzzleLevel + 1);
            });
        }
        winNext.style.display = '';
    } else {
        winNext.style.display = 'none';
    }
    winReset.onclick = (e) => {
        hide();
        saveCode = saveCodeText.value.replace('\n', '');
        loadSaveCode();
        inResetState = true;
    };
    winMenu.onclick = (e) => {
        hide();
        transitionToMenu();
    };
};

const levelName = document.getElementById('levelName');
const levelDescription = document.getElementById('levelDescription');
function loadPuzzle(section, level) {
    try {
        currentPuzzleSection = parseInt(section);
        currentPuzzleLevel = parseInt(level);
        const puzzle = puzzles[section].levels[level];
        currentPuzzleId = puzzle.id;
        levelName.innerHTML = `${parseInt(section) + 1}-${parseInt(level) + 1} ${puzzle.name}`;
        levelDescription.innerHTML = puzzle.description;
        puzzleSaveCode = puzzle.saveCode;
        saveCode = puzzleSaveCode;
        let savedData = window.localStorage.getItem(`challenge-${currentPuzzleId}`);
        if (savedData) savedData = JSON.parse(savedData);
        if (savedData) saveCode = savedData.code;
        saveCodeText.value = saveCode;
        loadSaveCode();
        inResetState = true;
        resetPixelAmounts();
        if (savedData) {
            let isFirst = true;
            for (let pixelType in savedData.pixels) {
                if (isFirst) {
                    pixelSelectors[pixelType].box.onclick();
                    isFirst = false;
                }
                if (puzzle.inventory[pixelType] !== undefined || (savedData.pixels[pixelType] != 0 && pixelType != 'air')) {
                    pixelAmounts[pixelType] = savedData.pixels[pixelType];
                    updatePixelAmount(pixelType, false, true);
                }
            }
        } else {
            let isFirst = true;
            for (let pixelType in puzzle.inventory) {
                if (isFirst) {
                    pixelSelectors[pixelType].box.onclick();
                    isFirst = false;
                }
                pixelAmounts[pixelType] = puzzle.inventory[pixelType];
                updatePixelAmount(pixelType, false, true);
            }
        }
        pixelAmounts['air'] = Infinity;
        updatePixelAmount('air', false, false);
        camera.scale = 1;
        camera.x = 0;
        camera.y = 0;
    } catch (err) {
        modal('Could not load puzzle:', `<span style="color: red;">${err.message}</span><br>Restart the puzzle if issues persist.`, false);
    }
};
for (let section in puzzles) {
    const block = document.createElement('div');
    block.classList.add('levelGroup');
    const title = document.createElement('h1');
    title.innerText = puzzles[section].name;
    block.appendChild(title);
    let col = 0;
    for (let level in puzzles[section].levels) {
        const button = document.createElement('button');
        button.classList.add('levelButton');
        button.innerText = parseInt(level) + 1;
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

window.addEventListener('DOMContentLoaded', (e) => {
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