import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthStateService } from '../../auth/auth-state.service';
import { PreparationArgs } from '@cloud-api/arguments';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from '../../auth/notification.service';
import { Player } from '@cloud-api/core-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';

@Component({
    templateUrl: './mini-prep.component.html',
})
export class MiniPrepComponent implements OnInit {
    miniGameNumber = new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]);
    form = new FormGroup({
        miniGameNumber: this.miniGameNumber,
    });

    player: Player | null;

    waiting = false;

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private afs: AngularFirestore,
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private notification: NotificationService
    ) {
    }

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.player = player;
                this.miniGameNumber.setValue(player ? player.miniGameNumber : null);
            },
            error => {

            }
        );
    }

    onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;

        const args: PreparationArgs = {
            miniGameNumber: this.miniGameNumber.value,
            ships: []
        };

        this.cloudFunctions.addPreparation(args).toPromise()
            .then(results => {
                this.waiting = false;
            })
            .catch(error => {
                this.waiting = false;
            })
            ;
    }

}
