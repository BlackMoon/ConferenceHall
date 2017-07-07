import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { Mediator } from "../../common/mediator";

import * as SVG from "../../common/svg-utils";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'shape-properties',
    styles: [".ui-spinner .ui-inputtext { width: 100%; }"],
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

                    let box = this.svgElement.getBBox();

                    // для меток (ellipse)
                    if (this.svgElement.classList.contains(SVG.markClass)) {
                        let ellipse = this.svgElement.querySelector("ellipse");
                        ellipse && (box = ellipse.getBBox());
                    }

                    let shape: any = {
                            angle: 0,
                            code: s.getAttribute("data-code"),
                            length: box.height,
                            width: box.width
                        };
                    
                    for (let t of this.svgElement.transform.baseVal) {
                        
                        switch (t.type) {
                           
                            case SVGTransform.SVG_TRANSFORM_ROTATE:
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
            code: [null],
            length: [0],
            width: [0]
        });
       
        this.shapeForm
            .valueChanges
            .subscribe(model => {
                
                model.angle = model.angle || 0;
                
                let attr = [];
                for (let t of this.svgElement.transform.baseVal) {
                    
                    if (t.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                        
                        let box = this.svgElement.getBBox();

                        if (this.svgElement.classList.contains(SVG.markClass)) {
                            let ellipse = this.svgElement.querySelector("ellipse");
                            ellipse && (box = ellipse.getBBox());
                        }

                        attr.push(`translate(${t.matrix.e - (model.width - box.width) / 2} ${t.matrix.f - (model.length - box.height) / 2})`);
                        break;
                    }
                }
                
                // rotate around svgElement center
                if (model.angle !== 0.0) {
                    this.svgElement.classList.contains(SVG.shapeClass)
                        ? attr.push(`rotate(${model.angle} ${model.width / 2} ${model.length / 2})`)
                        : attr.push(`rotate(${model.angle})`);
                }

                this.svgElement.setAttributeNS(null, "transform", attr.join(" "));

                // метка
                if (model.code != null) {
                    this.svgElement.setAttribute("data-code", model.code);

                    let text = this.svgElement.querySelector("text");
                    text.textContent = model.code;
                }

                // children's size
                Array.from(this.svgElement.childNodes).forEach((x: HTMLElement) => {

                    switch (x.nodeName) {

                        case "ellipse":

                            x.setAttributeNS(null, "rx", `${model.width / 2}`);
                            x.setAttributeNS(null, "ry", `${model.length / 2}`);

                            break;

                        case "rect":

                            x.setAttributeNS(null, "height", `${model.length}`);
                            x.setAttributeNS(null, "width", `${model.width}`);

                        case "text":
                            // font-size = 1.2 от радиуса
                            x.setAttribute("font-size", `${Math.min(model.length, model.width) * 0.6}`);

                            break;
                    }
                });
        });
    
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();    
    }
    
}