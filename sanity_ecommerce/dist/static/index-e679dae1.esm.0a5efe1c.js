import{s as x,bc as _,e as g,P as w,cs as B,j as a,aj as L,cr as O,af as T,aH as S,ak as A,l as D,a5 as H,a3 as W}from"./sanity.9b4e9c69.js";import{P as z}from"./PaneItem-34e9a828.esm.7a42b7bf.js";import{u as C}from"./index-ae1970a3.esm.2c69d0cd.js";import"./index.e9dc394e.js";var r;function G(n,t){return t||(t=n.slice(0)),Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(t)}}))}const E=x.hr(r||(r=G([`
  background-color: var(--card-border-color);
  height: 1px;
  margin: 0;
  border: none;
`])));function Y(n){const{childItemId:t,index:l,isActive:d,isSelected:u,pane:p,paneKey:f}=n,{features:h}=C(),{collapsed:m}=_(),{defaultLayout:y,displayOptions:c,items:i,menuItems:v,menuItemGroups:I,title:b}=p,P=c==null?void 0:c.showIcons,k=e=>{var o;const s=(o=e.displayOptions)==null?void 0:o.showIcon;return typeof s<"u"?s!==!1:P!==!1};return g(w,{currentMaxWidth:350,"data-testid":"desk-tool-list-pane",id:f,maxWidth:640,minWidth:320,selected:u,children:[B,a(L,{actions:a(O,{menuItems:v,menuItemGroups:I}),backButton:h.backButton&&l>0&&a(T,{as:S,"data-as":"a",icon:A,mode:"bleed"}),title:b}),a(D,{overflow:m?void 0:"auto",children:a(H,{padding:2,space:1,children:i&&i.map((e,o)=>{if(e.type==="divider")return a(W,{paddingY:1,children:a(E,{})},"divider-".concat(o));const s=!d&&t===e.id,j=d&&t===e.id;return a(z,{icon:k(e)?e.icon:!1,id:e.id,layout:y,pressed:s,schemaType:e.schemaType,selected:j,title:e.title,value:e._id&&e.schemaType?{_id:e._id,_type:e.schemaType.name,title:e.title}:void 0},e.id)})})})]})}export{Y as default};
