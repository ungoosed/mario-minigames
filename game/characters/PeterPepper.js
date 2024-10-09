export class PeterPepper {
    constructor(scene, x, y, controls, opponent) {
        this.scene = scene

        this.opponent = opponent;
        this.stunned = false
        this.name = 'peter-pepper';
        this.jumps = 1;
        this.lives = 5;


        this.pepperCount = 20;
        this.burgers = 0

        this.sprite = this.scene.physics.add.sprite(x, y, 'peter-pepper', 0).setCollideWorldBounds(true).setMaxVelocity(300)
        this.pepper = this.scene.physics.add.sprite(0, 0, 'pepper').setVisible(false)
        this.pepper.body.setAllowGravity(false)
        this.pepper.body.setEnable(false)
        this.attacks = [{name: 'pepper', sprite: this.pepper}]

        this.keys = this.scene.input.keyboard.addKeys(controls)
        this.sprite.anims.create({
            key: 'walk',
            frames: this.sprite.anims.generateFrameNumbers('peter-pepper', { frames: [0, 1] }),
            frameRate: 10,
            repeat: -1
        });
        this.sprite.anims.create({
            key: 'peppered',
            frames: this.sprite.anims.generateFrameNumbers('peter-pepper', { frames: [3, 4] }),
            frameRate: 5,
            repeat: -1
        });
    }

    update() {
        if ((this.stunned == true) || (!this.keys.left.isDown && !this.keys.right.isDown)) {
            this.sprite.body.setVelocityX(this.sprite.body.velocity.x / 1.2)
        }
        if (this.sprite.body.blocked.down) {
            this.jumps = 2;

        }
        if (this.stunned == false) {
            if (!this.keys.left.isDown && !this.keys.right.isDown) {
                this.sprite.anims.stop('walk')
                this.sprite.setFrame(2)
            }
            if (this.keys.up.isDown && this.sprite.body.blocked.down) {
                this.sprite.body.setVelocityY(-500);
            }
            if (this.keys.left.isDown) {
                this.sprite.anims.play('walk', true)
                this.sprite.body.setVelocityX(this.sprite.body.velocity.x - 20)
                this.sprite.setFlipX(false);

            }
            if (this.keys.right.isDown) {
                this.sprite.anims.play('walk', true)
                this.sprite.body.setVelocityX(this.sprite.body.velocity.x + 10)
                this.sprite.setFlipX(true);
            }
        }
        this.keys.up.onDown = () => {
            if (!this.sprite.body.touching.down && this.jumps > 0 && this.stunned == false) {
                this.sprite.body.setVelocityY(-500);
                this.jumps--
            }
        }


        if (this.keys.U.isDown && !this.pepper.visible && this.pepperCount > 0) {
            this.pepperCount--
            this.pepper.setX(this.sprite.body.position.x - 10).setY(this.sprite.body.position.y)
            this.pepper.body.setEnable(true)
            this.pepper.setVisible(true)
            this.scene.time.addEvent({
                delay: 1000, callback: () => {
                    this.pepper.setVisible(false)
                    this.pepper.body.setEnable(false)
                }
            })
        }
    }
    overlap(name) {
        if (name == 'pepper') {
            if (this.stunned == false) {
                this.sprite.anims.play('peppered', true)
                this.stunned = true;
                this.scene.time.addEvent({
                    delay: 4000, callback: () => {
                        this.stunned = false;
                    }
                })
            }
        }
        if(name=='sausage') {
            this.kill()
        }
    }

    kill() {
        if(this.lives <= 0) {
            this.stunned == false;
            this.scene.scene.stop('Hud')
            this.scene.scene.start(
                'GameOver',
                {
                    'player1Burgers': this.scene.player1.burgers,
                    'player2Burgers': this.scene.player2.burgers,
                }
            )
        }   
        this.lives--
        this.sprite.body.position.set(0,0)
    }
}