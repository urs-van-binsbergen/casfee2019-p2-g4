import { Component, OnInit } from '@angular/core';
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
    miniGameSecret = new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]);
    form = new FormGroup({
        miniGameSecret: this.miniGameSecret,
    });

    player: Player | null;

    waiting = false;

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private notification: NotificationService
    ) {
    }

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.player = player;
                this.miniGameSecret.setValue(player ? player.miniGameSecret : null);
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
            size: { w: 8, h: 8 }, // TODO: move magic number to some constant
            ships: [],
            miniGameSecret: this.miniGameSecret.value,
        };

        this.cloudFunctions.addPreparation(args).toPromise()
            .then(results => {
                this.waiting = false;
            })
            .catch(error => {
                this.notification.quickToast('Error when saving. Sorry.', 2000);
                console.error(error);
                this.waiting = false;
            });
    }

}
