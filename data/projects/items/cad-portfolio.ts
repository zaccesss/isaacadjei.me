import type { Project } from "../index"

const _cad_portfolio: Project = {
    id: "cad-portfolio",
    title: "CAD Engineering Design Portfolio",
    description:
      "Three AutoCAD projects covering 2D technical drawing, 3D solid modelling and full product design to the BS 8888 standard.",
    longDescription:
      "I completed a portfolio of three computer-aided design projects in AutoCAD during 2024-2025, spanning precision component drawing, mechanical assembly design and consumer product design. All drawings comply with BS 8888 (Technical Product Documentation), ISO 128 (General Principles of Representation) and ASME Y14.5 (GD&T), with proper title blocks, revision clouds and layer management throughout.\n\nWorking to these standards for the first time made clear how much information a well-constructed engineering drawing must communicate without ambiguity. Every tolerance zone, every surface finish symbol and every datum reference frame is a specification that a machinist or manufacturer will act on directly. Getting those details right was the core learning across all three projects: understanding the difference between bilateral and unilateral tolerances and why a datum reference frame must follow the functional requirements of the assembly rather than drawing convenience.\n\nThe three projects build on each other: a fully documented machined component, then the full design cycle of a mechanical assembly, then a hairdryer designed for injection moulding with safety compliance and assembly instructions.",
    technologies: ["AutoCAD", "CAD", "GD&T", "BS 8888", "3D Modelling", "Technical Drawing"],
    category: "academic",
    featured: false,
    cover: "/images/projects/cad-portfolio/cover.webp",
    order: 13,
    status: "completed",
    images: [
      "/images/projects/cad-portfolio/main.webp",
      "/images/projects/cad-portfolio/3d-model.webp",
      "/images/projects/cad-portfolio/assembly.webp",
    ],
    date: "2025",
    highlights: [
      "Three projects: a precision component, a mechanical assembly design cycle and a hairdryer product design",
      "Full GD&T: datum reference frames, form, orientation and location tolerances in feature control frames",
      "Tolerancing per ISO 286 with surface finish symbols (Ra values) and machining callouts",
      "Assembly drawings with exploded views, balloon callouts, section views and a structured BOM",
      "Consumer product design: injection moulding DFM, IEC 60335 compliance and an assembly sequence",
      "All drawings comply with BS 8888, ISO 128 and ASME Y14.5 with proper title blocks and revision control",
    ],
    sections: [
      { type: "h2", text: "From specification to drawing" },
      {
        type: "p",
        text: "Each project followed the same broad path, with every stage adding information a manufacturer would need. The later projects started further back with a functional specification and ended further forward with assembly documentation.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    S["Functional and<br/>environmental specification"] --> D["2D orthographic views<br/>first-angle projection"]
    D --> T["Dimensions, tolerances<br/>and GD&T"]
    T --> M["3D solid model<br/>extrude, revolve, fillet"]
    M --> A["Assembly, section views<br/>and exploded drawing"]
    A --> B["BOM and assembly<br/>instructions"]`,
        caption: "The design and documentation path across the three projects",
      },
      { type: "h2", text: "Project 1: precision component" },
      {
        type: "p",
        text: "The first project produced complete manufacturing documentation for a precision-machined mechanical component. It has three-view orthographic projections in first-angle projection with full dimensioning, bilateral and unilateral tolerances per ISO 286, geometric tolerances (flatness, perpendicularity and concentricity) in feature control frames and surface finish symbols with Ra values. The 3D solid model was built from base extrude and revolve operations with fillet, chamfer and circular pattern features, then rendered with realistic materials and three-point lighting.",
      },
      {
        type: "image",
        src: "/images/projects/cad-portfolio/3d-model.webp",
        alt: "Rendered AutoCAD 3D solid model of a machined mechanical component",
        caption: "The rendered solid model",
      },
      { type: "h2", text: "Project 2: mechanical assembly" },
      {
        type: "p",
        text: "The second project covered the full design cycle of a functional mechanical assembly, from its functional and environmental specification through to detailed drawings. It includes GD&T datum reference frames, form, orientation and location tolerances and a written rationale for material choice based on strength-to-weight ratio, machinability and corrosion resistance. Section views, an exploded assembly drawing with balloon callouts and a structured BOM that separates off-the-shelf parts from custom parts complete the set.",
      },
      { type: "h2", text: "Project 3: hairdryer product design" },
      {
        type: "p",
        text: "The third project was a full consumer product design for a hairdryer. Designing for injection moulding meant draft angles, uniform wall thickness, a sensible parting line and snap-fit bosses. Inside, the component layout had to isolate vibration and manage heat. The design was also checked against IEC 60335 household appliance safety. It finished with exploded view documentation, hierarchical part numbering and step-by-step assembly instructions.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "The biggest shift was choosing datums by function. A datum picked because it is convenient to draw from can produce a part that measures correctly and still does not fit, because the tolerances are referenced to the wrong surface.",
      },
    ],
    references: [
      { title: "BS 8888: Technical product documentation and specification (BSI)", url: "https://knowledge.bsigroup.com/products/technical-product-documentation-and-specification", note: "The UK standard every drawing follows" },
      { title: "ASME Y14.5: Dimensioning and Tolerancing", url: "https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensioning-tolerancing", note: "The GD&T standard behind the feature control frames" },
    ],
  }

export default _cad_portfolio
