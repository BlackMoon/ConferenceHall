import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { Mediator } from "../../common/mediator";

import * as SVG from "../../common/svg-utils";

@Component({
    selector: 'shape-properties',
    templateUrl: 'shape-properties.component.html'
})
export class ShapePropertiesComponent implements OnDestroy, OnInit {

    svgElement: any;
    shapeForm: FormGroup;

    private subscription: Subscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private mediator: Mediator) {

        this.subscription.add(
            mediator
                .on<any>("schemeMain_shapeSelected")
                .subscribe(s => {

                    this.svgElement = s;
              
                    let box = s.getBBox(),
                        shape: any = {
                            angle: 0,
                            id: s.getAttribute("data-id"),
                            length: box.height,
                            width: box.width
                        };
                    
                    for (let t of this.svgElement.transform.baseVal) {

                        let m: SVGMatrix = t.matrix;

                        switch (t.type) {
                           
                            // rotate
                            case 4:
                                shape.angle = t.angle;
                                break;
                        }
                    }
               
                    this.shapeForm.patchValue(shape, { emitEvent: false });
                })
        );
    }

    ngOnInit() {

        this.shapeForm = this.fb.group({
            angle: [0],
            id: [null],
            length: [0],
            width: [0]
        });

        this.shapeForm
            .valueChanges
            .subscribe(model => {

                model.angle = model.angle || 0;

                Array.from(this.svgElement.childNodes).forEach((x: HTMLElement) => {

                    switch (x.nodeName) {

                        case "ellipse":
                            
                            x.setAttributeNS(null, "rx", `${model.width / 2}`);
                            x.setAttributeNS(null, "ry", `${model.length / 2}`);

                            break;

                        case "image":
                        case "rect":

                            x.setAttributeNS(null, "height", `${model.length}`);
                            x.setAttributeNS(null, "width", `${model.width}`);

                            break;
                    }
                });

                let attr = [];
                for (let t of this.svgElement.transform.baseVal) {

                    let m: SVGMatrix = t.matrix;

                    // translate
                    if (t.type === 2) {

                        attr.push(`translate(${m.e} ${m.f})`);
                        break;
                    }
                }
                
                // rotate around svgElement center
                this.svgElement.classList.contains(SVG.shapeClass)
                    ? attr.push(`rotate(${model.angle} ${model.width / 2} ${model.length / 2})`)
                    : attr.push(`rotate(${model.angle})`);    

                this.svgElement.setAttributeNS(null, "transform", attr.join(","));

                // метка
                if (model.id != null) {
                    this.svgElement.setAttribute("data-id", model.id);

                    let text = this.svgElement.querySelector("text");
                    text.textContent = model.id;
                }
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();    
    }
    
}