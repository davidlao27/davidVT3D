var nvol = 3; var showAxis = false;
var renderingQuality = 1;
var isPlainShadingOn = "";
var neutralurl, neutraltalkurl, happyurl, happytalkurl = "";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const cmenu = document.getElementById("btmnav");
const btnmenu = document.getElementById("hidbtn");
const nvolchk = document.getElementById("chkvoln");

const chkopen = document.getElementById("chkopen");
const chkclose = document.getElementById("chkclose");
const chkcus1 = document.getElementById("chkcus1");
const chkcus2 = document.getElementById("chkcus2");

const bkcolchk = document.getElementById("chkbkc");
const bkimgchk = document.getElementById("chkbki");
const hemicolchk = document.getElementById("chkhemicol");
const pshadechk = document.getElementById("chkpshade");

if (urlParams.get("nvol") != null) { nvol = urlParams.get("nvol"); }
if (urlParams.get("lvol") != null) { lvol = urlParams.get("lvol"); }
if (urlParams.get("axis") != null) { showAxis = urlParams.get("axis"); }

if (urlParams.get("bkcol") != null) { document.body.style.backgroundColor = "#" + urlParams.get("bkcol"); } else { document.body.style.backgroundColor = "#0F0"; }

if (urlParams.get("bkimg") != null) { document.body.style.backgroundImage = "url('" + urlParams.get("bkimg") + "')"; }

if (urlParams.get("nvol") != null) nvolchk.value = urlParams.get("nvol")
else document.getElementById("chkvoln").value = "11";

if (urlParams.get("hcol") != null) {
    hemicolchk.value = urlParams.get("hcol");
    hcolconfig = urlParams.get("hcol");
} else {
    hemicolchk.value = "0xffffff";
    hcolconfig = "0xffffff";
}

if (urlParams.get("open") != null) {
    chkopen.value = urlParams.get("open")
    neutraltalkurl = urlParams.get("open")
} else {
    chkopen.value = "models/neutral_talking.fbx"
    neutraltalkurl = "models/neutral_talking.fbx"
}

if (urlParams.get("close") != null) {
    chkclose.value = urlParams.get("close")
    neutralurl = urlParams.get("close")
} else {
    chkclose.value = "models/neutral.fbx"
    neutralurl = "models/neutral.fbx"
}


if (urlParams.get("custom1") != null) {
    chkcus1.value = urlParams.get("custom1")
    happytalkurl = urlParams.get("custom1")
} else {
    happytalkurl = "models/neutral_talking.fbx"
}

if (urlParams.get("custom2") != null) {
    chkcus2.value = urlParams.get("custom2")
    happyurl = urlParams.get("custom2")
} else {
    happyurl = "models/neutral.fbx"
}

if (urlParams.get("plainshade") != null) {
    isPlainShadingOn = urlParams.get("plainshade")
    if (urlParams.get("plainshade") == "true")
        pshadechk.checked = true;
} else {
    //defaults to shadowed shading
    isPlainShadingOn = "false";
}

if (urlParams.get("bkcol") != null) document.getElementById("chkbkc").value = urlParams.get("bkcol")
else document.getElementById("chkbkc").value = "0F0";

if (urlParams.get("bkimg") != null) document.getElementById("chkbki").value = urlParams.get("bkimg")
else document.getElementById("chkbki").value = "";

if (urlParams.get("res") != null) renderingQuality = urlParams.get("res")

function openMenu() {
    cmenu.style.visibility = "visible";
}

function hideMenu() {
    cmenu.style.visibility = "hidden";
}

function applySettingsMenu() {
    if (chkcus1.value == "" || chkcus2.value == "")
        window.location.replace("https://davidlao27.github.io/davidVT3D?close=" + chkclose.value + "&open=" + chkopen.value + "&nvol=" + nvolchk.value + "&bkcol=" + bkcolchk.value + "&bkimg=" + bkimgchk.value + "&plainshade=" + pshadechk.checked + "&hcol=" + hemicolchk.value + "&custom1=" + chkopen.value + "&custom2=" + chkclose.value);

    else window.location.replace("https://davidlao27.github.io/davidVT3D?close=" + chkclose.value + "&open=" + chkopen.value + "&nvol=" + nvolchk.value + "&bkcol=" + bkcolchk.value + "&bkimg=" + bkimgchk.value + "&plainshade=" + pshadechk.checked + "&hcol=" + hemicolchk.value + "&custom1=" + chkcus1.value + "&custom2=" + chkcus2.value);
}

function openDocumentation() {
    window.open("https://davidlao27.github.io/davidVT3D/documentation");
}

var vol, beganWorking;
vol = 0; beganWorking = false;

const scene = new THREE.Scene()
if (showAxis == "on") {
    scene.add(new THREE.AxesHelper(5))
}

if (isPlainShadingOn == "true") {
    //sets both white for plain
    const hemi = new THREE.HemisphereLight(Number(hcolconfig), Number(hcolconfig), 10);
    scene.add(hemi)

    //*extra*//
    const dire = new THREE.DirectionalLight(0xffffff, 10);
    scene.add(dire)
} else {
    //"light color" //"shadow color"
    const hemi2 = new THREE.HemisphereLight(Number(hcolconfig), 0x000000, 1.35);
    hemi2.position.set(10, 0, 10) //positions it away
    scene.add(hemi2)
}

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

