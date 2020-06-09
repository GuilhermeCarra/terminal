// Recovering commands history from localStorage, if there is no stored commands creates new variables
if (localStorage.getItem("comndHistory") != null) {
    var comndHistory = JSON.parse(localStorage.getItem("comndHistory"));
    var pastComnd = comndHistory.length;
} else {
    var comndHistory = [];
    var pastComnd = 0;
}

$("#terminal__input").keydown(userAction);

// When the user press Tab, Enter, Down Arrow or Up Arrow
function userAction() {
    $(".sugestion-autocomplete").remove();
    // Tab key event to autocomplete the folder/archive name
    if (event.key == "Tab") {
        event.preventDefault();
        var splitComplete = $("#terminal__input").val().split(" ");
        if (splitComplete.length > 1 && splitComplete[1] != "") {
            var autoComplete = splitComplete[splitComplete.length-1];
            let file = actualFolder.content.filter(({name})=> name.includes(autoComplete));
            if (file.length == 1) {
                splitComplete[splitComplete.length-1] = file[0].name;
                splitComplete = splitComplete.join(" ");
                $("#terminal__input").val(splitComplete);
            } else if (file.length > 1) {
                $("<div>").addClass("sugestion-autocomplete").insertAfter(".main__display__input");
                $(file).each((_, e) => {
                    $(".main__display__input").next().append(`<span class="autocomplete">${e.name}/</span>`);
                    document.querySelector(".display__show").scrollTop = document.querySelector(".display__show").scrollHeight;
                });
            }
        }
    }
    if(event.key == "F8"){
        $("#terminal__output").empty();
    }
    // Up arrow key event to recover last commands
    if (event.key == "ArrowUp") {
        event.preventDefault();
        if (pastComnd > 0) pastComnd--;
        $("#terminal__input").val(comndHistory[pastComnd]);
    }
    // Down arrow key event to recover last commands
    if (event.key == "ArrowDown") {
        event.preventDefault();
        if (pastComnd < comndHistory.length -1) pastComnd++;
        $("#terminal__input").val(comndHistory[pastComnd]);
    }
    // Enter key event to send a command
    if (event.key == "Enter") {
        // Printing the command on the terminal
        $("#terminal__output").append($("<p>").text(actualFolderPath + " $ " + $("#terminal__input").val()));
        // Saving command on commands history (localStorage) if it's not equal to the last command saved
        if ($("#terminal__input").val() != comndHistory[comndHistory.length -1]) {
            comndHistory.push($("#terminal__input").val());
            localStorage.setItem("comndHistory", JSON.stringify(comndHistory));
        }
        // Splitting the command for evaluation on Switch
        var input = $("#terminal__input").val().split(" ");

            switch (input[0]){
                case "ls":
                    ls(actualFolder, input[1]);
                break
                case "cd":
                    actualFolder = cd(input[1]);
                    totalSize(actualFolder);
                break
                case "pwd":
                    //Print working directory
                    $("#terminal__output").append($("<p>").text(actualFolder.pwd));
                break;
                case "mkdir":
                    //Create folder
                    mkdir(input[1]);
                break;
                case "echo":
                    //Create files and with the possibility of adding text
                    let echoName = input[1];
                    let echoContent = input;
                    echoContent.splice(0,2);
                    echoContent = echoContent.join(" ");
                    echo(echoName, echoContent);
                break;
                case "cat":
                    //Show content of a created file
                    cat(input[1]);
                break;
                case "rm":
                    //Delete file
                    rm(input[1]);
                break;
                case "mv":
                    //Move file or rename it
                    mv(input[1],input[2]);
                break;
                case "clear":
                    //Clear console window
                    $("#terminal__output").empty();
                break;
                case "help":
                    //Commands availables
                    $("#terminal__output").append($("<p class='help-comnd'>" + "pwd" + "</p>" + "<span class='help'>" + "--Print working directory" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "ls" + "</p>" + "<span class='help'>" + "--Lists contents of files and directories" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "ls -R" + "</p>" + "<span class='help'>" + "--List recursively directory tree" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "ls -S" + "</p>" + "<span class='help'>" + "--Sort by file size" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "ls -t" + "</p>" + "<span class='help'>" + "--Sort by time & date" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "cd" + "</p>" + "<span class='help'>" + "--Change directory or folder" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "cd .." + "</p>" + "<span class='help'>" + "--Change to parent directory" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "mkdir" + "</p>" + "<span class='help'>" + "--Create new directory" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "echo" + "</p>" + "<span class='help'>" + "--Create new file" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "cat" + "</p>" + "<span class='help'>" + "--Display the content of text files" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "rm" + "</p>" + "<span class='help'>" + "--Remove a file" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "mv" + "</p>" + "<span class='help'>" + "--Move files and directories" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "clear" + "</p>" + "<span class='help'>" + "--Clear console window" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "js" + "</p>" + "<span class='help'>" + "--Execute a JavaScript file" + "</span>"))
                    .append($("<br>"+"<p class='help-comnd'>" + "lyrics" + "</p>" + "<span class='help'>" + "--Search a song lyrics" + "</span>"))
                break;
                case "js":
                    // Execute javascript files
                    executeJs(input[1], input[2], input[3], input[4]);
                break;
                case "lyrics":
                    // Without the -p parameter we specify artist and song
                    // Example without -p: lyrics "james blunt" "cold" -> input2=[lyrics , james blunt, , cold]
                    // with the -p parameter we search by a piece of the lyrics
                    // Example with -p: lyrics -p "ya no tiene excusa" // should return the song "Tusa"
                    let input2 = $("#terminal__input").val().split('"');
                    (input[1] === "-p") ? searchSong(input[1], input2[1]) : searchSong(input2[1], input2[3]);
                    break;
                // Manual command
                case "man":
                    {
                        switch (input[1])
                        {
                            case "pwd":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "pwd - Print name of current/working directory" + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" pwd" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Print the full filename of the current working directory." + "</span>"))
                            break;
                            case "ls":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "ls - List directory contents" + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" ls" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... [" + "<span class='synopsis-s'>"+"FILE"+"</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des2'>"+"List  information  about  the FILEs (the current directory by default)."+ "</span>" +  "<span class='man-des2'>"+ "Mandatory arguments to long options are mandatory for short options too." + "</span>"))
                                .append($("<p class='title-man'>" + "OPTIONS" + "</p>"
                                + "<span class='synopsis-t'>"+" -R" +"</span>" + "<span class='man-des'>"+ "List subdirectories recursively." + "</span>" + "<br>"
                                + "<span class='synopsis-t'>"+" -S" +"</span>" + "<span class='man-des'>"+ "Sort by file size, largest first." + "</span>" + "<br>"
                                + "<span class='synopsis-t'>"+" -t" +"</span>" + "<span class='man-des'>"+ "Sort by modification time, newest first." + "</span>"))
                            break;
                            case "cd":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "cd - Change the directory/folder of the terminal's shell." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" pwd" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"DIRECTORY" + "</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Change the current working directory." + "</span>"))
                                .append($("<p class='title-man'>" + "OPTIONS" + "</p>"
                                + "<span class='synopsis-t'>"+" .." +"</span>" + "<span class='man-des'>"+ "Change to parent directory." + "</span>" ))
                            break;
                            case "mkdir":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "mkdir - Make directories." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" mkdir" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... " + "<span class='synopsis-s'>" + "DIRECTORY" + "</span>"+ "..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Print the full filename of the current working directory." + "</span>"))
                            break;
                            case "echo":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "echo - Display a line of text." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" echo" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... [" + "<span class='synopsis-s'>"+"STRING"+"</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Echo the STRING(s) to standard output." + "</span>"))
                            break;
                            case "cat":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "cat - Concatenate files and print on the standard output." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" cat" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... [" + "<span class='synopsis-s'>"+"FILE"+"</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Concatenate FILE(s) to standard output." + "</span>"))
                            break;
                            case "rm":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "rm - Remove files or directories." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" rm" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... [" + "<span class='synopsis-s'>"+"FILE"+"</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Removes each specified file but does not remove directories." + "</span>"))
                            break;
                            case "mv":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "mv - Move (rename) files." + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" mkdir" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]... " + "<span class='synopsis-s'>" + "SOURCE" + "</span>"+ "... " + "</span>" + "<span class='synopsis-s'>" + "DIRECTORY" + "</span>"+ "..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Rename or move SOURCE(s) to DIRECTORY" + "</span>"))
                            break;
                            case "clear":
                                $("#terminal__output").append($("<p class='title-man'>" + "NAME" + "</p>" + "<span class='man-des'>" + "clear - Clear the terminal screen" + "</span>"))
                                .append($("<p class='title-man'>" + "SYNOPSIS" + "</p>"+ "<span class='synopsis-t'>"+" clear" +"</span>" + "<span class='man-des'>" + " [" + "<span class='synopsis-s'>"+"OPTION" + "</span>" + "]..." + "</span>"))
                                .append($("<p class='title-man'>" + "DESCRIPTION" + "</p>"+ "<span class='man-des'>"+"Clears your screen." + "</span>"))
                            break;
                            case "js":
                                $("#terminal__output").append($("<p class='title-man'>NAME</p><span class='man-des'>js - Execute a JavaScript code</span>"))
                                .append($("<p class='title-man'>SYNOPSIS</p><span class='synopsis-t'> js</span><span class='man-des'> [<span class='synopsis-s'>FILE</span>]...<span class='synopsis-s'> OPERATOR</span>... </span><span class='synopsis-s'>NUMBER 1</span>...<span class='synopsis-s'> NUMBER 2</span>...</span>"))
                                .append($("<p class='title-man'>DESCRIPTION</p><span class='man-des'>Run the code inside the selected file.</span>"));
                            break;
                            case "lyrics":
                                $("#terminal__output").append($("<p class='title-man'>NAME</p><span class='man-des'>lyrics - Search a song's lyrics</span>"))
                                .append($("<p class='title-man'>SYNOPSIS</p><span class='synopsis-t'> lyrics</span><span class='man-des'> [<span class='synopsis-s'>OPTION</span>]...<span class='man-des'> [<span class='synopsis-s'>SONG</span>]...</span>"))
                                .append($("<p class='title-man'>DESCRIPTION</p><span class='man-des'>Search the lyrics of a song with the artist-title or just some extract of the song.</span>"))
                                .append($('<p class="title-man">OPTIONS</p><span class="man-des synopsis-t"> [ARTIST NAME]</span><span class="man-des">Artist name, between double quotes "...".</span></br><span class="synopsis-t"> -p</span><span class="man-des margin-left">Search with an extract of the lyrics between double quotes "...".</span>'))
                            break;
                            default:
                                $("#terminal__output").append($(`<p class="error">Wrong command, please use <b class="error">help</b> for a list of options<p>`))
                        }
                    }
                break;
                default:
                    $("#terminal__output").append($(`<p class="error">Wrong command, please use <b class="error">help</b> for a list of options<p>`))
        }
        $('#terminal__input').val("");
        $(".main__display__input span").text(actualFolderPath + " $ ");
        pastComnd = comndHistory.length;
        document.querySelector(".display__show").scrollTop = document.querySelector(".display__show").scrollHeight;
    }
}

function cd(nextFolder) {
    if (nextFolder == "..") {
        actualFolder = prevFolder;
        prevFolder = searchPrevFolder(actualFolder);
    } else {
        let found = false;
        actualFolder.content.forEach((file) => {
            if (file.name == nextFolder && file.type == "folder" && !found) {
                //If the file name matches the search and it is a folder then we change directory and update current
                actualFolder = file;
                prevFolder = searchPrevFolder(file);
                found = true;
            }
        });
        if (!found) {
            $("#terminal__output").append($("<p>").text("Folder does not exist").addClass("error"));
        }
    }
    actualFolderPath = actualFolder.pwd+actualFolder.name;
    return actualFolder;
}

function ls(folder, parameter){
    if(parameter === "-S"){
        folder.content.sort((a, b)=>{
            return a.size - b.size;
        });
        $(folder.content).each((_, e)=>{
            $("#terminal__output").append($(`<p><span>${e.name}</span> -- <span>${e.size}kb</span></p>`));
        })
    }
    else if(parameter === "-R"){
        //We call the function which will be called recursively
        fileWalker(folder);
    }
    else if(parameter === "-t"){
        folder.content.sort((a,b) => {
            return a.date - b.date;
        })
        $(folder.content).each((_, e)=>{
            $("#terminal__output").append($(`<p><span>${e.name}</span> <span>${e.date}</span></p>`));
        })
    }
    else{
        $(folder.content).each((_, e)=>{
            $("#terminal__output").append($(`<span>${e.name}</span><span> </span>`));
        })
    }
}

function fileWalker(folder){
    //if the folder has contents we highlight it
    if(folder.content.length !== 0){
        $("#terminal__output").append($(`<p class='folder_title'><b>./${folder.name}:</b></p>`));
    }
    //once we detect a folder, first we list all the contents
    $(folder.content).each((_, e)=>{
        $("#terminal__output").append($(`<span>${e.name}</span><span> </span>`));
    })
    //then we make recursive calls for every folder inside it
    $(folder.content).each((_, e)=>{
        if(e.type === "folder"){
            fileWalker(e);
        }
    })
}

function mkdir(newFolderName){
    // Verifying if folder already exists
    if (actualFolder.content.find( ({name} ) => name === newFolderName)){
        $("#terminal__output").append($("<p>").text(newFolderName+" folder already exists").addClass("error"));
    } else {
        let newFolder = {"type":"folder","name":newFolderName,"pwd":actualFolderPath+"/","content":[]}
        actualFolder.content.push(newFolder);
        totalSize(actualFolder);
        localStorage.setItem("root", JSON.stringify(root));
    }
}

function echo(fileName, fill){
    // Verifying if file already exists
    if (actualFolder.content.find( ({name} ) => name === fileName)){
        $("#terminal__output").append($("<p>").text(fileName+" file already exists").addClass("error"));
    } else {
        fill ? content = fill : content = "";
        let extension = fileName.slice(-2);
        let type = "archive";

        if (extension === "js") type = "js";

        let size = (Math.random()*((2000-30)+30));
        let newFile = {"type":type,"name":fileName,"pwd":actualFolderPath+"/","content":content, "size": Math.floor(size)};
        actualFolder.content.push(newFile);
        totalSize(actualFolder);
        localStorage.setItem("root", JSON.stringify(root));
    }
}

function cat(fileName) {
    let file = actualFolder.content.find( ({name} ) => name === fileName);
    if (file) {
        $("#terminal__output").append($(`<p class="cat-content">${file.content}</p>`));
    } else {
        $("#terminal__output").append($("<p>").text(fileName+" does not exist").addClass("error"));
    }
}

function rm(file) {
    let index;
    $(actualFolder.content).each((i, element)=>{
        if (element.name == file) {
            index = i;
        }
    });

    if (index > -1) {
        actualFolder.content.splice(index, 1);
    }else{
        $("#terminal__output").append($(`<p class='error'>rm: ${file}: no such file or directory<p>`));
    };
    totalSize(actualFolder);
    localStorage.setItem("root", JSON.stringify(root));
}

function mv(fileName, location){
    let folders = actualFolder.content.filter(e=> e.type === "folder");
    let foldersNames = folders.map(e=> e.name);
    let file = actualFolder.content.find(({name}) => name === fileName);
    let prevFolder = searchPrevFolder(actualFolder);
    let path;
    if(location){
        path = location.split("/");
    }

    if(file !== undefined){
        if(foldersNames.includes(path[0])){
            //If the dest path is part of the current folder
            if(path.length === 1){
                //The dest path is in the first level of subfolders
                $(folders).each((_, e)=>{
                    if(e.name === path[0]){
                        e.content.push(file);
                        rm(file.name);
                    }
                })
            } else{
                //The dest path is in deeper levels of subfolders
                let returnFolder = actualFolder;
                $(path).each((i, e)=>{
                    folders = actualFolder.content.filter(e=> e.type === "folder");
                    foldersNames = folders.map(e=> e.name);
                    if(foldersNames.includes(e)){
                        $(folders).each((_, folder)=>{
                            if(folder.name === e && (i+1 < path.length)){
                                //if there is still more path to 'reach' then we move 'deeper' the actualFolder
                                actualFolder = folder;
                            }else if(folder.name === e && (i+1 === path.length)){
                                //if there is no more path to 'reach' means the file will be 'pushed' inside the folder
                                folder.content.push(file);
                                actualFolder = returnFolder;
                                rm(file.name);
                            }
                        })
                    }else{
                        $("#terminal__output").append($(`<p class='error'>mv: ${location}: no such file or directory<p>`));
                        actualFolder = returnFolder;
                        return false;
                    }
                })
            }
        }else if(path[0] === ".."){
            //if the dest path is contained in the upper level path
            if(path.length === 1){
                //The dest path is in the first level of subfolders
                prevFolder.content.push(file);
                rm(file.name);
            }else{
                //The dest path is in deeper levels of subfolders
                let returnFolder = actualFolder;
                $(path).each((i, e)=>{
                    if(e === ".."){
                        actualFolder = prevFolder;
                        prevFolder = searchPrevFolder(actualFolder);
                    }else{
                        folders = actualFolder.content.filter(e=> e.type === "folder");
                        foldersNames = folders.map(e=> e.name);
                        if(foldersNames.includes(e)){
                            $(folders).each((_, folder)=>{
                                if(folder.name === e && (i+1 < path.length)){
                                    actualFolder = folder;
                                }else if(folder.name === e && (i+1 === path.length)){
                                    folder.content.push(file);
                                    actualFolder = returnFolder;
                                    rm(file.name);
                                }
                            })
                        }else{
                            $("#terminal__output").append($(`<p class='error'>mv: ${location}: no such file or directory<p>`));
                            actualFolder = returnFolder;
                            return false;
                        }
                    }
                })
            }
        }else{
            file.name = location;
        }
    }else{
        $("#terminal__output").append($(`<p class='error'>mv: ${fileName}: no such file or directory<p>`));
    }
    totalSize(actualFolder);
    localStorage.setItem("root", JSON.stringify(root));
}

function executeJs(fileName, op, a, b){
    let file = actualFolder.content.find(({name}) => name === fileName);
    let names = actualFolder.content.map(e=> e.name);

    if(names.includes(fileName)){
        if (file.type === "js"){
            if(file.pathJS && fileName == "calculator.js"){
                $.get(file.pathJS, (code) => {
                    //with GET we obtain in 'code' all the javascript code contained in 'calculator.js'
                    try{
                        //Here we add to the 'code' op(a,b), where op can be 'SUM/REST/MULT' and 'a,b' are numbers
                        var result = (eval(`${code}; ${op}(${a}, ${b})`))
                        $('#terminal__output').append($('<p>Result: '+ result + '<p>').css("color","aqua"));
                    } catch (e){
                        $("#terminal__output").append($(`<p class='error'>JS: ${e}</p>`));
                    }
                });
            }else{
                try {
                    eval(file.content);
                    var result = eval(file.content);
                    $('#terminal__output').append($('<p>Result: '+ result + '<p>').css("color","aqua"));
                } catch (e) {
                    $("#terminal__output").append($(`<p class='error'>JS: ${e}</p>`));
                }
            }
        }else{
            $("#terminal__output").append($(`<p class='error'>JS: ${fileName}: this file is not a javascript type <p>`));
        }
    }else{
        $("#terminal__output").append($(`<p class='error'>JS: ${fileName}: no such file or directory<p>`));
    }
}

function searchPrevFolder(file){
    // Splitting the path of the actual selected folder
    var splitPath = file.pwd.split("/")
    // If the path length has 2 folders means that the previous folder is the ROOT. E.g root/src will give us a size 2 array ;)
    if (splitPath.length <= 2) {
        searchPrev = root;
    } else {
        searchPrev = root;
        // Searching for the previous folder beginning by the root
        for (let i = 1; i < splitPath.length-1; i++) {
            searchPrev = searchPrev.content.find( ({ name }) => name === splitPath[i]);
        }
    }
    return searchPrev;
}

function searchSong(artist, song){
    if(artist === "-p"){
        $.get("https://api.canarado.xyz/lyrics/"+song, (response) => {
            $("#terminal__output").append($(`<p class="lyrics__artist"> ${response.content[0].title}<p>`));
            $("#terminal__output").append($(`<pre class="lyrics__lyrics"> ${response.content[0].lyrics}<pre>`));
        }).then(() => document.querySelector(".display__show").scrollTop = document.querySelector(".display__show").scrollHeight);
    }else{
        $.get("https://api.canarado.xyz/lyrics/"+artist+" "+song, (response) => {
            $("#terminal__output").append($(`<p class="lyrics__artist"> ${response.content[0].title}<p>`));
            $("#terminal__output").append($(`<pre class="lyrics__lyrics"> ${response.content[0].lyrics}<pre>`));
        }).then(() => document.querySelector(".display__show").scrollTop = document.querySelector(".display__show").scrollHeight);
    }
}