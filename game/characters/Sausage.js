export class Sausage {
    constructor(scene, x, y, controls) {
        this.name = 'sausage';
        this.jumps = 1;
        this.stunned = false;
        this.burgers = 0
        this.scene = scene
        this.sprite = this.scene.physics.add.sprite(x, y, 'sausage', 0).setCollideWorldBounds(true).setMaxVelocity(300)
        this.attacks = []

        this.keys = this.scene.input.keyboard.addKeys(controls)
        this.sprite.anims.create({
            key: 'walk',
            frames: this.sprite.anims.generateFrameNumbers('sausage', { frames: [0, 1] }),
            frameRate: 10,
            repeat: -1
        });
        this.sprite.anims.create({
            key: 'peppered',
            frames: this.sprite.anims.generateFrameNumbers('sausage', { frames: [2, 3] }),
            frameRate: 5,
            repeat: -1
        });
    }
    update() {
        if ((this.stunned == true) || (!this.keys.left.isDown && !this.keys.right.isDown)) {
            this.sprite.body.setVelocityX(this.sprite.body.velocity.x / 1.2)
        }
        if (this.stunned == false) {
            if (!this.keys.left.isDown && !this.keys.right.isDown) {
                this.sprite.anims.stop('walk')
                this.sprite.setFrame(0)
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


    }
    kill() {
        this.sprite.body.position.setX(0).setY(0)
    }
}