import { Scene } from 'phaser';
import { PeterPepper } from '../characters/PeterPepper';
import { Sausage } from '../characters/Sausage';
export class Game extends Scene {
    constructor() {
        super('Game');
    }
    resetBurger() {
        this.burger.setX((Math.random() * 1000) - 500)
        this.burger.setY(100)
        this.burger.setAngularVelocity(Math.random() * 360)
        this.burger.body.setVelocityX(Math.random() * 50)
    }
    cameraTick() {
        this.mid.copy(this.player1.sprite.body.center).lerp(this.player2.sprite.body.center, 0.5);
        this.dist = Phaser.Math.Distance.BetweenPoints(
            this.player1.sprite.body.position,
            this.player2.sprite.body.position
        );
        this.min = Math.min(this.scale.width, this.scale.height) / 1.3;
        this.cameras.main.setZoom(
            Phaser.Math.Linear(
                this.cameras.main.zoom,
                Phaser.Math.Clamp(this.min / this.dist, 0.2, 4),
                0.2
            )
        );
    }
    create() {
        this.background = this.add.image(0, 0, 'qwanoes')
        this.burger = this.physics.add.sprite(0, 0, 'burger').setBounce(0.7).setCollideWorldBounds(true)
        let player1keys = {
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.s,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'U': Phaser.Input.Keyboard.KeyCodes.Q,
            'O': Phaser.Input.Keyboard.KeyCodes.E,
        }
        let player2keys = {
            'up': Phaser.Input.Keyboard.KeyCodes.I,
            'down': Phaser.Input.Keyboard.KeyCodes.K,
            'left': Phaser.Input.Keyboard.KeyCodes.J,
            'right': Phaser.Input.Keyboard.KeyCodes.L,
            'U': Phaser.Input.Keyboard.KeyCodes.U,
            'O': Phaser.Input.Keyboard.KeyCodes.O,
        }
        console.log(this.registry.get('player1name'))
        console.log(this.registry.get('player2name'))

        if (this.registry.get('player1name') == 'peter-pepper') {
            this.player1 = new PeterPepper(this, -20, 0, player1keys, this.player2)
        }
        if (this.registry.get('player1name') == 'sausage') {
            this.player1 = new Sausage(this, -20, 0, player1keys, this.player2)

        }
        if (this.registry.get('player2name') == 'peter-pepper') {
            this.player2 = new PeterPepper(this, -20, 0, player2keys, this.player1)
        }
        if (this.registry.get('player2name') == 'sausage') {
            this.player2 = new Sausage(this, -20, 0, player2keys, this.player1)

        }
        this.tilemap = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 })
        const tileset = this.tilemap.addTilesetImage('platformTiles', 'platformTiles', 16, 16)
        const map = this.tilemap.createLayer('collide', tileset).setCollisionBetween(1, 4)

        this.physics.add.collider(this.burger, map)
        this.physics.add.collider(this.player1.sprite, map)
        this.physics.add.collider(this.player2.sprite, map)


        this.physics.add.overlap(this.player2.sprite, this.burger, () => {
            this.player2.burgers++
            this.resetBurger()
        })
        this.physics.add.overlap(this.player1.sprite, this.burger, () => {
            this.player1.burgers++
            this.resetBurger()
        })

        for (let i = 0; i < this.player1.attacks.length; i++) {
            this.physics.add.overlap(this.player2.sprite, this.player1.attacks[0].sprite, () => {
                this.player2.overlap(this.player1.attacks[0].name)
            })
        }
        for (let i = 0; i < this.player2.attacks.length; i++) {
            this.physics.add.overlap(this.player1.sprite, this.player2.attacks[i].sprite, () => {
                this.player1.overlap(this.player2.attacks[i].name)
            })
        }

        this.physics.add.overlap(this.player1.sprite, this.player2.sprite, () => {
            this.player1.overlap(this.player2.name)
            this.player2.overlap(this.player1.name)
        })



        this.cameras.main.setBounds(-500, -500, 1000, 1000)
        this.physics.world.setBounds(-500, -500, 1000, 1000)

        this.mid = new Phaser.Math.Vector2

        this.cameras.main.startFollow(this.mid, false, 0.05, 0.05);
        this.countdown = 0;
        this.registry.set('countdown', this.countdown);
        const countdownTimer = setInterval(() => {
            this.countdown++;
            if (this.countdown >= 60) {
                clearInterval(countdownTimer)
                this.scene.stop('Hud');
                this.scene.start(
                    'GameOver',
                    {
                        'player1Burgers': this.player1.burgers,
                        'player2Burgers': this.player2.burgers,
                    }
                )

            }
            this.registry.set('countdown', this.countdown);
        }, 1000)
    }
    update() {
        this.cameraTick()
        this.player2.update();
        this.player1.update();

        this.registry.set('player1Burgers', this.player1.burgers)
        this.registry.set('player1PepperCount', this.player1.pepperCount)

        this.registry.set('player2Burgers', this.player2.burgers)
        this.registry.set('player2PepperCount', this.player2.pepperCount)
    }
}
