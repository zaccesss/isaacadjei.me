export interface SkillGroup {
  label: string
  skills: string[]
}

export const professionalSkillGroups: SkillGroup[] = [
  {
    label: "Professional & Soft Skills",
    skills: [
      "Problem Solving",
      "Critical Thinking",
      "Communication",
      "Teamwork & Collaboration",
      "Adaptability",
      "Time Management",
      "Attention to Detail",
      "Leadership",
      "Resilience",
      "Multitasking",
      "Organisation",
      "Customer Service",
      "Working Under Pressure",
    ],
  },
  {
    label: "Hardware & Lab Skills",
    skills: [
      "Circuit Design",
      "PCB Layout",
      "Soldering",
      "Breadboarding & Prototyping",
      "Oscilloscope",
      "Function Generator",
      "Bench Power Supply",
      "Logic Analyser",
      "I2C / UART / SPI / CAN",
      "PWM Control",
      "Debugging & Fault Finding",
      "Technical CAD Drawing",
    ],
  },
]

const DEV = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
const TSG = "https://techstack-generator.vercel.app"
const SKI = "https://skillicons.dev/icons?i"
const WIKI = "https://upload.wikimedia.org/wikipedia/commons"

export interface Skill {
  name: string
  icon?: string
  url?: string
}

export interface SkillCategory {
  category: string
  columns: number
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Platforms & Operating Systems",
    columns: 4,
    skills: [
      { name: "Windows", url: "https://www.microsoft.com/windows", icon: `${DEV}/windows11/windows11-original.svg` },
      { name: "macOS", url: "https://www.apple.com/macos/", icon: `${DEV}/apple/apple-original.svg` },
      { name: "Ubuntu", url: "https://ubuntu.com/", icon: `${DEV}/ubuntu/ubuntu-original.svg` },
      { name: "Linux", url: "https://www.kernel.org/", icon: `${DEV}/linux/linux-original.svg` },
    ],
  },
  {
    category: "Core Tools",
    columns: 4,
    skills: [
      { name: "Git", url: "https://git-scm.com/", icon: `${DEV}/git/git-original.svg` },
      { name: "GitHub", url: "https://github.com/", icon: `${TSG}/github-icon.svg` },
      { name: "VS Code", url: "https://code.visualstudio.com/", icon: `${DEV}/vscode/vscode-original.svg` },
      { name: "Visual Studio", url: "https://visualstudio.microsoft.com/", icon: `${DEV}/visualstudio/visualstudio-plain.svg` },
      { name: "Eclipse", url: "https://eclipseide.org/", icon: `${DEV}/eclipse/eclipse-original.svg` },
      { name: "Postman", url: "https://www.postman.com/", icon: `${DEV}/postman/postman-original.svg` },
      { name: "Slack", url: "https://slack.com/", icon: `${DEV}/slack/slack-original.svg` },
      { name: "Gradle", url: "https://gradle.org/", icon: `${DEV}/gradle/gradle-original.svg` },
      { name: "Starship", url: "https://starship.rs/", icon: "https://cdn.simpleicons.org/starship" },
      { name: "tmux", url: "https://github.com/tmux/tmux/wiki", icon: "https://cdn.simpleicons.org/tmux" },
      { name: "Neovim", url: "https://neovim.io/", icon: "https://cdn.simpleicons.org/neovim" },
      { name: "Zsh", url: "https://www.zsh.org/", icon: "https://cdn.simpleicons.org/zsh" },
      { name: "Homebrew", url: "https://brew.sh/", icon: "https://cdn.simpleicons.org/homebrew" },
    ],
  },
  {
    category: "JetBrains Ecosystem",
    columns: 5,
    skills: [
      {
        name: "JetBrains", url: "https://www.jetbrains.com/",
        icon: "https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg",
      },
      { name: "IntelliJ", url: "https://www.jetbrains.com/idea/", icon: `${DEV}/intellij/intellij-original.svg` },
      { name: "PyCharm", url: "https://www.jetbrains.com/pycharm/", icon: `${DEV}/pycharm/pycharm-original.svg` },
      { name: "CLion", url: "https://www.jetbrains.com/clion/", icon: `${DEV}/clion/clion-original.svg` },
      { name: "WebStorm", url: "https://www.jetbrains.com/webstorm/", icon: `${DEV}/webstorm/webstorm-original.svg` },
      { name: "DataGrip", url: "https://www.jetbrains.com/datagrip/", icon: `${DEV}/datagrip/datagrip-original.svg` },
      { name: "PhpStorm", url: "https://www.jetbrains.com/phpstorm/", icon: `${DEV}/phpstorm/phpstorm-original.svg` },
      { name: "RubyMine", url: "https://www.jetbrains.com/ruby/", icon: `${DEV}/rubymine/rubymine-original.svg` },
      { name: "GoLand", url: "https://www.jetbrains.com/go/", icon: `${DEV}/goland/goland-original.svg` },
    ],
  },
  {
    category: "Mobile Development",
    columns: 2,
    skills: [
      { name: "Android Studio", url: "https://developer.android.com/studio", icon: `${DEV}/androidstudio/androidstudio-original.svg` },
      { name: "Kotlin", url: "https://kotlinlang.org/", icon: `${DEV}/kotlin/kotlin-original.svg` },
    ],
  },
  {
    category: "Languages & Software",
    columns: 5,
    skills: [
      { name: "C", url: "https://www.open-std.org/jtc1/sc22/wg14/", icon: `${DEV}/c/c-original.svg` },
      { name: "C++", url: "https://isocpp.org/", icon: `${TSG}/cpp-icon.svg` },
      { name: "C#", url: "https://learn.microsoft.com/dotnet/csharp/", icon: `${TSG}/csharp-icon.svg` },
      { name: "Python", url: "https://www.python.org/", icon: `${TSG}/python-icon.svg` },
      { name: "Java", url: "https://dev.java/", icon: `${TSG}/java-icon.svg` },
      { name: "TypeScript", url: "https://www.typescriptlang.org/", icon: `${TSG}/ts-icon.svg` },
      { name: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript", icon: `${TSG}/js-icon.svg` },
      { name: "HTML", url: "https://html.spec.whatwg.org/", icon: `${DEV}/html5/html5-original.svg` },
      { name: "CSS", url: "https://www.w3.org/Style/CSS/", icon: `${DEV}/css3/css3-original.svg` },
      { name: "MATLAB", url: "https://www.mathworks.com/products/matlab.html", icon: `${DEV}/matlab/matlab-original.svg` },
      { name: "SQL", url: "https://www.iso.org/standard/76583.html", icon: `${DEV}/azuresqldatabase/azuresqldatabase-original.svg` },
      { name: "Go", url: "https://go.dev/", icon: `${DEV}/go/go-original.svg` },
      { name: "Markdown", url: "https://daringfireball.net/projects/markdown/", icon: `${DEV}/markdown/markdown-original.svg` },
      { name: "Rust", url: "https://www.rust-lang.org/", icon: `${DEV}/rust/rust-original.svg` },
      { name: "Assembly", url: "https://developer.arm.com/documentation/", icon: `${DEV}/embeddedc/embeddedc-original.svg` },
      { name: "JSON", url: "https://www.json.org/", icon: `${DEV}/json/json-original.svg` },
      { name: "Lua", url: "https://www.lua.org/", icon: "https://cdn.simpleicons.org/lua" },
    ],
  },
  {
    category: "AI / ML & Data",
    columns: 6,
    skills: [
      { name: "TensorFlow", url: "https://www.tensorflow.org/", icon: `${DEV}/tensorflow/tensorflow-original.svg` },
      { name: "PyTorch", url: "https://pytorch.org/", icon: `${DEV}/pytorch/pytorch-original.svg` },
      { name: "NumPy", url: "https://numpy.org/", icon: `${DEV}/numpy/numpy-original.svg` },
      { name: "Pandas", url: "https://pandas.pydata.org/", icon: `${DEV}/pandas/pandas-original.svg` },
      { name: "Scikit-Learn", url: "https://scikit-learn.org/", icon: `${WIKI}/0/05/Scikit_learn_logo_small.svg` },
      { name: "Jupyter", url: "https://jupyter.org/", icon: `${DEV}/jupyter/jupyter-original.svg` },
      { name: "OpenCV", url: "https://opencv.org/", icon: `${DEV}/opencv/opencv-original.svg` },
      { name: "Matplotlib", url: "https://matplotlib.org/", icon: `${WIKI}/8/84/Matplotlib_icon.svg` },
      { name: "CUDA", url: "https://developer.nvidia.com/cuda-toolkit", icon: "/images/Nvidia_CUDA_Logo.webp" },
    ],
  },
  {
    category: "Frontend",
    columns: 5,
    skills: [
      { name: "Next.js", url: "https://nextjs.org/", icon: `${DEV}/nextjs/nextjs-original.svg` },
      { name: "React", url: "https://react.dev/", icon: `${TSG}/react-icon.svg` },
      { name: "Vue", url: "https://vuejs.org/", icon: `${SKI}=vue` },
      { name: "Tailwind CSS", url: "https://tailwindcss.com/", icon: `${SKI}=tailwind` },
      { name: "Bootstrap", url: "https://getbootstrap.com/", icon: `${SKI}=bootstrap` },
      { name: "Sass", url: "https://sass-lang.com/", icon: `${SKI}=sass` },
      { name: "jQuery", url: "https://jquery.com/", icon: `${SKI}=jquery` },
      { name: "Webpack", url: "https://webpack.js.org/", icon: `${TSG}/webpack-icon.svg` },
      { name: "Electron", url: "https://www.electronjs.org/", icon: `${SKI}=electron` },
      { name: "Vite", url: "https://vite.dev/", icon: "https://cdn.simpleicons.org/vite" },
      { name: "Vitest", url: "https://vitest.dev/", icon: "https://cdn.simpleicons.org/vitest" },
      { name: "Three.js", url: "https://threejs.org/", icon: "https://cdn.simpleicons.org/threedotjs" },
      { name: "Apache ECharts", url: "https://echarts.apache.org/", icon: "https://cdn.simpleicons.org/apacheecharts" },
      { name: "MapLibre", url: "https://maplibre.org/", icon: "https://cdn.simpleicons.org/maplibre" },
      { name: "Alpine.js", url: "https://alpinejs.dev/", icon: "https://cdn.simpleicons.org/alpinedotjs" },
      { name: "Mermaid", url: "https://mermaid.js.org/", icon: "https://cdn.simpleicons.org/mermaid" },
      { name: "WebAssembly", url: "https://webassembly.org/", icon: "https://cdn.simpleicons.org/webassembly" },
    ],
  },
  {
    category: "Backend",
    columns: 5,
    skills: [
      { name: "Node.js", url: "https://nodejs.org/", icon: `${DEV}/nodejs/nodejs-original.svg` },
      { name: "Express", url: "https://expressjs.com/", icon: `${DEV}/express/express-original.svg` },
      { name: "Django", url: "https://www.djangoproject.com/", icon: `${TSG}/django-icon.svg` },
      { name: "Flask", url: "https://flask.palletsprojects.com/", icon: `${DEV}/flask/flask-original.svg` },
      { name: "Laravel", url: "https://laravel.com/", icon: `${SKI}=laravel` },
      { name: "PHP", url: "https://www.php.net/", icon: `${DEV}/php/php-original.svg` },
      { name: "WordPress", url: "https://wordpress.org/", icon: `${DEV}/wordpress/wordpress-original.svg` },
      { name: "Apache", url: "https://httpd.apache.org/", icon: `${DEV}/apache/apache-original.svg` },
      { name: "Composer", url: "https://getcomposer.org/", icon: `${DEV}/composer/composer-original.svg` },
      { name: "GraphQL", url: "https://graphql.org/", icon: `${SKI}=graphql` },
      { name: "FastAPI", url: "https://fastapi.tiangolo.com/", icon: "https://cdn.simpleicons.org/fastapi" },
      { name: "pytest", url: "https://docs.pytest.org/", icon: "https://cdn.simpleicons.org/pytest" },
      { name: "Ruff", url: "https://docs.astral.sh/ruff/", icon: "https://cdn.simpleicons.org/ruff" },
    ],
  },
  {
    category: "Databases",
    columns: 4,
    skills: [
      { name: "MySQL", url: "https://www.mysql.com/", icon: `${TSG}/mysql-icon.svg` },
      { name: "PostgreSQL", url: "https://www.postgresql.org/", icon: `${DEV}/postgresql/postgresql-original.svg` },
      { name: "MongoDB", url: "https://www.mongodb.com/", icon: `${DEV}/mongodb/mongodb-original.svg` },
      { name: "Firebase", url: "https://firebase.google.com/", icon: `${DEV}/firebase/firebase-plain.svg` },
      { name: "Redis", url: "https://redis.io/", icon: "https://cdn.simpleicons.org/redis" },
      { name: "Supabase", url: "https://supabase.com/", icon: "https://cdn.simpleicons.org/supabase" },
      { name: "TiDB", url: "https://www.pingcap.com/tidb/", icon: "https://cdn.simpleicons.org/tidb" },
      { name: "Upstash", url: "https://upstash.com/", icon: "https://cdn.simpleicons.org/upstash" },
    ],
  },
  {
    category: "Cloud & DevOps",
    columns: 5,
    skills: [
      { name: "AWS", url: "https://aws.amazon.com/", icon: `${TSG}/aws-icon.svg` },
      { name: "Azure", url: "https://azure.microsoft.com/", icon: `${DEV}/azure/azure-original.svg` },
      { name: "Google Cloud", url: "https://cloud.google.com/", icon: `${DEV}/googlecloud/googlecloud-original.svg` },
      { name: "Docker", url: "https://www.docker.com/", icon: `${TSG}/docker-icon.svg` },
      { name: "Kubernetes", url: "https://kubernetes.io/", icon: `${TSG}/kubernetes-icon.svg` },
      { name: "Vercel", url: "https://vercel.com/", icon: `${SKI}=vercel` },
      { name: "Cloudflare", url: "https://www.cloudflare.com/", icon: `${SKI}=cloudflare` },
      { name: "GitHub Pages", url: "https://pages.github.com/", icon: `${TSG}/github-icon.svg` },
      { name: "GitHub Actions", url: "https://github.com/features/actions", icon: `${DEV}/githubactions/githubactions-original.svg` },
      { name: "Render", url: "https://render.com/", icon: "https://cdn.simpleicons.org/render" },
      { name: "Sentry", url: "https://sentry.io/", icon: "https://cdn.simpleicons.org/sentry" },
      { name: "Resend", url: "https://resend.com/", icon: "https://cdn.simpleicons.org/resend" },
      { name: "Cloudinary", url: "https://cloudinary.com/", icon: "https://cdn.simpleicons.org/cloudinary" },
      { name: "Grafana", url: "https://grafana.com/", icon: "https://cdn.simpleicons.org/grafana" },
      { name: "Prometheus", url: "https://prometheus.io/", icon: "https://cdn.simpleicons.org/prometheus" },
    ],
  },
  {
    category: "Cyber Security",
    columns: 6,
    skills: [
      { name: "Bash", url: "https://www.gnu.org/software/bash/", icon: `${DEV}/bash/bash-original.svg` },
      { name: "Linux", url: "https://www.kernel.org/", icon: `${DEV}/linux/linux-original.svg` },
      {
        name: "Kali Linux", url: "https://www.kali.org/",
        icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/kalilinux.svg",
      },
      { name: "PowerShell", url: "https://learn.microsoft.com/powershell/", icon: `${WIKI}/2/2f/PowerShell_5.0_icon.png` },
      { name: "Wireshark", url: "https://www.wireshark.org/", icon: `${WIKI}/d/df/Wireshark_icon.svg` },
      { name: "Nmap", url: "https://nmap.org/", icon: "https://nmap.org/images/nmap-logo-256x256.png" },
    ],
  },
  {
    category: "Embedded & Hardware",
    columns: 6,
    skills: [
      { name: "Atmel AVR", url: "https://www.microchip.com/en-us/products/microcontrollers-and-microprocessors/8-bit-mcus/avr-mcus", icon: "/images/atmelavr.webp" },
      { name: "Arduino", url: "https://www.arduino.cc/", icon: `${DEV}/arduino/arduino-original.svg` },
      { name: "Raspberry Pi", url: "https://www.raspberrypi.com/", icon: `${DEV}/raspberrypi/raspberrypi-original.svg` },
      { name: "Embedded C", url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1169.pdf", icon: `${DEV}/embeddedc/embeddedc-original.svg` },
      { name: "KiCad", url: "https://www.kicad.org/", icon: `${WIKI}/5/59/KiCad-Logo.svg` },
      { name: "Eagle", url: "https://www.autodesk.com/products/eagle/overview", icon: "https://cdn.simpleicons.org/eagle" },
      { name: "Proteus", url: "https://www.labcenter.com/", icon: "/images/proteus.webp" },
      { name: "Microchip Studio", url: "https://www.microchip.com/en-us/tools-resources/develop/microchip-studio", icon: "/images/brands/microchip_studio.webp" },
      { name: "PlatformIO", url: "https://platformio.org/", icon: "https://cdn.simpleicons.org/platformio" },
      { name: "SolidWorks", url: "https://www.solidworks.com/", icon: "/images/solidworks.webp" },
      {
        name: "Simulink", url: "https://www.mathworks.com/products/simulink.html",
        icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/Simulink_Logo_%28non-wordmark%29.png",
      },
      { name: "Fusion 360", url: "https://www.autodesk.com/products/fusion-360/overview", icon: "https://cdn.simpleicons.org/autodesk" },
      { name: "AutoCAD", url: "https://www.autodesk.com/products/autocad/overview", icon: "https://cdn.simpleicons.org/autocad" },
      { name: "FPGA", url: "https://www.amd.com/en/products/adaptive-socs-and-fpgas/fpga.html", icon: `${WIKI}/7/7c/AMD_Logo.svg` },
      { name: "VHDL", url: "https://standards.ieee.org/ieee/1076/5179/", icon: `${DEV}/embeddedc/embeddedc-original.svg` },
      { name: "ESP32", url: "https://www.espressif.com/en/products/socs/esp32", icon: "https://cdn.simpleicons.org/espressif" },
      { name: "STM32", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html", icon: "https://cdn.simpleicons.org/stmicroelectronics" },
      { name: "MicroPython", url: "https://micropython.org/", icon: "https://cdn.simpleicons.org/micropython" },
      { name: "MQTT", url: "https://mqtt.org/", icon: "https://cdn.simpleicons.org/mqtt" },
      { name: "FreeRTOS", url: "https://www.freertos.org/" },
      { name: "LaTeX", url: "https://www.latex-project.org/", icon: "https://cdn.simpleicons.org/latex" },
      { name: "Typst", url: "https://typst.app/", icon: "https://cdn.simpleicons.org/typst" },
    ],
  },
  {
    category: "Robotics",
    columns: 4,
    skills: [
      { name: "ROS", url: "https://www.ros.org/", icon: `${DEV}/ros/ros-original.svg` },
      { name: "NVIDIA Jetson", url: "https://developer.nvidia.com/embedded-computing", icon: "https://cdn.simpleicons.org/nvidia" },
      { name: "Gazebo", url: "https://gazebosim.org/", icon: `${DEV}/gazebo/gazebo-original.svg` },
      { name: "PyBullet", url: "https://pybullet.org/", icon: "/images/pybullet.webp" },
      { name: "ArduPilot", url: "https://ardupilot.org/" },
    ],
  },
  {
    category: "Gaming Ecosystem",
    columns: 5,
    skills: [
      { name: "Unity", url: "https://unity.com/", icon: `${DEV}/unity/unity-original.svg` },
      { name: "Unreal Engine", url: "https://www.unrealengine.com/", icon: `${DEV}/unrealengine/unrealengine-original.svg` },
      { name: "NVIDIA", url: "https://www.nvidia.com/", icon: "https://cdn.simpleicons.org/nvidia" },
      { name: "Intel", url: "https://www.intel.com/", icon: `${WIKI}/8/85/Intel_logo_2023.svg` },
      { name: "AMD", url: "https://www.amd.com/", icon: `${WIKI}/7/7c/AMD_Logo.svg` },
      { name: "Steam", url: "https://store.steampowered.com/", icon: "https://cdn.simpleicons.org/steam" },
      { name: "PlayStation", url: "https://www.playstation.com/", icon: "https://cdn.simpleicons.org/playstation" },
      { name: "EA", url: "https://www.ea.com/", icon: "https://cdn.simpleicons.org/ea" },
      { name: "Ubisoft", url: "https://www.ubisoft.com/", icon: "https://cdn.simpleicons.org/ubisoft" },
    ],
  },
  {
    category: "Creative & Productivity",
    columns: 5,
    skills: [
      { name: "Photoshop", url: "https://www.adobe.com/products/photoshop.html", icon: `${DEV}/photoshop/photoshop-plain.svg` },
      { name: "Illustrator", url: "https://www.adobe.com/products/illustrator.html", icon: `${DEV}/illustrator/illustrator-plain.svg` },
      { name: "After Effects", url: "https://www.adobe.com/products/aftereffects.html", icon: `${DEV}/aftereffects/aftereffects-original.svg` },
      { name: "Premiere Pro", url: "https://www.adobe.com/products/premiere.html", icon: `${DEV}/premierepro/premierepro-original.svg` },
      { name: "Blender", url: "https://www.blender.org/", icon: `${DEV}/blender/blender-original.svg` },
      { name: "Figma", url: "https://www.figma.com/", icon: `${DEV}/figma/figma-original.svg` },
      { name: "Canva", url: "https://www.canva.com/", icon: `${DEV}/canva/canva-original.svg` },
      { name: "Notion", url: "https://www.notion.com/", icon: `${DEV}/notion/notion-original.svg` },
      { name: "Obsidian", url: "https://obsidian.md/", icon: `${WIKI}/1/10/2023_Obsidian_logo.svg` },
      { name: "OBS Studio", url: "https://obsproject.com/", icon: "https://cdn.simpleicons.org/obsstudio" },
    ],
  },
]
