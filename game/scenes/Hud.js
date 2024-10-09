import { Scene } from 'phaser';

export class Hud extends Scene {
    constructor() {
        super('Hud');
    }

    create() {
        this.player1Text = this.add.text(50, 50, 'Player 1', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.player1BurgersText = this.add.text(50, 100, '0', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.player1PepperText = this.add.text(50, 150, '0', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.player2Text = this.add.text(800, 50, 'Player 2', {    
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.player2BurgersText = this.add.text(800, 100, '0', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.player2PepperText = this.add.text(800, 150, '0', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        this.countdownText = this.add.text(this.cameras.main.centerX, 50, 'Countdown ', {
            fontFamily: 'Courier', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5)

    }
    update() {
        this.player1BurgersText.setText('Burgers: ' + this.registry.get('player1Burgers'))
        this.player1PepperText.setText('Pepper: ' + this.registry.get('player1PepperCount'))

        this.player2BurgersText.setText('Burgers: ' + this.registry.get('player2Burgers'))
        this.player2PepperText.setText('Pepper: ' + this.registry.get('player2PepperCount'))


        this.countdownText.setText('Time Left: ' + (60 - this.registry.get('countdown')) + '!')


    }
}
