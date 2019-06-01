var gTrans = {
    title: {
        en: 'Books',
        he: 'ספרים'
    },
    
    add: {
        en: 'add book',
        he: 'הוסף ספר'
    },
    
    bookId: {
        en: 'Id',
        he: 'מספר סידורי'
    },
    
    bookTitle: {
        en: 'Title',
        he: 'כותרת'
    },
    
    bookPrice: {
        en: 'Price',
        he: 'מחיר'
    },
    
    bookActions: {
        en: 'Actions',
        he: 'פעולות'
    },
    
    modalTitle: {
        en: 'Book Detailes',
        he: 'פרטי הספר'
    },
    
    bookName: {
        en: 'Name',
        he: 'שם'
    },
    
    bookRate: {
        en: 'Rate',
        he: 'דירוג'
    },
    
    close: {
        en: 'Close',
        he: 'סגור'
    },
    
    prevPage: {
        en: 'Previous Page',
        he: 'לעמוד הקודם'
    },
    
    nextPage: {
        en: 'Next Page',
        he: 'לעמוד הבא'
    },

    actionRead: {
        en: 'Read',
        he: 'פרטים'
    },

    actionUpdate: {
        en: 'Update',
        he: 'עדכן'
    },

    actionDelete: {
        en: 'Delete',
        he: 'מחק'
    },

    currency: {
        en: '$',
        he: '₪'
    },

    newBookNameEn: {
        en: 'what\'s the new book\'s name in english? (capitalized)',
        he: 'מה שם הספר החדש באנגלית (אותיות ראשונות גדולות)'

    },

    newBookNameHe: {
        en: 'what\'s the new book\'s name in hebrew?',
        he: 'מה שם הספר החדש בעברית?'

    },

    newBookPrice: {
        en: 'what\'s the new book\'s price?',
        he: 'מה המחיר של הספר החדש?'
    },

    updateNewPrice: {
        en: 'what\'s the new price?',
        he: 'מה המחיר החדש?'
    },

    updateBtn: {
        en: 'Update',
        he: 'עדכן'
    }
};

var gCurrLang = 'en';

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        
        var transKey = el.dataset.trans;
        
        var txt = getTrans(transKey);

        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt);
        } else {
            el.innerText = txt;
        }
    }
}

function getTrans(transKey) {
    var keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN';

    var txt = keyTrans[gCurrLang];

    // If not found - use english
    if (!txt) txt = keyTrans['en'];

    return txt;
}

function setLang(lang) {
    gCurrLang = lang;
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num);
}