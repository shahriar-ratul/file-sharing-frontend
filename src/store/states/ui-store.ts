import { makeAutoObservable } from 'mobx';

export class UiStore {
    count = 0;

    constructor() {
        makeAutoObservable(this);
    }

    increment = () => {
        this.count++;
    };
}
