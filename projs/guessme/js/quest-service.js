const KEY = 'questsTree';
var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
var gLastRes = null;

function createQuestsTree() {
    var questsTree = loadFromStorage(KEY);

    if (!questsTree) {
        questsTree = createQuest('Male?');
        questsTree.yes = createQuest('Gandhi');
        questsTree.no = createQuest('Rita');    
    } 
    
    gQuestsTree = questsTree;
    saveQuestsTree();

    gCurrQuest = gQuestsTree;

    gPrevQuest = null;

}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function moveToNextQuest(res) {
    // DONE: update the prev, curr global vars
    gPrevQuest = gCurrQuest;
    gCurrQuest = gPrevQuest[res];
}

function addGuess(newQuestTxt, newGuessTxt) {
    // DONE: Create and Connect the 2 Quests to the quetsions tree
    var newQuest = createQuest(newQuestTxt);
    newQuest.no = gCurrQuest;
    newQuest.yes = createQuest(newGuessTxt);
    (gLastRes === "no")? gPrevQuest.no = newQuest: gPrevQuest.yes = newQuest;
    saveQuestsTree();
}

function getCurrQuest() {
    return gCurrQuest;
}

function updateRes(res) {
    gLastRes = res;
}

function saveQuestsTree() {
    saveToStorage(KEY, gQuestsTree);
}

function restartQuests() {
    updateRes('null');
    gPrevQuest = null;
    gCurrQuest = gQuestsTree;
}
