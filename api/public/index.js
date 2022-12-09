async function submitForm() {
    const rows = document.getElementById("inputRows").value;
    const columns = document.getElementById("inputColumns").value;
    const pieces = document.getElementById("inputPieces").value;
    const url = `/api/gen?rows=${rows}&columns=${columns}&pieces=${pieces}`;
    const data = await fetch(url);
    const json = await data.json();
    console.log(json);
    createGrid(json.cssData);
    createCode(json.cssData);
}

async function createCode (cssData) {
    const codeElement = document.createElement("code");
    const showCodeElement = document.querySelector("#showCode");
    var divsCode = "";
    cssData.divsCss.forEach((divCss, i) => {
        divsCode += `
        .div${i} {
            ${divCss}
        }
        `
    }
    )
    codeElement.textContent = `
    .grid-parent {
        ${cssData.parentCss}
        }
    ${divsCode}
    `
    showCodeElement.innerHTML = "";
    showCodeElement.appendChild(codeElement);
}


async function createGrid(cssData) {
    const gridElement = document.createElement("div");
    const showGridElement = document.querySelector("#showGrid");
    gridElement.id = "grid-parent";
    gridElement.style = cssData.parentCss;
    showGridElement.innerHTML = "";
    showGridElement.appendChild(gridElement);
    cssData.divsCss.forEach((divCss) => {
        const div = document.createElement("div");
        div.classList.add("grid-child");
        div.style = divCss;
        div.style.backgroundColor = randomColor();
        gridElement.appendChild(div);
    })
}

function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm();
})
