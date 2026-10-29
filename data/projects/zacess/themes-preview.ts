export const ZACESS_THEMES = {
  "version": "0.6.1",
  "styles": {
    "keyword": [
      "bold"
    ],
    "control": [
      "bold"
    ],
    "function": [],
    "type": [],
    "variable": [],
    "parameter": [
      "italic"
    ],
    "property": [],
    "string": [],
    "number": [],
    "comment": [
      "italic"
    ],
    "operator": [],
    "tag": [
      "bold"
    ],
    "attribute": [],
    "regex": [],
    "invalid": [
      "underline"
    ],
    "added": [],
    "removed": [],
    "changed": []
  },
  "sample": [
    {
      "highlight": false,
      "tokens": [
        [
          "comment",
          "// read the page aloud at the reader's pace"
        ]
      ]
    },
    {
      "highlight": false,
      "tokens": [
        [
          "keyword",
          "export"
        ],
        [
          "operator",
          " "
        ],
        [
          "keyword",
          "function"
        ],
        [
          "operator",
          " "
        ],
        [
          "function",
          "speak"
        ],
        [
          "operator",
          "("
        ],
        [
          "parameter",
          "page"
        ],
        [
          "operator",
          ": "
        ],
        [
          "type",
          "Page"
        ],
        [
          "operator",
          ", "
        ],
        [
          "parameter",
          "rate"
        ],
        [
          "operator",
          " = "
        ],
        [
          "number",
          "1.25"
        ],
        [
          "operator",
          "): "
        ],
        [
          "type",
          "string"
        ],
        [
          "operator",
          " {"
        ]
      ]
    },
    {
      "highlight": true,
      "tokens": [
        [
          "operator",
          "  "
        ],
        [
          "control",
          "if"
        ],
        [
          "operator",
          " (!"
        ],
        [
          "variable",
          "page"
        ],
        [
          "operator",
          "."
        ],
        [
          "property",
          "text"
        ],
        [
          "operator",
          ") "
        ],
        [
          "control",
          "return"
        ],
        [
          "operator",
          " "
        ],
        [
          "string",
          "\"\""
        ],
        [
          "operator",
          ";"
        ]
      ]
    },
    {
      "highlight": false,
      "tokens": [
        [
          "operator",
          "  "
        ],
        [
          "control",
          "return"
        ],
        [
          "operator",
          " "
        ],
        [
          "variable",
          "page"
        ],
        [
          "operator",
          "."
        ],
        [
          "property",
          "text"
        ],
        [
          "operator",
          "."
        ],
        [
          "function",
          "replace"
        ],
        [
          "operator",
          "("
        ],
        [
          "regex",
          "/\\s+/g"
        ],
        [
          "operator",
          ", "
        ],
        [
          "string",
          "\" \""
        ],
        [
          "operator",
          ");"
        ]
      ]
    },
    {
      "highlight": false,
      "tokens": [
        [
          "operator",
          "}"
        ]
      ]
    }
  ],
  "themes": [
    {
      "id": "light",
      "name": "Zacess Light",
      "appearance": "light",
      "ui": {
        "background": "#ffffff",
        "foreground": "#111111",
        "border": "#707070",
        "lineHighlight": "#d6dde8",
        "lineNumber": "#4d4d4d",
        "lineNumberActive": "#111111"
      },
      "syntax": {
        "foreground": "#111111",
        "keyword": "#59029f",
        "control": "#5e003c",
        "function": "#0049a3",
        "type": "#003737",
        "variable": "#111111",
        "parameter": "#4c2300",
        "property": "#030075",
        "string": "#004a0e",
        "number": "#4c1b00",
        "comment": "#97016b",
        "operator": "#111111",
        "tag": "#59029f",
        "attribute": "#412300",
        "regex": "#5b0020",
        "invalid": "#5d0002",
        "added": "#005b14",
        "removed": "#5d0002",
        "changed": "#001940"
      },
      "weakest": 8.2
    },
    {
      "id": "dark",
      "name": "Zacess Dark",
      "appearance": "dark",
      "ui": {
        "background": "#121212",
        "foreground": "#f5f5f5",
        "border": "#7a7a7a",
        "lineHighlight": "#2f2f2f",
        "lineNumber": "#b8b8b8",
        "lineNumberActive": "#f5f5f5"
      },
      "syntax": {
        "foreground": "#f5f5f5",
        "keyword": "#d3bdff",
        "control": "#ffd2e6",
        "function": "#84b7fa",
        "type": "#03dedd",
        "variable": "#f5f5f5",
        "parameter": "#ffb97f",
        "property": "#c5e1ff",
        "string": "#1ee646",
        "number": "#ffd9ba",
        "comment": "#80c201",
        "operator": "#f5f5f5",
        "tag": "#d3bdff",
        "attribute": "#ffdb9e",
        "regex": "#f3989e",
        "invalid": "#ffd7d2",
        "added": "#01ea45",
        "removed": "#f39992",
        "changed": "#c9e0ff"
      },
      "weakest": 8.5
    },
    {
      "id": "yellow-on-black",
      "name": "Zacess Yellow on Black",
      "appearance": "dark",
      "ui": {
        "background": "#000000",
        "foreground": "#ffeb3b",
        "border": "#7a7a7a",
        "lineHighlight": "#262626",
        "lineNumber": "#d9d9d9",
        "lineNumberActive": "#ffeb3b"
      },
      "syntax": {
        "foreground": "#ffeb3b",
        "keyword": "#ffffff",
        "control": "#0cedf6",
        "function": "#88c3ff",
        "type": "#e5c7ff",
        "variable": "#ffeb3b",
        "parameter": "#ffcca3",
        "property": "#ffffff",
        "string": "#43f480",
        "number": "#ffa77e",
        "comment": "#88c200",
        "operator": "#ffeb3b",
        "tag": "#ffffff",
        "attribute": "#ffffff",
        "regex": "#ffa1ce",
        "invalid": "#ffa59d",
        "added": "#28f74f",
        "removed": "#ffa59d",
        "changed": "#ddedff"
      },
      "weakest": 9.7
    },
    {
      "id": "cream",
      "name": "Zacess Cream",
      "appearance": "light",
      "ui": {
        "background": "#fdf6e3",
        "foreground": "#000000",
        "border": "#6e6555",
        "lineHighlight": "#c8dadd",
        "lineNumber": "#4a4337",
        "lineNumberActive": "#000000"
      },
      "syntax": {
        "foreground": "#000000",
        "keyword": "#530093",
        "control": "#550036",
        "function": "#004498",
        "type": "#003232",
        "variable": "#000000",
        "parameter": "#441f00",
        "property": "#020068",
        "string": "#00440c",
        "number": "#451700",
        "comment": "#8b0162",
        "operator": "#000000",
        "tag": "#530093",
        "attribute": "#3a1f00",
        "regex": "#52001c",
        "invalid": "#540002",
        "added": "#005512",
        "removed": "#540002",
        "changed": "#001538"
      },
      "weakest": 8.4
    },
    {
      "id": "high-contrast-dark",
      "name": "Zacess High Contrast Dark",
      "appearance": "dark",
      "ui": {
        "background": "#000000",
        "foreground": "#ffffff",
        "border": "#a6a6a6",
        "lineHighlight": "#262626",
        "lineNumber": "#e6e6e6",
        "lineNumberActive": "#f5c400"
      },
      "syntax": {
        "foreground": "#ffffff",
        "keyword": "#f5c400",
        "control": "#ffcdf0",
        "function": "#8fd0ff",
        "type": "#00f4e0",
        "variable": "#ffffff",
        "parameter": "#ffcf9e",
        "property": "#c9a8ff",
        "string": "#20fe34",
        "number": "#ffb27a",
        "comment": "#c7b404",
        "operator": "#ffffff",
        "tag": "#f5c400",
        "attribute": "#fff0b8",
        "regex": "#ffa6c9",
        "invalid": "#ff9e94",
        "added": "#3bff59",
        "removed": "#ffaba3",
        "changed": "#e6f2ff"
      },
      "weakest": 9.9
    },
    {
      "id": "high-contrast-light",
      "name": "Zacess High Contrast Light",
      "appearance": "light",
      "ui": {
        "background": "#ffffff",
        "foreground": "#000000",
        "border": "#262626",
        "lineHighlight": "#c3e5fe",
        "lineNumber": "#262626",
        "lineNumberActive": "#000000"
      },
      "syntax": {
        "foreground": "#000000",
        "keyword": "#4b0091",
        "control": "#8a0046",
        "function": "#00347f",
        "type": "#004f4e",
        "variable": "#000000",
        "parameter": "#6b3100",
        "property": "#1e0090",
        "string": "#005518",
        "number": "#521e00",
        "comment": "#1701fb",
        "operator": "#000000",
        "tag": "#4b0091",
        "attribute": "#4f3200",
        "regex": "#720030",
        "invalid": "#600000",
        "added": "#005518",
        "removed": "#4a0000",
        "changed": "#00307a"
      },
      "weakest": 8.6
    },
    {
      "id": "deep-contrast-dark",
      "name": "Zacess Deep Contrast Dark",
      "appearance": "dark",
      "ui": {
        "background": "#000000",
        "foreground": "#ffffff",
        "border": "#00ffff",
        "lineHighlight": "#262626",
        "lineNumber": "#ffffff",
        "lineNumberActive": "#ffff00"
      },
      "syntax": {
        "foreground": "#ffffff",
        "keyword": "#67aeff",
        "control": "#ffabfd",
        "function": "#ffdf5a",
        "type": "#00ebb1",
        "variable": "#ffffff",
        "parameter": "#ffffff",
        "property": "#c195ff",
        "string": "#ffaa7c",
        "number": "#e19e00",
        "comment": "#00c600",
        "operator": "#ffffff",
        "tag": "#67aeff",
        "attribute": "#c195ff",
        "regex": "#ff80c5",
        "invalid": "#fd8b78",
        "added": "#00f000",
        "removed": "#ffaa7c",
        "changed": "#67aeff"
      },
      "weakest": 9.0
    },
    {
      "id": "deep-contrast-light",
      "name": "Zacess Deep Contrast Light",
      "appearance": "light",
      "ui": {
        "background": "#ffffff",
        "foreground": "#000000",
        "border": "#0f4a85",
        "lineHighlight": "#c8debd",
        "lineNumber": "#000000",
        "lineNumberActive": "#000000"
      },
      "syntax": {
        "foreground": "#000000",
        "keyword": "#002ec2",
        "control": "#950094",
        "function": "#824100",
        "type": "#003a39",
        "variable": "#000000",
        "parameter": "#000000",
        "property": "#2e0078",
        "string": "#870000",
        "number": "#a3005f",
        "comment": "#006108",
        "operator": "#000000",
        "tag": "#002ec2",
        "attribute": "#2e0078",
        "regex": "#a60049",
        "invalid": "#aa0000",
        "added": "#006108",
        "removed": "#730000",
        "changed": "#002ec2"
      },
      "weakest": 7.7
    }
  ]
} as const