camera.up.set(0, 0, 1);
const controls = new THREE.OrbitControls(camera, renderer.domElement)
setTimeout(() => {
    controls.target.set(0, 0, 0);
}, 100);
camera.position.set(7, 1.4, 2.5)

var mixer = THREE.AnimationMixer
let modelReady = false
const animationActions = THREE.AnimationAction = []
let activeAction = THREE.AnimationAction
let lastAction = THREE.AnimationAction
const fbxLoader = FBXLoader = new THREE.FBXLoader()
var neutralobj, neutraltalkobj;

fbxLoader.load(
    neutralurl,
    (object) => {
        object.traverse(function (child) {

            if (child.isMesh) {
                child.material.side = THREE.DoubleSide
            }

        });
        neutralobj = object
        console.log("loaded neutral")
        object.scale.set(0.01, 0.01, 0.01)
        object.rotation.z = (Math.PI / 2);
        mixer = new THREE.AnimationMixer(object)

        let example = new THREE.Object3D();
        const animationAction = mixer.clipAction(
            example = object.animations[0]
        )

        animationActions.push(animationAction)
        activeAction = animationActions[0]

        scene.add(object)

        //add an animation from another file
        fbxLoader.load(
            neutraltalkurl,
            (object) => {
                neutraltalkobj = object
                console.log('loaded neutral_talking')

                let example2 = new THREE.Object3D();
                const animationAction2 = mixer.clipAction(
                    example2 = object.animations[0]
                )
                animationActions.push(animationAction2)

                //add an animation from another file
                fbxLoader.load(
                    happyurl,
                    (object) => {
                        console.log('loaded happy')
                        let example3 = new THREE.Object3D();
                        const animationAction3 = mixer.clipAction(
                            example3 = object.animations[0]
                        )
                        animationActions.push(animationAction3)

                        //add an animation from another file
                        fbxLoader.load(
                            happytalkurl,
                            (object) => {
                                console.log('loaded happy_talking');
                                object.animations[0].tracks.shift() //delete the specific track that moves the object forward while running

                                let example4 = new THREE.Object3D();
                                const animationAction4 = mixer.clipAction(
                                    example4 = object.animations[0]
                                )
                                animationActions.push(animationAction4)

                                //finished loading all
                                modelReady = true;
                                animations.neutral();
                                beganWorking = true;
                            },
                            (xhr) => { },
                            (error) => {
                                console.log(error)
                            }
                        )
                    },
                    (xhr) => { },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (xhr) => { },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => { },
    (error) => {
        console.log(error)
    }
)

const animations = {
    neutral: function () {
        setAction(animationActions[0])
    },
    neutral_talk: function () {
        setAction(animationActions[1])
    },
    happy: function () {
        setAction(animationActions[2])
    },
    happy_talk: function () {
        setAction(animationActions[3])
    }
}

const setAction = function (toAction) {
    lastAction = activeAction
    activeAction = toAction
    //lastAction.stop()
    lastAction.fadeOut(0.3)
    activeAction.reset()
    activeAction.fadeIn(0.4)
    activeAction.play()
}

const clock = new THREE.Clock()

async function animate() {
    await requestAnimationFrame(animate);

    await controls.update()

    if (modelReady) {
        await mixer.update(clock.getDelta())
    }

    await render()
}

async function render() {
    await renderer.render(scene, camera);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

renderer.setPixelRatio(window.devicePixelRatio * renderingQuality);
animate()

document.addEventListener('keydown', logKey);

async function logKey(e) {
    if (e.code == "KeyW")
        controls.target.z += 0.2;

    if (e.code == "KeyS")
        controls.target.z -= 0.2;

    if (e.code == "KeyN")
        await animations.happy();

    if (e.code == "KeyM")
        await animations.happy_talk();

    if (e.code == "KeyZ")
        openMenu();
}

const audioContext = new AudioContext();

const startAudio = async (context, volvar) => {
    await context.audioWorklet.addModule('awlet/volume-meter-processor.js');
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const micNode = context.createMediaStreamSource(mediaStream);
    const volumeMeterNode = new AudioWorkletNode(context, 'volume-meter');
    
    volumeMeterNode.port.onmessage = ({ data }) => {
        vol = Math.round(data * 500);
    };
    micNode.connect(volumeMeterNode).connect(context.destination);
};

window.addEventListener("click", async function(event) {
    await startAudio(audioContext, vol);
    audioContext.resume();
});

var talking = false;
var talklow = false;

setInterval(async () => {
    volstr.innerHTML = vol;

    if (beganWorking) {
        if (vol > nvol) {
            talklow = false;

            if (talking == false) {
                animations.neutral_talk();
                talking = true;
            }
        } else if (vol < nvol - 2) {
            if (talklow == false) {
                animations.neutral();
                talklow = true;
                talking = false;
            }
        }
    }
}, 32);