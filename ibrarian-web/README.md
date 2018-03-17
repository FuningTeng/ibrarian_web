# IbrarianWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.8.

## Content

* [Introduction](#introduction)
* [Intended Use](#intended-use)
* [Installation](#installation)
* [Development server](#development-server)
* [Code scaffolding](#code-scaffolding)
* [Customize service](#customize-service)
* [Build](#build)
* [Further help](#further-help)
* [Demo Project](#demo-project)

## Introduction

iBrarian is a proactive research assistant that classifies and presents scholarly papers, articles, news and blogs, not Web pages.
iBrarian is a fully automated computer system that reads and learns from scholarly papers and articles as well as online news and political blogs. The project is front end with Dummy data only, but it shows the potential of how visualization helps user quickly identity the reference relationship of each scholoarly papers.  

Combining the power of **D3** and **Angular** is challenging. The intent of this package is also to provide a **demo** to access **D3** as an **Angular service** for use by components requiring the kind of sophisticated visualization support D3 excels at.
The package includes dragable node view component with a detail view component to improve code maintainability and extensibility. With furtuer development of backend service, this project can be quickly plugged into other project as a functional component.

## Intended Use

This package was designed as a **demo** to quickly add **D3** support to an **Angular** application, with creating with the **angular-cli**.

As is clear from the D3 scope described below, there may be circumstances, where a smaller or larger D3 feature set may be better suited for a given project.
In such cases, reviewing the TypeScript source code in this [package's Github repo](https://github.com/tomwanzek/d3-ng2-service) may serve as a starting point for a more tailored solution.

## Installation

To include the package into your **Angular** project, simply use the standard npm package installation command:

```
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Customize service

_Important:_ The component is declared in the same module as the `app.module`.
Change **getForceData()** and then pass the real restful url which generates json. 

```ts
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class IbrarianService {
  constructor(private http: Http) {
    console.log('IbrarianService Initialized...');
  }
  getForceData(): Observable<any> {
    return this.http.get('../assets/mock-data.json').map(res => res.json());
  }
}

```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
To further referece complete D3 modules check out [d3-ng2-service](https://github.com/tomwanzek/d3-ng2-service/blob/master/README.md).

## Demo Project

For a more complete worked example of how this module can be used in an angular-cli created D3 Demo App, please see: 
* Github repo: [FuningTeng/ibrarian_web](https://github.com/FuningTeng/ibrarian_web) and the related [_live_ page](https://ibrarian-2018.firebaseapp.com/).

