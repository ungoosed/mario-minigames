import { Scene } from 'phaser';

export class ChooseArena extends Scene {
    constructor() {
        super('ChooseArena');
    }

    create() {
        let centerX = this.cameras.main.centerX
        let centerY = this.cameras.main.centerY

        let player1name = 'peter-pepper'
        let player2name = 'peter-pepper'
        this.peterPepper = this.add.image(100, centerY, 'peter-pepper').setScale(3,3).setFrame(2)
        this.logo = this.add.image(centerX, 175, 'burgerlogo').setScale(5, 5)
        this.player1Info = this.add.image(centerX - 200, centerY, 'player1Info').setScale(3, 3)
        this.player2Info = this.add.image(centerX + 200, centerY, 'player2Info').setScale(3, 3)
        this.startButton = this.add.image(centerX, 800, 'startButton').setScale(5, 5).setFrame(0).setInteractive()
        this.chooseSausage1 = this.add.image(centerX - 200, 600, 'chooseSausage').setScale(3, 3).setFrame(0).setInteractive().setName('sausage')
        this.chooseSausage2 = this.add.image(centerX + 200, 600, 'chooseSausage').setScale(3, 3).setFrame(0).setInteractive().setName('sausage')

        this.choosePeter2 = this.add.image(centerX + 200, 650, 'choosePeter').setScale(3, 3).setFrame(0).setInteractive().setName('peter-pepper')
        this.choosePeter1 = this.add.image(centerX - 200, 650, 'choosePeter').setScale(3, 3).setFrame(0).setInteractive().setName('peter-pepper')
        this.startButton.on('pointerover', () => { this.startButton.setFrame(1) })
        this.startButton.on('pointerout', () => { this.startButton.setFrame(0) })

        let buttons = [this.chooseSausage1, this.choosePeter1, this.chooseSausage2, this.choosePeter2]
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].on('pointerover', () => { buttons[i].setFrame(1) })
            buttons[i].on('pointerdown', () => {buttons[i].setFrame(0); if (i/2 == 0) {player1name = buttons[i].name} else {player2name = buttons[i].name}})
            buttons[i].on('pointerup', () => { buttons[i].setFrame(1) })
            buttons[i].on('pointerout', () => { buttons[i].setFrame(0) })
        }
        this.startButton.on('pointerdown', () => {
            this.registry.set('player1name', player1name)
            this.registry.set('player2name', player2name)
            this.scene.start('Game')
            this.scene.start('Hud')
        })
        this.registry.set('player1Burgers', 0)
        this.registry.set('player2Burgers', 0)

        this.registry.set('player1Damage', 0)
        this.registry.set('player2Damage', 0)

    }
}
