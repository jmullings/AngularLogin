import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    templateUrl: './404.component.html',
})
export class NotFoundComponent implements OnInit {

    public constructor(private title: Title) {}

    public ngOnInit() {
        this.title.setTitle('404 | Demo App');
    }
}
