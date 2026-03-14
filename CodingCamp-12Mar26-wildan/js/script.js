document.addEventListener("DOMContentLoaded", () => {

const greeting = document.getElementById("greeting")
const time = document.getElementById("time")
const date = document.getElementById("date")
const nameInput = document.getElementById("nameInput")

const timerDisplay = document.getElementById("timerDisplay")

const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

const linkName = document.getElementById("linkName")
const linkURL = document.getElementById("linkURL")
const linkList = document.getElementById("linkList")

const themeToggle = document.getElementById("themeToggle")

let timer = 1500
let interval = null

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let links = JSON.parse(localStorage.getItem("links")) || []

/* TIME */

function updateTime(){

const now = new Date()

let hour = now.getHours()
let minute = now.getMinutes()
let second = now.getSeconds()

time.textContent =
hour.toString().padStart(2,'0') + ":" +
minute.toString().padStart(2,'0') + ":" +
second.toString().padStart(2,'0')

date.textContent = now.toDateString()

updateGreeting(hour)

}

setInterval(updateTime,1000)

/* GREETING */

function updateGreeting(hour){

let name = localStorage.getItem("name") || ""

let greet=""

if(hour>=5 && hour<12) greet="Good morning"
else if(hour<17) greet="Good afternoon"
else if(hour<21) greet="Good evening"
else greet="Good night"

greeting.textContent = name ? `${greet}, ${name}` : greet

}

nameInput.value = localStorage.getItem("name") || ""

nameInput.addEventListener("change",()=>{

localStorage.setItem("name",nameInput.value)

})

/* TIMER */

function updateTimer(){

let m = Math.floor(timer/60)
let s = timer%60

timerDisplay.textContent =
m.toString().padStart(2,'0') + ":" +
s.toString().padStart(2,'0')

}

updateTimer()

document.getElementById("startTimer").onclick = () => {

if(interval) return

interval = setInterval(()=>{

timer--
updateTimer()

if(timer<=0){

clearInterval(interval)
interval=null
alert("Focus session complete")

}

},1000)

}

document.getElementById("stopTimer").onclick = () => {

clearInterval(interval)
interval=null

}

document.getElementById("resetTimer").onclick = () => {

timer = 1500
updateTimer()

}

/* TASKS */

function saveTasks(){

localStorage.setItem("tasks",JSON.stringify(tasks))

}

function renderTasks(){

taskList.innerHTML=""

tasks.forEach(task=>{

const li = document.createElement("li")

const span = document.createElement("span")
span.textContent = task.text
if(task.completed) span.classList.add("completed")

span.onclick = () => {

task.completed = !task.completed
saveTasks()
renderTasks()

}

const del = document.createElement("button")
del.textContent="X"

del.onclick = () => {

tasks = tasks.filter(t=>t.id !== task.id)
saveTasks()
renderTasks()

}

li.appendChild(span)
li.appendChild(del)

taskList.appendChild(li)

})

}

document.getElementById("addTask").onclick = () => {

const text = taskInput.value.trim()

if(!text) return

if(tasks.some(t=>t.text === text)){

alert("Duplicate task")
return

}

tasks.push({

id:Date.now(),
text,
completed:false

})

taskInput.value=""

saveTasks()
renderTasks()

}

renderTasks()

/* LINKS */

function saveLinks(){

localStorage.setItem("links",JSON.stringify(links))

}

function renderLinks(){

linkList.innerHTML=""

links.forEach(link=>{

const li = document.createElement("li")

const a = document.createElement("a")

a.href = link.url
a.target="_blank"
a.textContent = link.name

const del = document.createElement("button")
del.textContent="X"

del.onclick = () => {
links = links.filter(l=>l.id!==link.id)
saveLinks()
renderLinks()
}

li.appendChild(a)
li.appendChild(del)
linkList.appendChild(li)
})

}

document.getElementById("addLink").onclick = () => {

let name = linkName.value.trim()
let url = linkURL.value.trim()
if(!name || !url) return
if(!url.startsWith("http")){
url="https://" + url
}

links.push({
id:Date.now(),
name,
url
})

linkName.value=""
linkURL.value=""
saveLinks()
renderLinks()
}

renderLinks()

/* THEME */

const savedTheme = localStorage.getItem("theme")

if(savedTheme){
document.documentElement.setAttribute("data-theme",savedTheme)
}

themeToggle.onclick = () => {
const current = document.documentElement.getAttribute("data-theme")
const next = current === "light" ? "dark" : "light"
document.documentElement.setAttribute("data-theme",next)
localStorage.setItem("theme",next)
}
})