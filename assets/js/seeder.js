var rootSeeder = {
        "name": "root",
        "type": "folder",
        "pwd": "/",
        "size": 0,
        "content": [
            {
                "type": "archive",
                "name": "readme.txt",
                "pwd": "root/",
                "size": 28,
                "date": "1999/10/23",
                "content": "I am a text inside readme.txt"
            },
            {
                "type": "js",
                "name": "calculator.js",
                "pwd": "root/",
                "size": 47,
                "date": "1999/10/28",
                "pathJS": "assets/js/calculator.js"
            },
            {
                "type": "js",
                "name": "myScriptError.js",
                "pwd": "root/",
                "size": 65,
                "date": "1999/10/18",
                "content": 'function haha()){return 3+3}; haha()',
            },
            {
                "type": "folder",
                "name": "src",
                "pwd": "root/",
                "size": 0,
                "content": [
                    {
                        "type": "archive",
                        "name": "log1.txt",
                        "content": "10/Jun/2019 - Macintosh 128k login - status: ok",
                        "size": 2000,
                        "date": "1999/10/22",
                        "pwd": "root/src/"
                    },
                    {
                        "type": "folder",
                        "name": "spam",
                        "pwd": "root/src/",
                        "size": 0,
                        "content": [
                            {
                                "type": "folder",
                                "name": "mountain",
                                "pwd": "root/src/spam/",
                                "size": 0,
                                "content": [
                                    {
                                        "type": "folder",
                                        "name": "Pirinees",
                                        "pwd": "root/src/spam/mountain/",
                                        "size": 0,
                                        "date": "1999/10/24",
                                        "content": [
                                            {
                                                "type": "archive",
                                                "name": "mountain.jpg",
                                                "content": "",
                                                "size": 20000,
                                                "date": "1999/10/21",
                                                "pwd": "root/src/spam/mountain/Pirenees/"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "folder",
                                        "name": "Balcans",
                                        "pwd": "root/src/spam/mountain/",
                                        "size": 0,
                                        "content": [
                                            {
                                                "type": "archive",
                                                "name": "mountain2.jpg",
                                                "content": "",
                                                "size": 30000,
                                                "date": "1999/10/21",
                                                "pwd": "root/src/spam/mountain/Balcans/"
                                            }
                                        ]
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        "type": "archive",
                        "name": "log2.txt",
                        "content": "10/Jun/2019 - Siemens A52 login - status: error",
                        "size": 2000,
                        "date": "1999/10/21",
                        "pwd": "root/src/"
                    },
                    {
                        "type": "folder",
                        "name": "imgs",
                        "pwd": "root/src/",
                        "size": 0,
                        "content": [
                            {
                                "type": "folder",
                                "name": "beach",
                                "pwd": "root/src/imgs/",
                                "size": 0,
                                "content": [
                                    {
                                        "type": "folder",
                                        "name": "barceloneta",
                                        "pwd": "root/src/imgs/beach/",
                                        "size": 0,
                                        "date": "1999/10/24",
                                        "content": []
                                    },
                                    {
                                        "type": "folder",
                                        "name": "masnou",
                                        "pwd": "root/src/imgs/beach/",
                                        "size": 0,
                                        "content": []
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
}

var actualFolderPath = "root";

// Recovering folders/archives from localStorage, if there's no key, then create it
if (localStorage.getItem("root") != null) {
    var root = JSON.parse(localStorage.getItem("root"));
    var actualFolder = root;
    var prevFolder = actualFolder;
} else {
    localStorage.setItem("root", JSON.stringify(rootSeeder));
    var root = JSON.parse(localStorage.getItem("root"));
    var actualFolder = root;
    var prevFolder = actualFolder;
}

totalSize(actualFolder);

function totalSize(folderLayer){
    let folders = folderLayer.content.filter(e => e.type === "folder");
    if(folders.length){
        folders.forEach((folder)=>{
            totalSize(folder);
        })
    }

    let sizes = folderLayer.content.map(e => e.size);
    folderLayer.size = sizes.reduce((a, b) => a + b, 0);
    //console.log("currentFolder size: " + folderLayer.size + " contents size: " + sizes )
}